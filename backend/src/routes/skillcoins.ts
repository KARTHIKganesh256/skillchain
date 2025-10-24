import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get SkillCoin balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        balance: 2500,
        transactions: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

