/**
 * SkillChain Backend Server
 * Main entry point for the Express API server
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Import configurations
const { initializeSupabase, testSupabaseConnection } = require('./config/supabase');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { setupRateLimiting } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const matchRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chats');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase
initializeSupabase();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Rate limiting
setupRateLimiting(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Supabase test endpoint
app.get('/test-supabase', async (req, res) => {
  try {
    const result = await testSupabaseConnection();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Supabase test error:', error);
    res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 SkillChain API Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/health`);
  });
}

// Export for Firebase Cloud Functions
module.exports = app;



