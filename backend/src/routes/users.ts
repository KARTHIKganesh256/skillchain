import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.userId,
          email: 'user@example.com',
          username: 'testuser',
          fullName: 'Test User',
          stats: {
            skillcoins: 1000,
            level: 5,
            xp: 2500
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.body },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

