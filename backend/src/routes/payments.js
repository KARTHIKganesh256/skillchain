/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePayment } = require('../middleware/validation');
const { paymentRateLimiter } = require('../middleware/rateLimiter');
const paymentController = require('../controllers/paymentController');

// Apply payment rate limiter
router.use(paymentRateLimiter);

// POST /api/payments/create-intent - Create payment intent
router.post('/create-intent', verifyFirebaseToken, validatePayment, asyncHandler(paymentController.createPaymentIntent));

// POST /api/payments/confirm - Confirm payment
router.post('/confirm', verifyFirebaseToken, asyncHandler(paymentController.confirmPayment));

// POST /api/payments/webhook - Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(paymentController.handleWebhook));

// POST /api/payments/subscribe - Create premium subscription
router.post('/subscribe', verifyFirebaseToken, asyncHandler(paymentController.createSubscription));

// POST /api/payments/cancel-subscription - Cancel subscription
router.post('/cancel-subscription', verifyFirebaseToken, asyncHandler(paymentController.cancelSubscription));

// POST /api/payments/cashout - Request SkillCoin cash-out
router.post('/cashout', verifyFirebaseToken, asyncHandler(paymentController.requestCashout));

// GET /api/payments/history - Get payment history
router.get('/history', verifyFirebaseToken, asyncHandler(paymentController.getPaymentHistory));

// GET /api/payments/balance - Get SkillCoin balance
router.get('/balance', verifyFirebaseToken, asyncHandler(paymentController.getBalance));

module.exports = router;


