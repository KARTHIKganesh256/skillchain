/**
 * Match Controller
 */

const { getFirestore } = require('../config/firebase');
const { sendNotification } = require('../services/notificationService');

/**
 * Get all matches for current user
 */
exports.getMatches = async (req, res) => {
  try {
    const db = getFirestore();
    const { status } = req.query;

    let query = db.collection('matches')
      .where('participants', 'array-contains', req.user.uid);

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const matches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get matches'
    });
  }
};

/**
 * Get match suggestions based on skills
 */
exports.getMatchSuggestions = async (req, res) => {
  try {
    const db = getFirestore();

    // Get current user's skills
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Find posts that match user's skills needed
    const postsSnapshot = await db.collection('posts')
      .where('isActive', '==', true)
      .where('status', '==', 'open')
      .where('userId', '!=', req.user.uid)
      .limit(20)
      .get();

    let suggestions = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Simple matching algorithm based on skills
    if (userData.skillsNeeded && userData.skillsNeeded.length > 0) {
      suggestions = suggestions.filter(post =>
        post.type === 'offer' &&
        userData.skillsNeeded.some(skill =>
          post.title.toLowerCase().includes(skill.toLowerCase()) ||
          post.category.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get match suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get match suggestions'
    });
  }
};

/**
 * Create a match (show interest in a post)
 */
exports.createMatch = async (req, res) => {
  try {
    const db = getFirestore();
    const { postId, message } = req.body;

    // Get post
    const postDoc = await db.collection('posts').doc(postId).get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const postData = postDoc.data();

    // Cannot match with own post
    if (postData.userId === req.user.uid) {
      return res.status(400).json({
        success: false,
        message: 'Cannot match with your own post'
      });
    }

    // Check if match already exists
    const existingMatch = await db.collection('matches')
      .where('postId', '==', postId)
      .where('requesterId', '==', req.user.uid)
      .limit(1)
      .get();

    if (!existingMatch.empty) {
      return res.status(400).json({
        success: false,
        message: 'Match request already exists'
      });
    }

    const matchData = {
      postId,
      postOwnerId: postData.userId,
      requesterId: req.user.uid,
      participants: [postData.userId, req.user.uid],
      message: message || '',
      status: 'pending', // pending, accepted, rejected, completed
      skillCoins: postData.skillCoins,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const matchRef = await db.collection('matches').add(matchData);

    // Update post match count
    await db.collection('posts').doc(postId).update({
      matchCount: (postData.matchCount || 0) + 1
    });

    // Send notification to post owner
    await sendNotification(postData.userId, {
      title: 'New Match Request',
      body: `Someone is interested in your skill post`,
      data: {
        type: 'match_request',
        matchId: matchRef.id,
        postId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Match request sent successfully',
      data: {
        id: matchRef.id,
        ...matchData
      }
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create match'
    });
  }
};

/**
 * Get match by ID
 */
exports.getMatchById = async (req, res) => {
  try {
    const db = getFirestore();
    const matchDoc = await db.collection('matches').doc(req.params.id).get();

    if (!matchDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const matchData = matchDoc.data();

    // Check authorization
    if (!matchData.participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: {
        id: matchDoc.id,
        ...matchData
      }
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get match'
    });
  }
};

/**
 * Accept match
 */
exports.acceptMatch = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const matchDoc = await db.collection('matches').doc(id).get();

    if (!matchDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const matchData = matchDoc.data();

    // Only post owner can accept
    if (matchData.postOwnerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Only post owner can accept matches'
      });
    }

    await db.collection('matches').doc(id).update({
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create chat between users
    const chatData = {
      participants: matchData.participants,
      matchId: id,
      postId: matchData.postId,
      lastMessage: null,
      lastMessageAt: null,
      createdAt: new Date().toISOString()
    };

    const chatRef = await db.collection('chats').add(chatData);

    // Send notification to requester
    await sendNotification(matchData.requesterId, {
      title: 'Match Accepted!',
      body: 'Your match request has been accepted',
      data: {
        type: 'match_accepted',
        matchId: id,
        chatId: chatRef.id
      }
    });

    res.json({
      success: true,
      message: 'Match accepted successfully',
      data: {
        chatId: chatRef.id
      }
    });
  } catch (error) {
    console.error('Accept match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept match'
    });
  }
};

/**
 * Reject match
 */
exports.rejectMatch = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const matchDoc = await db.collection('matches').doc(id).get();

    if (!matchDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const matchData = matchDoc.data();

    // Only post owner can reject
    if (matchData.postOwnerId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Only post owner can reject matches'
      });
    }

    await db.collection('matches').doc(id).update({
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Match rejected'
    });
  } catch (error) {
    console.error('Reject match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject match'
    });
  }
};

