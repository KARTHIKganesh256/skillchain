/**
 * Admin Controller
 */

const { getFirestore } = require('../config/firebase');
const { sendNotification } = require('../services/notificationService');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const db = getFirestore();

    // Get counts
    const [usersSnapshot, postsSnapshot, matchesSnapshot, transactionsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('posts').get(),
      db.collection('matches').get(),
      db.collection('transactions').get()
    ]);

    // Get active users (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsersSnapshot = await db.collection('users')
      .where('lastLoginAt', '>=', sevenDaysAgo.toISOString())
      .get();

    // Calculate total SkillCoins in circulation
    let totalSkillCoins = 0;
    usersSnapshot.docs.forEach(doc => {
      totalSkillCoins += doc.data().skillCoinBalance || 0;
    });

    // Get revenue (boosted posts and premium subscriptions)
    const paymentsSnapshot = await db.collection('payments')
      .where('status', '==', 'completed')
      .get();

    let totalRevenue = 0;
    paymentsSnapshot.docs.forEach(doc => {
      totalRevenue += doc.data().amount || 0;
    });

    const stats = {
      totalUsers: usersSnapshot.size,
      activeUsers: activeUsersSnapshot.size,
      totalPosts: postsSnapshot.size,
      totalMatches: matchesSnapshot.size,
      totalTransactions: transactionsSnapshot.size,
      totalSkillCoins,
      totalRevenue: totalRevenue / 100, // Convert cents to dollars
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    });
  }
};

/**
 * Get all users with pagination
 */
exports.getAllUsers = async (req, res) => {
  try {
    const db = getFirestore();
    const { page = 1, limit = 20, status, search } = req.query;

    let query = db.collection('users');

    if (status) {
      query = query.where('isActive', '==', status === 'active');
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

/**
 * Get user details
 */
exports.getUserDetails = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user posts
    const postsSnapshot = await db.collection('posts')
      .where('userId', '==', id)
      .get();

    // Get user matches
    const matchesSnapshot = await db.collection('matches')
      .where('participants', 'array-contains', id)
      .get();

    // Get user transactions
    const transactionsSnapshot = await db.collection('transactions')
      .where('userId', '==', id)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const userData = {
      ...userDoc.data(),
      postsCount: postsSnapshot.size,
      matchesCount: matchesSnapshot.size,
      recentTransactions: transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user details'
    });
  }
};

/**
 * Update user status
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { status } = req.body; // active, banned, suspended

    const isActive = status === 'active';

    await db.collection('users').doc(id).update({
      isActive,
      status,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `User status updated to ${status}`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { getAuth } = require('../config/firebase');
    const db = getFirestore();
    const auth = getAuth();
    const { id } = req.params;

    // Delete from Firebase Auth
    await auth.deleteUser(id);

    // Delete user document
    await db.collection('users').doc(id).delete();

    // Clean up user data (posts, matches, etc.)
    const batch = db.batch();

    const postsSnapshot = await db.collection('posts').where('userId', '==', id).get();
    postsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

/**
 * Get all posts with filters
 */
exports.getAllPosts = async (req, res) => {
  try {
    const db = getFirestore();
    const { page = 1, limit = 20, status } = req.query;

    let query = db.collection('posts');

    if (status === 'active') {
      query = query.where('isActive', '==', true);
    } else if (status === 'inactive') {
      query = query.where('isActive', '==', false);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: posts.length
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get posts'
    });
  }
};

/**
 * Delete post
 */
exports.deletePost = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    await db.collection('posts').doc(id).update({
      isActive: false,
      deletedByAdmin: true,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
};

/**
 * Get all reports
 */
exports.getReports = async (req, res) => {
  try {
    const db = getFirestore();
    const { status = 'pending' } = req.query;

    const snapshot = await db.collection('reports')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .get();

    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reports'
    });
  }
};

/**
 * Handle report
 */
