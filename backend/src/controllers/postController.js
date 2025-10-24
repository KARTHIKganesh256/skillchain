/**
 * Post Controller
 */

const { getFirestore } = require('../config/firebase');

/**
 * Get all posts with filters
 */
exports.getPosts = async (req, res) => {
  try {
    const db = getFirestore();
    const {
      page = 1,
      limit = 20,
      category,
      type,
      location,
      search
    } = req.query;

    let query = db.collection('posts').where('isActive', '==', true);

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (type && type !== 'all') {
      query = query.where('type', '==', type);
    }

    if (location) {
      query = query.where('location', '==', location);
    }

    // Order and paginate
    query = query.orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();

    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Search filter (client-side for simplicity)
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower)
      );
    }

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
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get posts'
    });
  }
};

/**
 * Get featured/boosted posts
 */
exports.getFeaturedPosts = async (req, res) => {
  try {
    const db = getFirestore();

    const snapshot = await db.collection('posts')
      .where('isActive', '==', true)
      .where('isBoosted', '==', true)
      .where('boostExpiresAt', '>', new Date().toISOString())
      .orderBy('boostExpiresAt', 'desc')
      .limit(10)
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured posts'
    });
  }
};

/**
 * Get posts near user location
 */
exports.getNearbyPosts = async (req, res) => {
  try {
    const db = getFirestore();
    const { latitude, longitude, radius = 50 } = req.query;

    // In a production app, use geohashing or a geospatial database
    // For now, return all posts with location
    const snapshot = await db.collection('posts')
      .where('isActive', '==', true)
      .where('location', '!=', null)
      .orderBy('location')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get nearby posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby posts'
    });
  }
};

/**
 * Get post by ID
 */
exports.getPostById = async (req, res) => {
  try {
    const db = getFirestore();
    const postDoc = await db.collection('posts').doc(req.params.id).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await postDoc.ref.update({
      viewCount: (postDoc.data().viewCount || 0) + 1
    });

    res.json({
      success: true,
      data: {
        id: postDoc.id,
        ...postDoc.data()
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get post'
    });
  }
};

/**
 * Create new post
 */
exports.createPost = async (req, res) => {
  try {
    const db = getFirestore();
    const {
      title,
      description,
      type,
      category,
      skillCoins,
      location,
      duration
    } = req.body;

    const postData = {
      userId: req.user.uid,
      title,
      description,
      type, // 'offer' or 'request'
      category,
      skillCoins: parseInt(skillCoins),
      location: location || null,
      duration: duration || null,
      isActive: true,
      isBoosted: false,
      boostExpiresAt: null,
      viewCount: 0,
      matchCount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const postRef = await db.collection('posts').add(postData);

    // Award SkillCoins for posting
    const postReward = parseInt(process.env.SKILLCOIN_POST_REWARD) || 10;
    await db.collection('users').doc(req.user.uid).update({
      skillCoinBalance: require('firebase-admin').firestore.FieldValue.increment(postReward)
    });

    await db.collection('transactions').add({
      userId: req.user.uid,
      type: 'credit',
      amount: postReward,
      description: `Posted skill: ${title}`,
      postId: postRef.id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        id: postRef.id,
        ...postData
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
};

/**
 * Update post
 */
exports.updatePost = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const postDoc = await db.collection('posts').doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (postDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Remove fields that shouldn't be updated
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.viewCount;

    await db.collection('posts').doc(id).update(updateData);

    const updatedPost = await db.collection('posts').doc(id).get();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        id: updatedPost.id,
        ...updatedPost.data()
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
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

    const postDoc = await db.collection('posts').doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (postDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Soft delete
    await db.collection('posts').doc(id).update({
      isActive: false,
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
 * Boost post (paid feature)
 */
exports.boostPost = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { duration = 7, paymentIntentId } = req.body;

    const postDoc = await db.collection('posts').doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (postDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Calculate boost expiry
    const boostExpiresAt = new Date();
    boostExpiresAt.setDate(boostExpiresAt.getDate() + parseInt(duration));

    await db.collection('posts').doc(id).update({
      isBoosted: true,
      boostExpiresAt: boostExpiresAt.toISOString(),
      boostDuration: parseInt(duration),
      updatedAt: new Date().toISOString()
    });

    // Create payment record
    await db.collection('payments').add({
      userId: req.user.uid,
      postId: id,
      type: 'boost_post',
      amount: duration === 7 ? 500 : duration === 14 ? 900 : 1500,
      status: 'completed',
      paymentIntentId,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Post boosted successfully',
      data: {
        boostExpiresAt: boostExpiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Boost post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to boost post'
    });
  }
};

/**
 * Mark post as completed
 */
exports.completePost = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const postDoc = await db.collection('posts').doc(id).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (postDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.collection('posts').doc(id).update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Post marked as completed'
    });
  } catch (error) {
    console.error('Complete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete post'
    });
  }
};

/**
 * Report post
 */
exports.reportPost = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { reason, description } = req.body;

    await db.collection('reports').add({
      postId: id,
      reportedBy: req.user.uid,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Post reported successfully'
    });
  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report post'
    });
  }
};

/**
 * Get search suggestions
 */
exports.getSearchSuggestions = async (req, res) => {
  try {
    const db = getFirestore();
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get popular categories
    const categories = [
      'Programming',
      'Design',
      'Writing',
      'Marketing',
      'Teaching',
      'Cooking',
      'Photography',
      'Music',
      'Fitness',
      'Languages'
    ];

    const suggestions = categories.filter(cat =>
      cat.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
};


