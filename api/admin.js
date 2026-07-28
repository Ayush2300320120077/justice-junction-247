require('dotenv').config();
const express = require('express');
const connectDB = require('../middleware/db');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Booking = require('../models/Booking');
const AdminLog = require('../models/AdminLog');
const AiInteractionLog = require('../models/AiInteractionLog');


const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};

router.use(authMiddleware, requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    await connectDB();
    const totalUsers = await User.countDocuments();
    const totalLawyers = await Lawyer.countDocuments();
    const pendingVerifications = await Lawyer.countDocuments({ isVerified: false });
    const totalBookings = await Booking.countDocuments();
    
    res.json({
      totalUsers,
      totalLawyers,
      pendingVerifications,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    res.json(lawyer);
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

router.get('/pending-verifications', async (req, res) => {
  try {
    await connectDB();
    const lawyers = await Lawyer.find({
      $or: [{ isVerified: false }, { verificationStatus: 'pending' }]
    }).sort({ createdAt: -1 });

    const clients = await User.find({
      role: 'client',
      $or: [{ isVerified: false }, { verificationStatus: 'pending' }]
    }).sort({ createdAt: -1 });

    res.json({ lawyers, clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    // Return structured object if page or limit query parameters passed, or if json expected
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

// Delete User (and associated lawyer/bookings)
router.delete('/users/:id', async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;
    // Don't allow admins to delete themselves
    if (req.user.id === userId) return res.status(400).json({ error: "Cannot delete your own account" });
    
    // Find if user is a lawyer and delete their profile
    await Lawyer.findOneAndDelete({ user: userId });
    // Delete their bookings (as client or lawyer)
    await Booking.deleteMany({ $or: [{ client: userId }, { lawyer: userId }] });
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Lawyer profile
router.delete('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const lawyerId = req.params.id;
    const lawyer = await Lawyer.findByIdAndDelete(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    
    // Also revert their user role back to 'client'
    await User.findByIdAndUpdate(lawyer.user, { role: 'client' });
    
    res.json({ message: "Lawyer profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
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

// Delete Booking
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

// Cancel Booking
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

// Update Lawyer Profile
router.put('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const allowedUpdates = ['name', 'consultationFee', 'experience', 'bio', 'specializations'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updateData[key] = req.body[key];
    });
    
    if (updateData.specializations && typeof updateData.specializations === 'string') {
      updateData.specializations = updateData.specializations.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ message: "Profile updated successfully", lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Lawyer Subscription
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

// Block/Unblock User
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

// POST /api/admin/promote — { userId }
router.post('/promote', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.role === 'admin') {
      return res.json({ success: true, message: "User is already an admin", user: targetUser });
    }

    if (!targetUser.previousRole) {
      targetUser.previousRole = targetUser.role;
    }
    targetUser.role = 'admin';
    await targetUser.save();

    await AdminLog.create({
      actorId: req.user.id,
      action: 'PROMOTE',
      targetId: userId,
      reason: 'Promoted user to admin'
    });

    res.json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/demote — { userId }
router.post('/demote', async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // Safeguard: block demoting yourself if you are the only remaining admin
    const isSelfDemote = req.user.id === userId || targetUser._id.toString() === req.user.id;
    if (isSelfDemote) {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ error: "Cannot demote yourself: you are the only remaining admin" });
      }
    }

    const previousRole = targetUser.previousRole || 'client';
    targetUser.role = previousRole;
    await targetUser.save();

    await AdminLog.create({
      actorId: req.user.id,
      action: 'DEMOTE',
      targetId: userId,
      reason: 'Demoted admin to previous role'
    });

    res.json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/verify-lawyer — { lawyerId, approved: boolean, reason?: string }
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

// POST /api/admin/verify-client — { clientId, approved: boolean, reason?: string }
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

    await AdminLog.create({
      actorId: req.user.id,
      action: approved ? 'VERIFY_CLIENT' : 'REJECT_CLIENT',
      targetId: clientId,
      reason: reason || (approved ? 'Verified client identity' : 'Rejected client verification')
    });

    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/pending-verifications
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

// GET /api/admin/stats — aggregated dashboard stats
router.get('/stats', async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const User = require('../models/User');
    const Lawyer = require('../models/Lawyer');
    const Booking = require('../models/Booking');
    const [totalUsers, totalLawyers, totalBookings, pendingLawyers, completedBookings] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      Lawyer.countDocuments(),
      Booking.countDocuments(),
      Lawyer.countDocuments({ isVerified: false }),
      Booking.countDocuments({ status: 'completed' })
    ]);
    res.json({ totalUsers, totalLawyers, totalBookings, pendingLawyers, completedBookings });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/lawyers/:id/verify — approve or reject lawyer
router.put('/lawyers/:id/verify', async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const Lawyer = require('../models/Lawyer');
    const { isVerified } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ lawyer, message: `Lawyer ${isVerified ? 'approved' : 'rejected'}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/articles — list all articles
router.get('/articles', async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const Article = require('../models/Article');
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/articles/:id/publish — toggle publish status
router.put('/articles/:id/publish', async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const Article = require('../models/Article');
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    article.isPublished = !article.isPublished;
    await article.save();
    res.json({ article, message: `Article ${article.isPublished ? 'published' : 'unpublished'}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/subscription-plans — manage plans
router.get('/subscription-plans', async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const SubscriptionPlan = require('../models/SubscriptionPlan');
    const plans = await SubscriptionPlan.find().sort({ price: 1 });
    res.json({ plans });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/ai-stats — aggregate metrics for RAG/AI evaluation
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

// GET /api/admin/ai-logs — paginated and filterable AiInteractionLog entries
router.get('/ai-logs', async (req, res) => {
  try {
    await connectDB();
    const { page = 1, limit = 20, module: mod, ragFailed, userFeedbackRating } = req.query;

    const filter = {};
    if (mod && mod !== 'all') {
      filter.module = mod;
    }
    if (ragFailed === 'true') {
      filter['metadata.ragFailed'] = true;
    } else if (ragFailed === 'false') {
      filter['metadata.ragFailed'] = { $ne: true };
    }
    if (userFeedbackRating && userFeedbackRating !== 'all') {
      filter.userFeedbackRating = Number(userFeedbackRating);
    }

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

// PATCH /api/admin/ai-logs/:id/annotate — annotate reviewer rating & notes
router.patch('/ai-logs/:id/annotate', async (req, res) => {
  try {
    await connectDB();
    const { reviewerRating, reviewerNotes } = req.body;
    const updateData = {};

    if (reviewerRating !== undefined) {
      const num = Number(reviewerRating);
      if (!isNaN(num) && num >= 1 && num <= 5) {
        updateData.reviewerRating = num;
      }
    }
    if (reviewerNotes !== undefined) {
      updateData.reviewerNotes = String(reviewerNotes);
    }

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

// GET /api/admin/ai-logs/export-csv — export filtered logs as CSV
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

