/**
 * Stripe Payment Configuration
 */

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

/**
 * Stripe price configurations
 */
const STRIPE_PRICES = {
  BOOST_POST_7_DAYS: {
    amount: 500, // $5.00
    currency: 'usd',
    duration: 7
  },
  BOOST_POST_14_DAYS: {
    amount: 900, // $9.00
    currency: 'usd',
    duration: 14
  },
  BOOST_POST_30_DAYS: {
    amount: 1500, // $15.00
    currency: 'usd',
    duration: 30
  },
  PREMIUM_MONTHLY: {
    amount: 999, // $9.99
    currency: 'usd',
    interval: 'month'
  },
  PREMIUM_YEARLY: {
    amount: 9999, // $99.99
    currency: 'usd',
    interval: 'year'
  }
};

/**
 * Create payment intent
 */
const createPaymentIntent = async (amount, currency, metadata) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Create subscription
 */
const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Create customer
 */
const createCustomer = async (email, name, metadata) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Create payout for SkillCoin cash-out
 */
const createPayout = async (amount, destination, metadata) => {
  try {
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination,
      metadata
    });
    return transfer;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
};

/**
 * Verify webhook signature
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
};

module.exports = {
  stripe,
  STRIPE_PRICES,
  createPaymentIntent,
  createSubscription,
  createCustomer,
  createPayout,
  verifyWebhookSignature
};






