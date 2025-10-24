import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Admin dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: 1000,
          totalSkills: 500,
          totalSessions: 2500
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

