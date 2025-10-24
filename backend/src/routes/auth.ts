import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { User } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               username:
 *                 type: string
 *                 minLength: 3
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/),
  body('fullName').notEmpty().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password, username, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists with this email or username' 
      });
    }

    // Create user in Supabase
    const { data: supabaseUser, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName
        }
      }
    });

    if (supabaseError) {
      return res.status(400).json({ 
        error: 'Failed to create user in Supabase', 
        details: supabaseError.message 
      });
    }

    // Create user in MongoDB
    const user = new User({
      supabaseId: supabaseUser.user?.id,
      email,
      username,
      fullName,
      isVerified: false,
      stats: {
        skillcoins: 100, // Welcome bonus
        level: 1,
        xp: 0
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, supabaseId: user.supabaseId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        isVerified: user.isVerified,
        stats: user.stats
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (supabaseError) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        details: supabaseError.message
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ supabaseId: supabaseData.user?.id });
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, supabaseId: user.supabaseId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        isVerified: user.isVerified,
        stats: user.stats
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login'
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to logout'
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
        timezone: user.timezone,
        language: user.language,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        preferences: user.preferences,
        stats: user.stats,
        lastActive: user.lastActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get user profile'
    });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid token
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      });
    }

    // Generate new JWT token
    const token = jwt.sign(
      { userId: user._id, supabaseId: user.supabaseId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to refresh token'
    });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found with this email' 
      });
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) {
      return res.status(400).json({ 
        error: 'Failed to send reset email',
        details: error.message
      });
    }

    res.json({ 
      message: 'Password reset email sent successfully' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process password reset request'
    });
  }
});

export default router;

