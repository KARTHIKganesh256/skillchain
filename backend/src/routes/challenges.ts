import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get challenges
router.get('/', authenticateToken, async (req, res) => {
  try {
    const challenges = [
      {
        id: '1',
        title: 'Build a Full-Stack App',
        description: 'Create a complete web application',
        difficultyLevel: 7,
        skillcoinsReward: 1000,
        status: 'active'
      }
    ];
    
    res.json({
      success: true,
      data: { challenges }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

