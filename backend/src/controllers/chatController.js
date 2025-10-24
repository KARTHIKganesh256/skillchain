/**
 * Chat Controller
 */

const { getFirestore } = require('../config/firebase');
const { sendNotification } = require('../services/notificationService');

/**
 * Get all chats for current user
 */
exports.getChats = async (req, res) => {
  try {
    const db = getFirestore();

    const snapshot = await db.collection('chats')
      .where('participants', 'array-contains', req.user.uid)
      .orderBy('lastMessageAt', 'desc')
      .get();

    const chats = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const chatData = doc.data();
        
        // Get other participant's info
        const otherUserId = chatData.participants.find(p => p !== req.user.uid);
        const userDoc = await db.collection('users').doc(otherUserId).get();
        const userData = userDoc.data();

        // Get unread count
        const unreadSnapshot = await db.collection('chats').doc(doc.id)
          .collection('messages')
          .where('senderId', '==', otherUserId)
          .where('read', '==', false)
          .get();

        return {
          id: doc.id,
          ...chatData,
          otherUser: {
            uid: otherUserId,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          },
          unreadCount: unreadSnapshot.size
        };
      })
    );

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chats'
    });
  }
};

/**
 * Get chat by ID
 */
exports.getChatById = async (req, res) => {
  try {
    const db = getFirestore();
    const chatDoc = await db.collection('chats').doc(req.params.id).get();

    if (!chatDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const chatData = chatDoc.data();

    // Check authorization
    if (!chatData.participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: {
        id: chatDoc.id,
        ...chatData
      }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat'
    });
  }
};

/**
 * Create new chat
 */
exports.createChat = async (req, res) => {
  try {
    const db = getFirestore();
    const { participantId, postId } = req.body;

    // Check if chat already exists
    const existingChat = await db.collection('chats')
      .where('participants', 'array-contains', req.user.uid)
      .get();

    const chat = existingChat.docs.find(doc => {
      const data = doc.data();
      return data.participants.includes(participantId);
    });

    if (chat) {
      return res.json({
        success: true,
        message: 'Chat already exists',
        data: {
          id: chat.id,
          ...chat.data()
        }
      });
    }

    // Create new chat
    const chatData = {
      participants: [req.user.uid, participantId],
      postId: postId || null,
      lastMessage: null,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const chatRef = await db.collection('chats').add(chatData);

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: {
        id: chatRef.id,
        ...chatData
      }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat'
    });
  }
};

/**
 * Get messages for a chat
 */
exports.getMessages = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    // Check chat access
    const chatDoc = await db.collection('chats').doc(id).get();

    if (!chatDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (!chatDoc.data().participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    let query = db.collection('chats').doc(id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    if (before) {
      query = query.where('createdAt', '<', before);
    }

    const snapshot = await query.get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

/**
 * Send message
 */
exports.sendMessage = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { message, type = 'text', mediaUrl } = req.body;

    // Check chat access
    const chatDoc = await db.collection('chats').doc(id).get();

    if (!chatDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const chatData = chatDoc.data();

    if (!chatData.participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Create message
    const messageData = {
      senderId: req.user.uid,
      message,
      type, // text, image, audio
      mediaUrl: mediaUrl || null,
      read: false,
      createdAt: new Date().toISOString()
    };

    const messageRef = await db.collection('chats').doc(id)
      .collection('messages')
      .add(messageData);

    // Update chat last message
    await db.collection('chats').doc(id).update({
      lastMessage: message,
      lastMessageAt: new Date().toISOString()
    });

    // Get sender info
    const senderDoc = await db.collection('users').doc(req.user.uid).get();
    const senderName = senderDoc.data().displayName;

    // Send notification to other participant
    const recipientId = chatData.participants.find(p => p !== req.user.uid);
    await sendNotification(recipientId, {
      title: senderName,
      body: message,
      data: {
        type: 'new_message',
        chatId: id,
        senderId: req.user.uid
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: messageRef.id,
        ...messageData
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

/**
 * Mark chat as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    // Check chat access
    const chatDoc = await db.collection('chats').doc(id).get();

    if (!chatDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (!chatDoc.data().participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Mark all unread messages as read
    const unreadMessages = await db.collection('chats').doc(id)
      .collection('messages')
      .where('senderId', '!=', req.user.uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    unreadMessages.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Chat marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark chat as read'
    });
  }
};

/**
 * Delete chat
 */
exports.deleteChat = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    // Check chat access
    const chatDoc = await db.collection('chats').doc(id).get();

    if (!chatDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (!chatDoc.data().participants.includes(req.user.uid)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Delete all messages
    const messages = await db.collection('chats').doc(id)
      .collection('messages')
      .get();

    const batch = db.batch();
    messages.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete chat
    batch.delete(db.collection('chats').doc(id));

    await batch.commit();

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat'
    });
  }
};

/**
 * Send typing indicator
 */
exports.sendTypingIndicator = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;
    const { typing } = req.body;

    // In a real-time system, this would update a real-time database
    // For now, just acknowledge
    res.json({
      success: true,
      message: 'Typing indicator updated'
    });
  } catch (error) {
    console.error('Typing indicator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update typing indicator'
    });
  }
};


