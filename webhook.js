const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { sendSMS, sendEmail } = require('./notifier');

// Handle /webhook (no specific source)
router.post('/', express.json({ verify: (req, res, buf) => { req.rawBody = buf } }), async (req, res) => {
  req.params.source = null;
  return webhookHandler(req, res);
});

// Handle /webhook/:source (like /webhook/github)
router.post('/:source', express.json({ verify: (req, res, buf) => { req.rawBody = buf } }), async (req, res) => {
  return webhookHandler(req, res);
});

async function webhookHandler(req, res) {
  const source = req.params.source || detectSource(req);
  const payload = req.body;

  console.log(`🔔 Webhook received from ${source || 'unknown'}:`, payload);

  try {
    if (!verifyWebhook(req, source)) {
      console.warn("⚠️ Invalid webhook signature");
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const eventType = getEventType(req, source);
    const message = `[${source?.toUpperCase() || 'Webhook'}] ${eventType}:\n${JSON.stringify(payload, null, 2)}`;

    if (process.env.ENABLE_SMS === 'true') await sendSMS(message);
    if (process.env.ENABLE_EMAIL === 'true') await sendEmail(message);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    if (process.env.ENABLE_SMS === 'true') await sendSMS(`Webhook error: ${err.message}`);
    if (process.env.ENABLE_EMAIL === 'true') await sendEmail(`Webhook error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}

function verifyWebhook(req, source) {
  const rawBody = req.rawBody

  switch (source) {
    case 'github': {
      const signature = req.headers['x-hub-signature-256'];
      const secret = process.env.GITHUB_WEBHOOK_SECRET;
      return verifyHMAC(rawBody, signature, secret, 'sha256');
    }

    case 'stripe': {
      const signature = req.headers['stripe-signature'];
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      return verifyStripeStyle(rawBody, signature, secret);
    }

    default:
      return true; // No verification for unknown sources
  }
}

function verifyHMAC(body, signature, secret, algo) {
  if (!signature || !secret) return false;
  const expected = `${algo}=` + crypto.createHmac(algo, secret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function verifyStripeStyle(body, signature, secret) {
  // For real-world Stripe validation, use Stripe SDK
  return true;
}

function detectSource(req) {
  if (req.headers['x-github-event']) return 'github';
  if (req.headers['x-gitlab-event']) return 'gitlab';
  if (req.headers['stripe-signature']) return 'stripe';
  return 'generic';
}

function getEventType(req, source) {
  switch (source) {
    case 'github':
      return req.headers['x-github-event'] || 'unknown';
    case 'gitlab':
      return req.headers['x-gitlab-event'] || 'unknown';
    case 'stripe':
      return req.headers['stripe-event-type'] || 'unknown';
    default:
      return 'untyped-event';
  }
}

module.exports = router;
