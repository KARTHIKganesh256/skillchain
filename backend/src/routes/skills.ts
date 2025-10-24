import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all skills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const skills = [
      {
        id: '1',
        name: 'Python',
        description: 'Python programming language',
        category: 'programming',
        difficultyLevel: 5,
        marketValue: 75000
      },
      {
        id: '2',
        name: 'JavaScript',
        description: 'JavaScript programming language',
        category: 'programming',
        difficultyLevel: 4,
        marketValue: 65000
      }
    ];
    
    res.json({
      success: true,
      data: { skills }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

