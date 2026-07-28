require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const connectDB = require('../middleware/db');
const authMiddleware = require('../middleware/auth');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const Payment = require('../models/Payment');

const app = express();
app.use(express.json());

const router = express.Router();

// GET /api/subscriptions/plans — list active plans
router.get('/plans', async (req, res) => {
  try {
    await connectDB();
    let plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
    // Seed default plans if none exist
    if (plans.length === 0) {
      const defaults = [
        { name: 'Basic', price: 999, billingCycle: 'monthly', features: ['Up to 20 bookings/month', 'Standard listing', 'Email support', 'Client messaging'], maxBookingsPerMonth: 20 },
        { name: 'Pro', price: 2499, billingCycle: 'monthly', features: ['Up to 60 bookings/month', 'Featured listing', 'Priority support', 'Analytics dashboard', 'Advanced profile'], maxBookingsPerMonth: 60 },
        { name: 'Enterprise', price: 4999, billingCycle: 'monthly', features: ['Unlimited bookings', 'Top placement', '24/7 dedicated support', 'Full analytics', 'Custom profile', 'Bulk messaging'], maxBookingsPerMonth: 999 },
      ];
      plans = await SubscriptionPlan.insertMany(defaults);
    }
    res.json({ plans });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/subscriptions/subscribe — create Razorpay order for subscription
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { planId } = req.body;
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: { userId: req.user.id, planId: plan._id.toString(), planName: plan.name }
    });
    
    // Create pending payment record
    await Payment.create({
      userId: req.user.id,
      amount: plan.price,
      razorpayOrderId: order.id,
      status: 'created',
      type: 'subscription'
    });
    
    res.json({ orderId: order.id, amount: order.amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID, planName: plan.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/subscriptions/verify — verify Razorpay payment and activate subscription
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) return res.status(400).json({ error: 'Payment verification failed' });
    
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    
    const endDate = new Date();
    if (plan.billingCycle === 'yearly') { endDate.setFullYear(endDate.getFullYear() + 1); }
    else { endDate.setMonth(endDate.getMonth() + 1); }
    
    await UserSubscription.create({
      userId: req.user.id,
      planId: plan._id,
      startDate: new Date(),
      endDate,
      status: 'active',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });
    
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }
    );
    
    res.json({ success: true, message: `${plan.name} plan activated!`, plan: plan.name, endDate });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/subscriptions/my — get current user's subscription
router.get('/my', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const sub = await UserSubscription.findOne({ userId: req.user.id, status: 'active' }).populate('planId').sort({ createdAt: -1 });
    res.json({ subscription: sub });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/subscriptions', router);
module.exports = app;
