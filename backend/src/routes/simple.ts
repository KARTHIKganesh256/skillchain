import express from 'express';
import { authenticateToken } from '../middleware/auth';

// Import controllers
import * as userController from '../controllers/userController';
import * as postController from '../controllers/postController';
import * as matchController from '../controllers/matchController';
import * as chatController from '../controllers/chatController';
import * as paymentController from '../controllers/paymentController';
import * as notificationController from '../controllers/notificationController';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'SkillChain API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);
router.get('/users/:id/skills', userController.getUserSkills);
router.post('/users/:id/skills', authenticateToken, userController.addUserSkill);
router.delete('/users/:id/skills/:skillId', authenticateToken, userController.removeUserSkill);
router.get('/users/:id/ledger', authenticateToken, userController.getUserLedger);
router.post('/users/:id/ledger', authenticateToken, userController.addTransaction);

// Skills routes
router.get('/skills', postController.getAllSkills);
router.get('/skills/:id', postController.getSkillById);
router.post('/skills', authenticateToken, postController.createSkill);
router.put('/skills/:id', authenticateToken, postController.updateSkill);
router.delete('/skills/:id', authenticateToken, postController.deleteSkill);
router.get('/skills/category/:category', postController.getSkillsByCategory);
router.get('/skills/trending', postController.getTrendingSkills);

// Posts routes
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', authenticateToken, postController.createPost);
router.put('/posts/:id', authenticateToken, postController.updatePost);
router.delete('/posts/:id', authenticateToken, postController.deletePost);
router.post('/posts/:id/boost', authenticateToken, postController.boostPost);
router.get('/posts/user/:userId', postController.getUserPosts);
router.get('/posts/search', postController.searchPosts);

// Matches routes
router.get('/matches', authenticateToken, matchController.getUserMatches);
router.get('/matches/:id', authenticateToken, matchController.getMatchById);
router.post('/matches', authenticateToken, matchController.createMatch);
router.put('/matches/:id/accept', authenticateToken, matchController.acceptMatch);
router.put('/matches/:id/reject', authenticateToken, matchController.rejectMatch);
router.put('/matches/:id/complete', authenticateToken, matchController.completeMatch);
router.delete('/matches/:id', authenticateToken, matchController.deleteMatch);

// Chat routes
router.get('/chats', authenticateToken, chatController.getUserChats);
router.get('/chats/:id', authenticateToken, chatController.getChatById);
router.post('/chats', authenticateToken, chatController.createChat);
router.post('/chats/:id/messages', authenticateToken, chatController.sendMessage);
router.put('/chats/:id/read', authenticateToken, chatController.markAsRead);
router.delete('/chats/:id', authenticateToken, chatController.deleteChat);

// Payment routes
router.post('/payments/create-intent', authenticateToken, paymentController.createPaymentIntent);
router.post('/payments/subscribe', authenticateToken, paymentController.subscribePremium);
router.post('/payments/cashout', authenticateToken, paymentController.requestCashout);
router.get('/payments/history', authenticateToken, paymentController.getPaymentHistory);
router.get('/payments/:id', authenticateToken, paymentController.getPaymentById);

// Notification routes
router.get('/notifications', authenticateToken, notificationController.getUserNotifications);
router.put('/notifications/:id/read', authenticateToken, notificationController.markAsRead);
router.put('/notifications/read-all', authenticateToken, notificationController.markAllAsRead);
router.delete('/notifications/:id', authenticateToken, notificationController.deleteNotification);

// Admin routes
router.get('/admin/dashboard', authenticateToken, adminController.getDashboard);
router.get('/admin/users', authenticateToken, adminController.getAllUsers);
router.get('/admin/posts', authenticateToken, adminController.getAllPosts);
router.get('/admin/analytics', authenticateToken, adminController.getAnalytics);
router.post('/admin/broadcast', authenticateToken, adminController.broadcastNotification);
router.put('/admin/users/:id/ban', authenticateToken, adminController.banUser);
router.put('/admin/users/:id/unban', authenticateToken, adminController.unbanUser);
router.delete('/admin/posts/:id', authenticateToken, adminController.deletePost);

export default router;

