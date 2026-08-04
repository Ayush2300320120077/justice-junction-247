require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const connectDB = require('../../middleware/db');
const Booking = require('../../models/Booking');
const Lawyer = require('../../models/Lawyer');
const Payment = require('../../models/Payment');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function getUser(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  try { return jwt.verify(h.split(' ')[1], process.env.JWT_SECRET); }
  catch { return null; }
}

const router = express.Router();
const PLATFORM_COMMISSION = 0.10;

router.post('/create-order', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { lawyerId, amount } = req.body;
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: amount * 100, currency: 'INR',
      receipt: `jj_${Date.now()}`,
      notes: { lawyerId, clientId: user.id, lawyerName: lawyer.name }
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID, lawyerName: lawyer.name, commission: Math.round(amount * PLATFORM_COMMISSION), lawyerPayout: Math.round(amount * (1 - PLATFORM_COMMISSION)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/verify', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSig !== razorpay_signature) return res.status(400).json({ error: 'Payment verification failed' });
    const booking = await Booking.findById(bookingData.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'confirmed';
    booking.paymentId = razorpay_payment_id;
    booking.paymentOrderId = razorpay_order_id;
    booking.isPaid = true;
    await booking.save();
    // Log payment record for audit trail & analytics
    try {
      await Payment.create({
        userId: user.id,
        amount: booking.amount || bookingData.amount || 0,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        type: 'booking',
        referenceId: booking._id
      });
    } catch (logErr) { console.error('Payment log error (non-blocking):', logErr.message); }
    res.json({ success: true, booking, message: 'Payment successful! Booking confirmed.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/subscribe', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user || user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });
    const { plan } = req.body;
    const PLANS = { basic: 99900, pro: 249900, elite: 499900 };
    const amount = PLANS[plan];
    if (!amount) return res.status(400).json({ error: 'Invalid plan' });
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `sub_${Date.now()}`, notes: { userId: user.id, plan } });
    res.json({ orderId: order.id, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID, plan });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/verify-subscription', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user || user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) return res.status(400).json({ error: 'Payment verification failed' });
    const lawyer = await Lawyer.findOne({ user: user.id });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    const PLAN_FEATURES = {
      basic: { name: 'Basic', featured: false, priority: false, maxBookings: 20 },
      pro:   { name: 'Pro', featured: true, priority: false, maxBookings: 60 },
      elite: { name: 'Elite', featured: true, priority: true, maxBookings: 999 }
    };
    lawyer.subscription = plan;
    lawyer.subscriptionFeatures = PLAN_FEATURES[plan];
    lawyer.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    lawyer.isVerified = true;
    await lawyer.save();
    res.json({ success: true, plan, message: `${PLAN_FEATURES[plan].name} plan activated!` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/payments', router);
module.exports = app;
