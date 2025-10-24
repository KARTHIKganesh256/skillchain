/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authRateLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

// Apply auth rate limiter to all routes
router.use(authRateLimiter);

// POST /api/auth/register - Register new user
router.post('/register', validateRegistration, asyncHandler(authController.register));

// POST /api/auth/login - Login user
router.post('/login', validateLogin, asyncHandler(authController.login));

// POST /api/auth/google - Google OAuth login
router.post('/google', asyncHandler(authController.googleLogin));

// POST /api/auth/phone - Phone number login
router.post('/phone', asyncHandler(authController.phoneLogin));

// POST /api/auth/verify-phone - Verify phone OTP
router.post('/verify-phone', asyncHandler(authController.verifyPhone));

// POST /api/auth/logout - Logout user
router.post('/logout', asyncHandler(authController.logout));

// POST /api/auth/refresh - Refresh token
router.post('/refresh', asyncHandler(authController.refreshToken));

// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', asyncHandler(authController.resetPassword));

module.exports = router;