/**
 * Complete match and transfer SkillCoins
 */
exports.completeMatch = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { completedBy } = req.body; // 'provider' or 'requester'

    const matchDoc = await db.collection('matches').doc(id).get();

    if (!matchDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const matchData = matchDoc.data();

    // Check authorization
    if (!matchData.participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get post to determine SkillCoin transfer direction
    const postDoc = await db.collection('posts').doc(matchData.postId).get();
    const postData = postDoc.data();

    let fromUserId, toUserId;

    if (postData.type === 'offer') {
      // Post owner offers skill, requester pays
      fromUserId = matchData.requesterId;
      toUserId = matchData.postOwnerId;
    } else {
      // Post owner requests skill, post owner pays
      fromUserId = matchData.postOwnerId;
      toUserId = matchData.requesterId;
    }

    // Check if payer has enough SkillCoins
    const payerDoc = await db.collection('users').doc(fromUserId).get();
    const payerBalance = payerDoc.data().skillCoinBalance;

    if (payerBalance < matchData.skillCoins) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient SkillCoins'
      });
    }

    // Transfer SkillCoins
    const batch = db.batch();

    // Deduct from payer
    batch.update(db.collection('users').doc(fromUserId), {
      skillCoinBalance: require('firebase-admin').firestore.FieldValue.increment(-matchData.skillCoins)
    });

    // Add to receiver
    batch.update(db.collection('users').doc(toUserId), {
      skillCoinBalance: require('firebase-admin').firestore.FieldValue.increment(matchData.skillCoins)
    });

    // Update match status
    batch.update(db.collection('matches').doc(id), {
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy,
      updatedAt: new Date().toISOString()
    });

    // Create transactions
    const transactionTime = new Date().toISOString();

    await db.collection('transactions').add({
      userId: fromUserId,
      type: 'debit',
      amount: matchData.skillCoins,
      description: `Skill exchange completed`,
      matchId: id,
      createdAt: transactionTime
    });

    await db.collection('transactions').add({
      userId: toUserId,
      type: 'credit',
      amount: matchData.skillCoins,
      description: `Skill exchange completed`,
      matchId: id,
      createdAt: transactionTime
    });

    await batch.commit();

    // Send notifications
    await sendNotification(toUserId, {
      title: 'SkillCoins Received!',
      body: `You earned ${matchData.skillCoins} SkillCoins`,
      data: {
        type: 'skillcoins_received',
        matchId: id,
        amount: matchData.skillCoins.toString()
      }
    });

    res.json({
      success: true,
      message: 'Match completed and SkillCoins transferred successfully'
    });
  } catch (error) {
    console.error('Complete match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete match'
    });
  }
};

/**
 * Rate match partner
 */
exports.rateMatch = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { rating, review } = req.body;

    const matchDoc = await db.collection('matches').doc(id).get();

    if (!matchDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const matchData = matchDoc.data();

    // Get the other user in the match
    const otherUserId = matchData.participants.find(p => p !== req.user.uid);

    // Add rating
    await db.collection('ratings').add({
      matchId: id,
      ratedBy: req.user.uid,
      ratedUser: otherUserId,
      rating: parseInt(rating),
      review: review || '',
      createdAt: new Date().toISOString()
    });

    // Update user's average rating
    const ratingsSnapshot = await db.collection('ratings')
      .where('ratedUser', '==', otherUserId)
      .get();

    const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    await db.collection('users').doc(otherUserId).update({
      rating: averageRating,
      reviewCount: ratings.length
    });

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rate match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
};


