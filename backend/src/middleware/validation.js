/**
 * Request Validation Middleware
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * User registration validation
 */
const validateRegistration = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').trim().notEmpty().withMessage('Display name is required'),
  validate
];

/**
 * User login validation
 */
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  body('displayName').optional().trim().notEmpty(),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('location').optional().trim(),
  body('phone').optional().isMobilePhone(),
  validate
];

/**
 * Skill post validation
 */
const validateSkillPost = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['offer', 'request']).withMessage('Type must be offer or request'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('skillCoins').isInt({ min: 1 }).withMessage('SkillCoins must be at least 1'),
  body('location').optional().trim(),
  body('duration').optional().isInt({ min: 1 }),
  validate
];

/**
 * Message validation
 */
const validateMessage = [
  body('message').trim().notEmpty().withMessage('Message cannot be empty'),
  validate
];

/**
 * Payment validation
 */
const validatePayment = [
  body('amount').isInt({ min: 100 }).withMessage('Amount must be at least $1.00'),
  body('type').isIn(['boost_post', 'premium', 'cashout']).withMessage('Invalid payment type'),
  validate
];

/**
 * Search validation
 */
const validateSearch = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().trim(),
  query('type').optional().isIn(['offer', 'request', 'all']),
  validate
];

/**
 * ID parameter validation
 */
const validateId = [
  param('id').trim().notEmpty().withMessage('ID is required'),
  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateSkillPost,
  validateMessage,
  validatePayment,
  validateSearch,
  validateId
};