exports.handleReport = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { action, notes } = req.body; // approve, reject

    await db.collection('reports').doc(id).update({
      status: action === 'approve' ? 'approved' : 'rejected',
      notes,
      handledBy: req.user.uid,
      handledAt: new Date().toISOString()
    });

    // If approved, take action on the reported content
    if (action === 'approve') {
      const reportDoc = await db.collection('reports').doc(id).get();
      const reportData = reportDoc.data();

      if (reportData.postId) {
        await db.collection('posts').doc(reportData.postId).update({
          isActive: false,
          removedForViolation: true
        });
      }
    }

    res.json({
      success: true,
      message: `Report ${action}ed successfully`
    });
  } catch (error) {
    console.error('Handle report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle report'
    });
  }
};

/**
 * Get detailed analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const db = getFirestore();
    const { startDate, endDate } = req.query;

    // This would include time-series data, charts, etc.
    // For simplicity, returning aggregated data

    const analytics = {
      userGrowth: [],
      postActivity: [],
      skillCoinCirculation: [],
      revenue: []
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
};

/**
 * Get revenue analytics
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const db = getFirestore();

    const paymentsSnapshot = await db.collection('payments')
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .get();

    const revenue = {
      total: 0,
      byType: {
        boost_post: 0,
        premium: 0,
        cashout: 0
      },
      transactions: []
    };

    paymentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      revenue.total += data.amount || 0;
      revenue.byType[data.type] = (revenue.byType[data.type] || 0) + (data.amount || 0);
      revenue.transactions.push({
        id: doc.id,
        ...data
      });
    });

    revenue.total = revenue.total / 100; // Convert to dollars

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue analytics'
    });
  }
};

/**
 * Get user analytics
 */
exports.getUserAnalytics = async (req, res) => {
  try {
    const db = getFirestore();

    const usersSnapshot = await db.collection('users').get();

    const analytics = {
      total: usersSnapshot.size,
      premium: 0,
      active: 0,
      byRole: {}
    };

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.isPremium) analytics.premium++;
      if (data.isActive) analytics.active++;
      analytics.byRole[data.role] = (analytics.byRole[data.role] || 0) + 1;
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user analytics'
    });
  }
};

/**
 * Get skill analytics
 */
exports.getSkillAnalytics = async (req, res) => {
  try {
    const db = getFirestore();

    const postsSnapshot = await db.collection('posts')
      .where('isActive', '==', true)
      .get();

    const skillCategories = {};
    const skillTypes = { offer: 0, request: 0 };

    postsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      skillCategories[data.category] = (skillCategories[data.category] || 0) + 1;
      skillTypes[data.type]++;
    });

    res.json({
      success: true,
      data: {
        categories: skillCategories,
        types: skillTypes
      }
    });
  } catch (error) {
    console.error('Get skill analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get skill analytics'
    });
  }
};

/**
 * Get all transactions
 */
exports.getTransactions = async (req, res) => {
  try {
    const db = getFirestore();
    const { page = 1, limit = 50 } = req.query;

    const snapshot = await db.collection('transactions')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions'
    });
  }
};

/**
 * Send broadcast notification
 */
exports.sendBroadcast = async (req, res) => {
  try {
    const db = getFirestore();
    const { title, body, targetAudience = 'all' } = req.body;

    let query = db.collection('users');

    // Filter by audience
    if (targetAudience === 'premium') {
      query = query.where('isPremium', '==', true);
    } else if (targetAudience === 'active') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.where('lastLoginAt', '>=', sevenDaysAgo.toISOString());
    }

    const usersSnapshot = await query.get();

    // Send notification to all users
    const promises = usersSnapshot.docs.map(doc =>
      sendNotification(doc.id, {
        title,
        body,
        data: {
          type: 'broadcast',
          from: 'admin'
        }
      })
    );

    await Promise.all(promises);

    res.json({
      success: true,
      message: `Broadcast sent to ${usersSnapshot.size} users`
    });
  } catch (error) {
    console.error('Send broadcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send broadcast'
    });
  }
};


