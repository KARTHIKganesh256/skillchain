import express from 'express';

const router = express.Router();

// Simple test routes
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

router.get('/skills', (req, res) => {
  res.json({
    success: true,
    data: {
      skills: [
        { id: '1', name: 'Python', level: 5 },
        { id: '2', name: 'JavaScript', level: 4 },
        { id: '3', name: 'React', level: 6 }
      ]
    }
  });
});

export default router;

