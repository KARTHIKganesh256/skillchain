/**
 * Payment Controller
 */

const { getFirestore } = require('../config/firebase');
const {
  createPaymentIntent,
  createSubscription,
  createCustomer,
  verifyWebhookSignature,
  STRIPE_PRICES
} = require('../config/stripe');

/**
 * Create payment intent
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const db = getFirestore();
    const { amount, type, metadata = {} } = req.body;

    // Get user
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Create or get Stripe customer
    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      const customer = await createCustomer(
        userData.email,
        userData.displayName,
        { userId: req.user.uid }
      );
      customerId = customer.id;

      await db.collection('users').doc(req.user.uid).update({
        stripeCustomerId: customerId
      });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      amount,
      'usd',
      {
        ...metadata,
        userId: req.user.uid,
        type
      }
    );

    // Store payment record
    await db.collection('payments').add({
      userId: req.user.uid,
      paymentIntentId: paymentIntent.id,
      amount,
      type,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
};

/**
 * Confirm payment
 */
exports.confirmPayment = async (req, res) => {
  try {
    const db = getFirestore();
    const { paymentIntentId } = req.body;

    // Update payment status
    await db.collection('payments')
      .where('paymentIntentId', '==', paymentIntentId)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          snapshot.docs[0].ref.update({
            status: 'completed',
            completedAt: new Date().toISOString()
          });
        }
      });

    res.json({
      success: true,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
};

/**
 * Handle Stripe webhook
 */
exports.handleWebhook = async (req, res) => {
  try {
    const db = getFirestore();
    const signature = req.headers['stripe-signature'];

    // Verify webhook signature
    const event = verifyWebhookSignature(req.body, signature);

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update payment status
        await db.collection('payments')
          .where('paymentIntentId', '==', paymentIntent.id)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              snapshot.docs[0].ref.update({
                status: 'completed',
                completedAt: new Date().toISOString()
              });
            }
          });
        break;

      case 'payment_intent.failed':
        const failedIntent = event.data.object;
        
        // Update payment status
        await db.collection('payments')
          .where('paymentIntentId', '==', failedIntent.id)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              snapshot.docs[0].ref.update({
                status: 'failed',
                failedAt: new Date().toISOString()
              });
            }
          });
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          await db.collection('users').doc(userId).update({
            isPremium: subscription.status === 'active',
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status
          });
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object;
        const subUserId = deletedSub.metadata.userId;

        if (subUserId) {
          await db.collection('users').doc(subUserId).update({
            isPremium: false,
            subscriptionId: null,
            subscriptionStatus: 'cancelled'
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook error'
    });
  }
};

/**
 * Create premium subscription
 */
exports.createSubscription = async (req, res) => {
  try {
    const db = getFirestore();
    const { interval = 'month' } = req.body;

    // Get user
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Create or get Stripe customer
    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      const customer = await createCustomer(
        userData.email,
        userData.displayName,
        { userId: req.user.uid }
      );
      customerId = customer.id;

      await db.collection('users').doc(req.user.uid).update({
        stripeCustomerId: customerId
      });
    }

    // Determine price ID
    const priceId = interval === 'year'
      ? process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
      : process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;

    // Create subscription
    const subscription = await createSubscription(customerId, priceId);

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription'
    });
  }
};

/**
 * Cancel subscription
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const db = getFirestore();
    const { stripe } = require('../config/stripe');

    // Get user
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    if (!userData.subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel subscription
    await stripe.subscriptions.cancel(userData.subscriptionId);

    // Update user
    await db.collection('users').doc(req.user.uid).update({
      isPremium: false,
      subscriptionId: null,
      subscriptionStatus: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

/**
 * Request SkillCoin cash-out
 */
exports.requestCashout = async (req, res) => {
  try {
    const db = getFirestore();
    const { amount, bankAccount } = req.body;

    // Get user
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Check balance
    if (userData.skillCoinBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient SkillCoin balance'
      });
    }

    // Calculate fee (5%)
    const feePercent = parseInt(process.env.SKILLCOIN_CASHOUT_FEE_PERCENT) || 5;
    const fee = Math.floor(amount * feePercent / 100);
    const netAmount = amount - fee;

    // Convert SkillCoins to USD (1:1 for simplicity)
    const usdAmount = netAmount * 100; // Convert to cents

    // Create cashout request
    const cashoutRef = await db.collection('cashouts').add({
      userId: req.user.uid,
      skillCoins: amount,
      fee,
      netAmount,
      usdAmount,
      bankAccount,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Deduct SkillCoins from user balance
    await db.collection('users').doc(req.user.uid).update({
      skillCoinBalance: require('firebase-admin').firestore.FieldValue.increment(-amount)
    });

    // Create transaction
    await db.collection('transactions').add({
      userId: req.user.uid,
      type: 'debit',
      amount,
      description: `Cash-out request (Fee: ${fee} SkillCoins)`,
      cashoutId: cashoutRef.id,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Cash-out request submitted successfully',
      data: {
        cashoutId: cashoutRef.id,
        amount,
        fee,
        netAmount
      }
    });
  } catch (error) {
    console.error('Request cashout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process cash-out request'
    });
  }
};

/**
 * Get payment history
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const db = getFirestore();
    const { limit = 20 } = req.query;

    const snapshot = await db.collection('payments')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};

/**
 * Get SkillCoin balance
 */
exports.getBalance = async (req, res) => {
  try {
    const db = getFirestore();

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        skillCoinBalance: userData.skillCoinBalance || 0
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get balance'
    });
  }
};


