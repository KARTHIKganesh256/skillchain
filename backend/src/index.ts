import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Import routes
import authRoutes from './routes/auth';
import simpleRoutes from './routes/simple';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authenticateToken } from './middleware/auth';

// Import database
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Import socket handlers
import { setupSocketHandlers } from './socket/handlers';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 10, // Number of requests
  duration: 1, // Per 1 second
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression() as any);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    const ip = req.ip || 'unknown';
    await rateLimiter.consume(ip);
    next();
  } catch (rej) {
    res.status(429).json({ error: 'Too Many Requests' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SkillChain API',
        version: '1.0.0',
        description: 'AI-Powered Skill Ecosystem API',
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:5000',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };
  
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', simpleRoutes);

// Socket.IO setup
setupSocketHandlers(io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection
const startServer = async () => {
  try {
    // Connect to databases
    await connectDatabase();
    await connectRedis();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

export { app, io };
