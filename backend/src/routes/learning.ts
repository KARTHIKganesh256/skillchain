import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get learning sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = [
      {
        id: '1',
        title: 'Python Basics',
        skill: 'Python',
        status: 'scheduled',
        scheduledAt: '2024-01-20T10:00:00Z'
      }
    ];
    
    res.json({
      success: true,
      data: { sessions }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

