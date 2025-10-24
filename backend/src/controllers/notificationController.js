/**
 * Notification Controller
 */

const { getFirestore } = require('../config/firebase');

/**
 * Get all notifications for current user
 */
exports.getNotifications = async (req, res) => {
  try {
    const db = getFirestore();
    const { limit = 50 } = req.query;

    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
};

/**
 * Get unread notifications count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const db = getFirestore();

    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();

    res.json({
      success: true,
      data: {
        count: snapshot.size
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const notificationDoc = await db.collection('notifications').doc(id).get();

    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notificationDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.collection('notifications').doc(id).update({
      read: true,
      readAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const db = getFirestore();

    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    const now = new Date().toISOString();

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: now
      });
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

/**
 * Delete notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const db = getFirestore();
    const { id } = req.params;

    const notificationDoc = await db.collection('notifications').doc(id).get();

    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notificationDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.collection('notifications').doc(id).delete();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

/**
 * Delete all notifications
 */
exports.deleteAllNotifications = async (req, res) => {
  try {
    const db = getFirestore();

    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .get();

    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications'
    });
  }
};

/**
 * Update notification preferences
 */
exports.updateSettings = async (req, res) => {
  try {
    const db = getFirestore();
    const {
      emailNotifications = true,
      pushNotifications = true,
      matchNotifications = true,
      messageNotifications = true,
      skillCoinNotifications = true
    } = req.body;

    const settings = {
      emailNotifications,
      pushNotifications,
      matchNotifications,
      messageNotifications,
      skillCoinNotifications,
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(req.user.uid).update({
      notificationSettings: settings
    });

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings'
    });
  }
};


