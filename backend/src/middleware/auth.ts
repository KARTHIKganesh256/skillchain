import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../config/database';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Add user info to request
    req.userId = user._id.toString();
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'AUTH_ERROR'
    });
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_USER'
      });
      return;
    }

    // Check if user is admin (you might want to add an isAdmin field to your user schema)
    if (!req.user.isAdmin) {
      res.status(403).json({ 
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'ADMIN_CHECK_ERROR'
    });
  }
};

export const requirePremium = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_USER'
      });
      return;
    }

    // Check if user has premium access
    if (!req.user.isPremium) {
      res.status(403).json({ 
        error: 'Premium access required',
        code: 'PREMIUM_REQUIRED'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'PREMIUM_CHECK_ERROR'
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Find user in database
      const user = await User.findById(decoded.userId).select('-__v');
      if (user) {
        req.userId = user._id.toString();
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
      console.log('Optional auth: Invalid token, continuing without auth');
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication on error
    next();
  }
};

