/**
 * User Controller
 */

const { getFirestore } = require('../config/firebase');

/**
 * Get current user profile
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userDoc.data()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.params.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    // Remove sensitive information
    delete userData.fcmToken;
    delete userData.stripeCustomerId;

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

/**
 * Update user profile
 */
exports.updateUser = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Remove fields that shouldn't be updated directly
    delete updateData.uid;
    delete updateData.skillCoinBalance;
    delete updateData.role;
    delete updateData.createdAt;

    await db.collection('users').doc(id).update(updateData);

    const updatedUser = await db.collection('users').doc(id).get();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser.data()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Delete user account
 */
exports.deleteUser = async (req, res) => {
  try {
    const { getAuth } = require('../config/firebase');
    const db = getFirestore();
    const auth = getAuth();
    const { id } = req.params;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Delete user from Firebase Auth
    await auth.deleteUser(id);

    // Delete user document
    await db.collection('users').doc(id).delete();

    // Delete user's posts, chats, etc. (cascade delete)
    const batch = db.batch();

    // Delete posts
    const posts = await db.collection('posts').where('userId', '==', id).get();
    posts.forEach(doc => batch.delete(doc.ref));

    // Delete matches
    const matches = await db.collection('matches').where('userId', '==', id).get();
    matches.forEach(doc => batch.delete(doc.ref));

    await batch.commit();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

/**
 * Get user skills
 */
exports.getUserSkills = async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.params.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        skillsOffered: userData.skillsOffered || [],
        skillsNeeded: userData.skillsNeeded || []
      }
    });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user skills'
    });
  }
};

/**
 * Add user skill
 */
exports.addUserSkill = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { skill, type } = req.body; // type: 'offered' or 'needed'

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const userRef = db.collection('users').doc(id);
    const field = type === 'offered' ? 'skillsOffered' : 'skillsNeeded';

    await userRef.update({
      [field]: require('firebase-admin').firestore.FieldValue.arrayUnion(skill),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Skill added successfully'
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill'
    });
  }
};

/**
 * Remove user skill
 */
exports.removeUserSkill = async (req, res) => {
  try {
    const db = getFirestore();
    const { id, skillId } = req.params;
    const { type } = req.body;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const userRef = db.collection('users').doc(id);
    const field = type === 'offered' ? 'skillsOffered' : 'skillsNeeded';

    await userRef.update({
      [field]: require('firebase-admin').firestore.FieldValue.arrayRemove(skillId),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove skill'
    });
  }
};

/**
 * Get SkillCoin transaction ledger
 */
exports.getSkillCoinLedger = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const transactions = await db.collection('transactions')
      .where('userId', '==', id)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const ledger = transactions.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: ledger
    });
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction history'
    });
  }
};

/**
 * Get user posts
 */
exports.getUserPosts = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const posts = await db.collection('posts')
      .where('userId', '==', id)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const postList = posts.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: postList
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user posts'
    });
  }
};

/**
 * Upload user avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { photoURL } = req.body;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.collection('users').doc(id).update({
      photoURL,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { photoURL }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

/**
 * Get user statistics
 */
exports.getUserStats = async (req, res) => {
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

    const userData = userDoc.data();

    // Get post count
    const postsSnapshot = await db.collection('posts')
      .where('userId', '==', id)
      .where('isActive', '==', true)
      .get();

    // Get completed matches count
    const matchesSnapshot = await db.collection('matches')
      .where('userId', '==', id)
      .where('status', '==', 'completed')
      .get();

    const stats = {
      skillCoinBalance: userData.skillCoinBalance,
      rating: userData.rating,
      reviewCount: userData.reviewCount,
      postsCount: postsSnapshot.size,
      completedTasksCount: matchesSnapshot.size,
      isPremium: userData.isPremium,
      memberSince: userData.createdAt
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
};

/**
 * Update FCM token for notifications
 */
exports.updateFCMToken = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { fcmToken } = req.body;

    // Check authorization
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.collection('users').doc(id).update({
      fcmToken,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'FCM token updated successfully'
    });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FCM token'
    });
  }
};


