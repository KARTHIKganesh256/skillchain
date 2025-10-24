/**
 * Notification Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateId } = require('../middleware/validation');
const notificationController = require('../controllers/notificationController');

// GET /api/notifications - Get all notifications for current user
router.get('/', verifyFirebaseToken, asyncHandler(notificationController.getNotifications));

// GET /api/notifications/unread - Get unread notifications count
router.get('/unread', verifyFirebaseToken, asyncHandler(notificationController.getUnreadCount));

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', verifyFirebaseToken, validateId, asyncHandler(notificationController.markAsRead));

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', verifyFirebaseToken, asyncHandler(notificationController.markAllAsRead));

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', verifyFirebaseToken, validateId, asyncHandler(notificationController.deleteNotification));

// DELETE /api/notifications - Delete all notifications
router.delete('/', verifyFirebaseToken, asyncHandler(notificationController.deleteAllNotifications));

// PUT /api/notifications/settings - Update notification preferences
router.put('/settings', verifyFirebaseToken, asyncHandler(notificationController.updateSettings));

module.exports = router;


