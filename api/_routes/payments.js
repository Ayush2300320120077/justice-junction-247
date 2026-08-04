require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const connectDB = require('../../middleware/db');
const Booking = require('../../models/Booking');
const Lawyer = require('../../models/Lawyer');
const Payment = require('../../models/Payment');
const { requireAuth } = require('../../middleware/auth');

// ── No manual CORS headers — handled globally in server.js ──

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Max 15 payment attempts per IP per hour
  message: { error: 'Too many payment requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();
const PLATFORM_COMMISSION = 0.10;

// POST /api/payments/create-order
router.post('/create-order', requireAuth, paymentLimiter, async (req, res) => {
  try {
    await connectDB();
    const { lawyerId } = req.body;

    if (!lawyerId) return res.status(400).json({ error: 'lawyerId is required' });

    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    // BUG 6 FIX: Use server-side fee from DB — never trust client-supplied amount
    const amount = lawyer.consultationFee;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Lawyer has no consultation fee set' });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: 'INR',
      receipt: `jj_${Date.now()}`,
      notes: { lawyerId: lawyer._id.toString(), clientId: req.user.id, lawyerName: lawyer.name }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      lawyerName: lawyer.name,
      commission: Math.round(amount * PLATFORM_COMMISSION),
      lawyerPayout: Math.round(amount * (1 - PLATFORM_COMMISSION))
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Failed to create payment order. Please try again.' });
  }
});

// POST /api/payments/verify
router.post('/verify', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
    }

    const booking = await Booking.findById(bookingData?.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Ensure the booking belongs to the requesting user
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    booking.status = 'confirmed';
    booking.paymentId = razorpay_payment_id;
    booking.paymentOrderId = razorpay_order_id;
    booking.isPaid = true;
    await booking.save();

    // Log payment for audit trail (non-blocking)
    try {
      await Payment.create({
        userId: req.user.id,
        amount: booking.fee || 0,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        type: 'booking',
        referenceId: booking._id
      });
    } catch (logErr) {
      console.error('Payment log error (non-blocking):', logErr.message);
    }

    res.json({ success: true, booking, message: 'Payment successful! Booking confirmed.' });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ error: 'Payment verification failed. Please contact support.' });
  }
});

// POST /api/payments/subscribe — lawyer subscription purchase
router.post('/subscribe', requireAuth, paymentLimiter, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });

    const { plan } = req.body;
    const PLANS = { basic: 99900, pro: 249900, elite: 499900 }; // amounts in paise
    const amount = PLANS[plan];
    if (!amount) return res.status(400).json({ error: 'Invalid plan. Choose: basic, pro, or elite' });

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: { userId: req.user.id, plan }
    });

    res.json({ orderId: order.id, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID, plan });
  } catch (err) {
    console.error('Subscribe error:', err.message);
    res.status(500).json({ error: 'Failed to create subscription order. Please try again.' });
  }
});

// POST /api/payments/verify-subscription
router.post('/verify-subscription', requireAuth, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
    }

    const lawyer = await Lawyer.findOne({ user: req.user.id });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' });

    const PLAN_FEATURES = {
      basic: { name: 'Basic', featured: false, priority: false, maxBookings: 20 },
      pro:   { name: 'Pro',   featured: true,  priority: false, maxBookings: 60 },
      elite: { name: 'Elite', featured: true,  priority: true,  maxBookings: 999 }
    };

    if (!PLAN_FEATURES[plan]) return res.status(400).json({ error: 'Invalid plan' });

    lawyer.subscription = plan;
    lawyer.subscriptionFeatures = PLAN_FEATURES[plan];
    lawyer.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    lawyer.isVerified = true;
    await lawyer.save();

    res.json({ success: true, plan, message: `${PLAN_FEATURES[plan].name} plan activated!` });
  } catch (err) {
    console.error('Verify subscription error:', err.message);
    res.status(500).json({ error: 'Subscription verification failed. Please contact support.' });
  }
});

const app = express();
app.use('/api/payments', router);
module.exports = app;
