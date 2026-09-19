'use strict';
/**
 * Payment Service
 * 
 * Supports Stripe in production and a secure mock provider in development/testing.
 * All amounts and payment intents are verified server-side.
 */

const config = require('../config/env');
const ApiError = require('../utils/ApiError');

class MockPaymentProvider {
  async createPaymentIntent(amount, currency = 'inr', idempotencyKey = null) {
    const cleanAmount = parseFloat(parseFloat(amount).toFixed(2));
    if (cleanAmount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
    // Simulate payment processing delay (instant in test mode)
    if (config.nodeEnv !== 'test') {
      await new Promise((r) => setTimeout(r, 100));
    }
    return {
      id: `mock_pi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount: cleanAmount,
      currency: currency.toLowerCase(),
      status: 'succeeded',
      provider: 'MOCK',
      idempotency_key: idempotencyKey,
    };
  }

  async confirmPayment(paymentIntentId) {
    return { id: paymentIntentId, status: 'succeeded' };
  }

  verifyWebhookSignature(rawBody, signature, secret) {
    if (signature && signature.startsWith('t=')) {
      try {
        const Stripe = require('stripe');
        const stripe = new Stripe(config.payment.stripeSecretKey || 'sk_test_dummy', { apiVersion: '2023-10-16' });
        return stripe.webhooks.constructEvent(rawBody, signature, secret);
      } catch (err) {
        throw new Error('Invalid webhook signature: ' + err.message);
      }
    }

    if (!signature || signature !== secret) {
      throw new Error('Invalid mock webhook signature');
    }
    return JSON.parse(rawBody.toString('utf8'));
  }
}

class StripeProvider {
  constructor() {
    if (!config.payment.stripeSecretKey) {
      throw new Error('Stripe secret key missing. Set STRIPE_SECRET_KEY in environment.');
    }
    const Stripe = require('stripe');
    this.stripe = new Stripe(config.payment.stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: false,
    });
  }

  async createPaymentIntent(amount, currency = 'inr', idempotencyKey = null) {
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    if (amountInPaise <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    const options = {};
    if (idempotencyKey) {
      options.idempotencyKey = idempotencyKey;
    }

    const intent = await this.stripe.paymentIntents.create(
      {
        amount: amountInPaise,
        currency: currency.toLowerCase(),
        payment_method_types: ['card'],
      },
      options
    );

    return {
      id: intent.id,
      client_secret: intent.client_secret,
      amount: parseFloat((amountInPaise / 100).toFixed(2)),
      currency: intent.currency,
      status: intent.status,
      provider: 'STRIPE',
    };
  }

  async confirmPayment(paymentIntentId) {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return { id: intent.id, status: intent.status };
  }

  verifyWebhookSignature(rawBody, signature, secret) {
    return this.stripe.webhooks.constructEvent(rawBody, signature, secret);
  }
}

const getProvider = () => {
  if (config.payment.mode === 'stripe' && config.payment.stripeSecretKey) {
    return new StripeProvider();
  }
  return new MockPaymentProvider();
};

const processPayment = async (amount, currency = 'inr', idempotencyKey = null) => {
  const provider = getProvider();
  return provider.createPaymentIntent(amount, currency, idempotencyKey);
};

const verifyWebhook = (rawBody, signature) => {
  const provider = getProvider();
  const secret = process.env.STRIPE_WEBHOOK_SECRET || config.payment.stripeWebhookSecret || 'whsec_test';
  return provider.verifyWebhookSignature(rawBody, signature, secret);
};

module.exports = { processPayment, verifyWebhook, getProvider };
