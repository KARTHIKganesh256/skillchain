/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, isAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateId } = require('../middleware/validation');
const adminController = require('../controllers/adminController');

// Apply admin authentication to all routes
router.use(verifyFirebaseToken, isAdmin);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', asyncHandler(adminController.getDashboardStats));

// GET /api/admin/users - Get all users with pagination
router.get('/users', asyncHandler(adminController.getAllUsers));

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', validateId, asyncHandler(adminController.getUserDetails));

// PUT /api/admin/users/:id/status - Update user status (active/banned/suspended)
router.put('/users/:id/status', validateId, asyncHandler(adminController.updateUserStatus));

// DELETE /api/admin/users/:id - Delete user account
router.delete('/users/:id', validateId, asyncHandler(adminController.deleteUser));

// GET /api/admin/posts - Get all posts with filters
router.get('/posts', asyncHandler(adminController.getAllPosts));

// DELETE /api/admin/posts/:id - Delete post
router.delete('/posts/:id', validateId, asyncHandler(adminController.deletePost));

// GET /api/admin/reports - Get all reports
router.get('/reports', asyncHandler(adminController.getReports));

// PUT /api/admin/reports/:id - Handle report (approve/reject)
router.put('/reports/:id', validateId, asyncHandler(adminController.handleReport));

// GET /api/admin/analytics - Get detailed analytics
router.get('/analytics', asyncHandler(adminController.getAnalytics));

// GET /api/admin/analytics/revenue - Get revenue analytics
router.get('/analytics/revenue', asyncHandler(adminController.getRevenueAnalytics));

// GET /api/admin/analytics/users - Get user analytics
router.get('/analytics/users', asyncHandler(adminController.getUserAnalytics));

// GET /api/admin/analytics/skills - Get skill analytics
router.get('/analytics/skills', asyncHandler(adminController.getSkillAnalytics));

// GET /api/admin/transactions - Get all SkillCoin transactions
router.get('/transactions', asyncHandler(adminController.getTransactions));

// POST /api/admin/broadcast - Send broadcast notification
router.post('/broadcast', asyncHandler(adminController.sendBroadcast));

module.exports = router;


