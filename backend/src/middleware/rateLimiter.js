/**
 * Rate Limiting Middleware
 */

const { RateLimiterMemory } = require('rate-limiter-flexible');

// General API rate limiter: 100 requests per 15 minutes
const apiLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60, // 15 minutes
  blockDuration: 15 * 60 // Block for 15 minutes if exceeded
});

// Auth rate limiter: 5 requests per 15 minutes
const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 60 * 60 // Block for 1 hour
});

// Payment rate limiter: 10 requests per hour
const paymentLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60,
  blockDuration: 60 * 60
});

/**
 * Rate limiter middleware factory
 */
const createRateLimiter = (limiter) => {
  return async (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress;
      await limiter.consume(key);
      next();
    } catch (error) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: error.msBeforeNext ? Math.ceil(error.msBeforeNext / 1000) : 60
      });
    }
  };
};

/**
 * Setup rate limiting for the app
 */
const setupRateLimiting = (app) => {
  // Apply general rate limiter to all API routes
  app.use('/api', createRateLimiter(apiLimiter));
};

module.exports = {
  setupRateLimiting,
  authRateLimiter: createRateLimiter(authLimiter),
  paymentRateLimiter: createRateLimiter(paymentLimiter)
};


