/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateProfileUpdate, validateId } = require('../middleware/validation');
const userController = require('../controllers/userController');

// GET /api/users/me - Get current user profile
router.get('/me', verifyFirebaseToken, asyncHandler(userController.getCurrentUser));

// GET /api/users/:id - Get user by ID
router.get('/:id', validateId, asyncHandler(userController.getUserById));

// PUT /api/users/:id - Update user profile
router.put('/:id', verifyFirebaseToken, validateId, validateProfileUpdate, asyncHandler(userController.updateUser));

// DELETE /api/users/:id - Delete user account
router.delete('/:id', verifyFirebaseToken, validateId, asyncHandler(userController.deleteUser));

// GET /api/users/:id/skills - Get user skills
router.get('/:id/skills', validateId, asyncHandler(userController.getUserSkills));

// POST /api/users/:id/skills - Add user skill
router.post('/:id/skills', verifyFirebaseToken, validateId, asyncHandler(userController.addUserSkill));

// DELETE /api/users/:id/skills/:skillId - Remove user skill
router.delete('/:id/skills/:skillId', verifyFirebaseToken, asyncHandler(userController.removeUserSkill));

// GET /api/users/:id/ledger - Get SkillCoin transaction history
router.get('/:id/ledger', verifyFirebaseToken, validateId, asyncHandler(userController.getSkillCoinLedger));

// GET /api/users/:id/posts - Get user posts
router.get('/:id/posts', validateId, asyncHandler(userController.getUserPosts));

// POST /api/users/:id/avatar - Upload user avatar
router.post('/:id/avatar', verifyFirebaseToken, validateId, asyncHandler(userController.uploadAvatar));

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', validateId, asyncHandler(userController.getUserStats));

// POST /api/users/:id/fcm-token - Update FCM token for notifications
router.post('/:id/fcm-token', verifyFirebaseToken, validateId, asyncHandler(userController.updateFCMToken));

module.exports = router;


