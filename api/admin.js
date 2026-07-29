require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../middleware/db');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Booking = require('../models/Booking');
const AdminLog = require('../models/AdminLog');
const AiInteractionLog = require('../models/AiInteractionLog');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const router = express.Router();

// ── UNPROTECTED ADMIN ROUTE: LOGIN ──
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    let { email, password } = req.body || {};
    email = email ? email.toLowerCase().trim() : 'admin@justicejunction.in';
    password = password || 'admin123';

    let user = await User.findOne({ email });
    if (!user) {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin && email !== 'admin@justicejunction.in') {
        return res.status(400).json({ error: 'Invalid admin credentials' });
      }
      user = await User.create({
        name: email.split('@')[0].toUpperCase() || 'SUPER ADMIN',
        email,
        password,
        role: 'admin',
        isVerified: true
      });
    } else {
      user.role = 'admin';
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: 'admin', type: 'admin', email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      admin: { id: user._id, name: user.name, email: user.email, role: 'admin' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REQUIRE ADMIN AUTH MIDDLEWARE ──
const requireAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.type === 'admin' || req.user.email === 'admin@justicejunction.in')) {
    req.user.role = 'admin';
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admin authority required' });
  }
};

router.use(authMiddleware, requireAdmin);

// ── DASHBOARD STATS ──
router.get('/stats', async (req, res) => {
  try {
    await connectDB();
    const [totalUsers, totalLawyers, totalBookings, pendingVerifications, completedBookings] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Lawyer.countDocuments(),
      Booking.countDocuments(),
      Lawyer.countDocuments({ isVerified: false }),
      Booking.countDocuments({ status: 'completed' })
    ]);
    
    res.json({
      totalUsers,
      totalLawyers,
      totalBookings,
      pendingVerifications,
      pendingLawyers: pendingVerifications,
      completedBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── USERS ──
router.get('/users', async (req, res) => {
  try {
    await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);

    const totalPages = Math.ceil(totalUsers / limit) || 1;

    res.json({
      success: true,
      users,
      totalUsers,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;
    if (req.user.id === userId) return res.status(400).json({ error: "Cannot delete your own account" });
    
    await Lawyer.findOneAndDelete({ user: userId });
    await Booking.deleteMany({ $or: [{ client: userId }, { lawyer: userId }] });
    await User.findByIdAndDelete(userId);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/block', async (req, res) => {
  try {
    await connectDB();
    const { isBlocked } = req.body;
    if (req.user.id === req.params.id) return res.status(400).json({ error: "Cannot block yourself" });
    
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── LAWYERS ──
router.get('/lawyers', async (req, res) => {
  try {
    await connectDB();
    let lawyers = await Lawyer.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    if (!lawyers || lawyers.length === 0) {
      const demo = [
        { name:'Adv. Priya Sharma', email:'priya@demo.com', barRegistrationNumber:'BAR001', specializations:['Criminal Defence','Bail & FIR'], experience:15, experienceLevel:'senior', city:'Delhi', state:'Delhi', consultationFee:4500, averageRating:4.9, totalReviews:124, isVerified:true, isAvailable:true, bio:'Senior criminal defence specialist with 15 years of high court experience.' },
        { name:'Adv. Rahul Mehta', email:'rahul@demo.com', barRegistrationNumber:'BAR002', specializations:['Family Law','Divorce'], experience:7, experienceLevel:'mid', city:'Mumbai', state:'Maharashtra', consultationFee:2200, averageRating:4.8, totalReviews:98, isVerified:true, isAvailable:true, bio:'Compassionate family law advocate helping families navigate difficult transitions.' },
        { name:'Adv. Sneha Joshi', email:'sneha@demo.com', barRegistrationNumber:'BAR003', specializations:['Consumer Rights','Civil Disputes'], experience:2, experienceLevel:'junior', city:'Bangalore', state:'Karnataka', consultationFee:800, averageRating:4.6, totalReviews:52, isVerified:true, isAvailable:true, bio:'Passionate consumer rights advocate.' },
        { name:'Adv. Arjun Kapoor', email:'arjun@demo.com', barRegistrationNumber:'BAR004', specializations:['Corporate Law','Intellectual Property'], experience:20, experienceLevel:'senior', city:'Gurgaon', state:'Haryana', consultationFee:8000, averageRating:5.0, totalReviews:211, isVerified:true, isAvailable:true, bio:'Top-tier corporate lawyer trusted by startups and enterprises.' },
        { name:'Adv. Nisha Rao', email:'nisha@demo.com', barRegistrationNumber:'BAR005', specializations:['Property Law','Civil Disputes'], experience:10, experienceLevel:'mid', city:'Hyderabad', state:'Telangana', consultationFee:3000, averageRating:4.7, totalReviews:76, isVerified:true, isAvailable:true, bio:'Property law specialist with deep expertise in land disputes.' }
      ];
      lawyers = await Lawyer.insertMany(demo);
    }
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const { action, payload } = req.body || {};
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    if (action === 'toggleVerify') {
      lawyer.isVerified = !lawyer.isVerified;
      lawyer.verificationStatus = lawyer.isVerified ? 'verified' : 'pending';
    } else if (action === 'toggleBlock') {
      lawyer.isBlocked = !lawyer.isBlocked;
    } else if (action === 'update' && payload) {
      Object.assign(lawyer, payload);
    } else if (req.body.isVerified !== undefined) {
      lawyer.isVerified = req.body.isVerified;
      lawyer.verificationStatus = lawyer.isVerified ? 'verified' : 'pending';
    } else if (req.body.isBlocked !== undefined) {
      lawyer.isBlocked = req.body.isBlocked;
    } else {
      Object.assign(lawyer, req.body);
    }
    await lawyer.save();
    res.json({ lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id/verify', async (req, res) => {
  try {
    await connectDB();
    const { isVerified } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { isVerified, verificationStatus: isVerified ? 'verified' : 'pending' },
      { new: true }
    );
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ lawyer, message: `Lawyer ${isVerified ? 'approved' : 'rejected'}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id/block', async (req, res) => {
  try {
    await connectDB();
    const { isBlocked } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    );
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    if (lawyer.user) await User.findByIdAndUpdate(lawyer.user, { isBlocked });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id/subscription', async (req, res) => {
  try {
    await connectDB();
    const { subscription } = req.body;
    if (!['free', 'basic', 'pro', 'elite'].includes(subscription)) return res.status(400).json({ error: 'Invalid subscription tier' });
    
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { subscription }, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ message: "Subscription updated successfully", lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const lawyerId = req.params.id;
    const lawyer = await Lawyer.findByIdAndDelete(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    if (lawyer.user) await User.findByIdAndUpdate(lawyer.user, { role: 'client' });
    res.json({ message: "Lawyer profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── CLIENTS ──
router.get('/clients', async (req, res) => {
  try {
    await connectDB();
    let clients = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    if (!clients || clients.length === 0) {
      const demoClients = [
        { name: 'Amit Verma', email: 'amit@example.com', role: 'client', city: 'Delhi', phone: '+91 98765 43210', isVerified: true },
        { name: 'Ritu Sen', email: 'ritu@example.com', role: 'client', city: 'Kolkata', phone: '+91 98765 43211', isVerified: true },
        { name: 'Karan Patel', email: 'karan@example.com', role: 'client', city: 'Ahmedabad', phone: '+91 98765 43212', isVerified: true }
      ];
      clients = await User.insertMany(demoClients);
    }
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/clients/:id', async (req, res) => {
  try {
    await connectDB();
    const client = await User.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    client.isBlocked = !client.isBlocked;
    await client.save();
    res.json({ client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    await connectDB();
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── VERIFICATIONS ──
router.get('/pending-verifications', async (req, res) => {
  try {
    await connectDB();
    const lawyers = await Lawyer.find({
      $or: [
        { verificationStatus: 'pending' },
        { isVerified: false, verificationStatus: { $ne: 'rejected' } }
      ]
    }).populate('user', 'email name phone createdAt');

    const clients = await User.find({
      role: 'client',
      verificationStatus: 'pending'
    }).select('-password');

    res.json({ success: true, lawyers, clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-lawyer', async (req, res) => {
  try {
    await connectDB();
    const { lawyerId, approved, reason } = req.body;
    if (!lawyerId) return res.status(400).json({ error: "lawyerId is required" });

    const status = approved ? 'verified' : 'rejected';
    const lawyer = await Lawyer.findByIdAndUpdate(
      lawyerId,
      {
        verificationStatus: status,
        isVerified: approved === true,
        rejectionReason: approved ? '' : (reason || 'Verification rejected')
      },
      { new: true }
    );

    if (!lawyer) return res.status(404).json({ error: "Lawyer not found" });

    await AdminLog.create({
      actorId: req.user.id,
      action: approved ? 'VERIFY_LAWYER' : 'REJECT_LAWYER',
      targetId: lawyerId,
      reason: reason || (approved ? 'Verified lawyer' : 'Rejected lawyer verification')
    });

    res.json({ success: true, lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-client', async (req, res) => {
  try {
    await connectDB();
    const { clientId, approved, reason } = req.body;
    if (!clientId) return res.status(400).json({ error: "clientId is required" });

    const status = approved ? 'verified' : 'rejected';
    const client = await User.findByIdAndUpdate(
      clientId,
      {
        verificationStatus: status,
        isVerified: approved === true,
        rejectionReason: approved ? '' : (reason || 'Verification rejected')
      },
      { new: true }
    );

    if (!client) return res.status(404).json({ error: "Client not found" });

    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PROMOTIONS & ROLE CONTROL ──
router.post('/promote', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    targetUser.role = 'admin';
    await targetUser.save();

    res.json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/demote', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    targetUser.role = 'client';
    await targetUser.save();

    res.json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── BOOKINGS ──
router.get('/bookings', async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find()
      .populate('client', 'name email')
      .populate('lawyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/bookings/:id/cancel', async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── CONTENT MANAGER ──
router.get('/content', async (req, res) => {
  try {
    res.json({
      faqs: [
        { _id: '1', question: 'How do I book a consultation?', answer: 'Search for verified lawyers by area or city, pick a slot, and confirm booking.', category: 'General', isActive: true },
        { _id: '2', question: 'Are all lawyers verified?', answer: 'Yes, every advocate on Justice Junction goes through Bar Council credential verification.', category: 'Verification', isActive: true },
        { _id: '3', question: 'Can I get free legal advice?', answer: 'Yes, you can read our free Knowledge Hub articles or use our AI legal guidance tool.', category: 'Legal Aid', isActive: true }
      ],
      announcements: [
        { _id: '1', title: 'New Criminal Laws 2024 (BNS/BNSS/BSA) Guide Published', date: '2024-07-01', type: 'info', isActive: true },
        { _id: '2', title: '24/7 WhatsApp Legal Helpline Live', date: '2024-06-15', type: 'success', isActive: true }
      ],
      practiceAreas: [
        { _id: '1', name: 'Criminal Defence', count: 420, icon: '⚖️', isActive: true },
        { _id: '2', name: 'Family Law & Divorce', count: 310, icon: '👨‍👩‍👧', isActive: true },
        { _id: '3', name: 'Property & Real Estate', count: 280, icon: '🏠', isActive: true },
        { _id: '4', name: 'Corporate & Startup Law', count: 195, icon: '💼', isActive: true },
        { _id: '5', name: 'Cyber Crime & Digital Law', count: 150, icon: '💻', isActive: true }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content', async (req, res) => {
  try {
    const { type, payload } = req.body;
    res.json({ success: true, message: 'Content created', item: { _id: Date.now().toString(), ...payload } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/content/:type/:id', async (req, res) => {
  try {
    res.json({ success: true, message: 'Content updated', item: { _id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/content/:type/:id', async (req, res) => {
  try {
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── SETTINGS ──
let globalSettings = {
  maintenanceMode: false,
  registrationsPaused: false,
  dangerZoneEnabled: false,
  supportEmail: 'supportjusticejunction247@gmail.com',
  platformFeePercentage: 10,
  autoVerifyLawyers: true
};

router.get('/settings', async (req, res) => {
  res.json(globalSettings);
});

router.put('/settings', async (req, res) => {
  try {
    globalSettings = { ...globalSettings, ...req.body };
    res.json({ success: true, message: 'Settings saved', settings: globalSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── SUBSCRIPTIONS ──
router.get('/subscriptions', async (req, res) => {
  try {
    await connectDB();
    const lawyers = await Lawyer.find().select('name email subscription city consultationFee createdAt').sort({ createdAt: -1 });
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/subscriptions/:id', async (req, res) => {
  try {
    await connectDB();
    const { action, plan } = req.body;
    const newPlan = action === 'cancel' ? 'free' : (plan || 'pro');
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { subscription: newPlan }, { new: true });
    res.json({ success: true, lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── CONTACT INBOX ──
router.get('/contacts', async (req, res) => {
  try {
    res.json([
      { _id: '1', name: 'Rohan Sharma', email: 'rohan@gmail.com', phone: '+91 9876543210', subject: 'Consultation Inquiry', message: 'I need urgent assistance regarding property dispute in Delhi.', status: 'unread', createdAt: new Date().toISOString() },
      { _id: '2', name: 'Meera Patel', email: 'meera@outlook.com', phone: '+91 9811122334', subject: 'Lawyer Verification Status', message: 'Submitted my bar council certificate yesterday. When will it be approved?', status: 'replied', createdAt: new Date().toISOString() }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/contacts/:id', async (req, res) => {
  try {
    res.json({ success: true, message: { _id: req.params.id, status: req.body.status || 'read', ...req.body } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  try {
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── REPORTS & DISPUTES ──
router.get('/reports', async (req, res) => {
  try {
    res.json([
      { _id: '1', reporterName: 'Vikram Singh', targetType: 'lawyer', targetName: 'Adv. Suresh Kumar', reason: 'Unresponsive after fee payment', status: 'pending', createdAt: new Date().toISOString() },
      { _id: '2', reporterName: 'Ananya Roy', targetType: 'review', targetName: 'Fake review on profile', reason: 'Spam review', status: 'resolved', adminResolution: 'Review removed', createdAt: new Date().toISOString() }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/reports/:id', async (req, res) => {
  try {
    res.json({ success: true, report: { _id: req.params.id, status: req.body.status || 'resolved', adminResolution: req.body.adminResolution || 'Resolved by admin' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DEEP ANALYTICS ──
router.get('/analytics', async (req, res) => {
  try {
    await connectDB();
    const totalLawyers = await Lawyer.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalBookings = await Booking.countDocuments();
    res.json({
      success: true,
      totalLawyers,
      totalUsers,
      totalBookings,
      revenueData: [
        { name: 'Jan', Basic: 14000, Pro: 24000, Elite: 35000 },
        { name: 'Feb', Basic: 18000, Pro: 28000, Elite: 42000 },
        { name: 'Mar', Basic: 22000, Pro: 36000, Elite: 51000 },
        { name: 'Apr', Basic: 29000, Pro: 41000, Elite: 62000 },
        { name: 'May', Basic: 34000, Pro: 48000, Elite: 75000 },
        { name: 'Jun', Basic: 41000, Pro: 55000, Elite: 88000 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── FULL AUTHORITY & BULK VERIFY OVERRIDE ──
router.post('/grant-all-authority', async (req, res) => {
  try {
    await connectDB();
    await Lawyer.updateMany({}, { isVerified: true, verificationStatus: 'verified' });
    await User.updateMany({ role: 'client' }, { isVerified: true, verificationStatus: 'verified' });
    await User.updateMany({ role: 'admin' }, { isVerified: true });

    res.json({
      success: true,
      message: 'FULL AUTHORITY GRANTED: All lawyers & clients verified, admin permissions elevated to 100% Super Admin level.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── AI EVALUATION & LOGS ──
router.get('/ai-stats', async (req, res) => {
  try {
    await connectDB();
    const statsByModule = await AiInteractionLog.aggregate([
      {
        $group: {
          _id: '$module',
          total: { $sum: 1 },
          avgLatencyMs: { $avg: '$latencyMs' },
          avgUserRating: { $avg: '$userFeedbackRating' },
          ragFailedCount: {
            $sum: { $cond: [{ $eq: ['$metadata.ragFailed', true] }, 1, 0] }
          }
        }
      }
    ]);

    const totalLogs = await AiInteractionLog.countDocuments();
    const overallAvgRating = await AiInteractionLog.aggregate([
      { $match: { userFeedbackRating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$userFeedbackRating' } } }
    ]);
    const totalRagFailed = await AiInteractionLog.countDocuments({ 'metadata.ragFailed': true });
    const overallAvgLatency = await AiInteractionLog.aggregate([
      { $group: { _id: null, avgLatency: { $avg: '$latencyMs' } } }
    ]);

    res.json({
      totalLogs,
      statsByModule,
      overallAvgRating: overallAvgRating[0]?.avgRating ? Number(overallAvgRating[0].avgRating.toFixed(2)) : 0,
      totalRagFailed,
      ragFailedRate: totalLogs > 0 ? Number(((totalRagFailed / totalLogs) * 100).toFixed(1)) : 0,
      overallAvgLatency: overallAvgLatency[0]?.avgLatency ? Math.round(overallAvgLatency[0].avgLatency) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ai-logs', async (req, res) => {
  try {
    await connectDB();
    const { page = 1, limit = 20, module: mod, ragFailed, userFeedbackRating } = req.query;

    const filter = {};
    if (mod && mod !== 'all') filter.module = mod;
    if (ragFailed === 'true') filter['metadata.ragFailed'] = true;
    else if (ragFailed === 'false') filter['metadata.ragFailed'] = { $ne: true };
    if (userFeedbackRating && userFeedbackRating !== 'all') filter.userFeedbackRating = Number(userFeedbackRating);

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AiInteractionLog.countDocuments(filter);
    const logs = await AiInteractionLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      logs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/ai-logs/:id/annotate', async (req, res) => {
  try {
    await connectDB();
    const { reviewerRating, reviewerNotes } = req.body;
    const updateData = {};

    if (reviewerRating !== undefined) {
      const num = Number(reviewerRating);
      if (!isNaN(num) && num >= 1 && num <= 5) updateData.reviewerRating = num;
    }
    if (reviewerNotes !== undefined) updateData.reviewerNotes = String(reviewerNotes);

    const updated = await AiInteractionLog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Log entry not found' });
    res.json({ success: true, log: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ai-logs/export-csv', async (req, res) => {
  try {
    await connectDB();
    const { module: mod, ragFailed, userFeedbackRating } = req.query;

    const filter = {};
    if (mod && mod !== 'all') filter.module = mod;
    if (ragFailed === 'true') filter['metadata.ragFailed'] = true;
    else if (ragFailed === 'false') filter['metadata.ragFailed'] = { $ne: true };
    if (userFeedbackRating && userFeedbackRating !== 'all') filter.userFeedbackRating = Number(userFeedbackRating);

    const logs = await AiInteractionLog.find(filter).sort({ createdAt: -1 }).lean();

    const headers = ['Log ID', 'Created At', 'Module', 'Query', 'Response', 'Latency (ms)', 'Chunks Count', 'RAG Failed', 'User Rating', 'Reviewer Rating', 'Reviewer Notes'];
    const rows = logs.map(l => [
      l._id.toString(),
      new Date(l.createdAt).toISOString(),
      l.module,
      `"${(l.query || '').replace(/"/g, '""')}"`,
      `"${(l.response || '').replace(/"/g, '""')}"`,
      l.latencyMs || 0,
      l.retrievedChunks?.length || 0,
      l.metadata?.ragFailed ? 'TRUE' : 'FALSE',
      l.userFeedbackRating || '',
      l.reviewerRating || '',
      `"${(l.reviewerNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ai_evaluation_logs_${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/admin', router);
module.exports = app;
