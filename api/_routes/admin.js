require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../../middleware/db');
const { requireAuth, requireRole } = require('../../middleware/auth');
const User = require('../../models/User');
const Lawyer = require('../../models/Lawyer');
const Booking = require('../../models/Booking');
const AdminLog = require('../../models/AdminLog');
const AiInteractionLog = require('../../models/AiInteractionLog');
const Payment = require('../../models/Payment');
const UserSubscription = require('../../models/UserSubscription');
const Review = require('../../models/Review');
const Article = require('../../models/Article');
const DocumentTemplate = require('../../models/DocumentTemplate');
const { sendEmail } = require('../../utils/mailer');
const ChatQuery = require('../../models/ChatQuery');
const ContactMessage = require('../../models/ContactMessage');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

const app = express();

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const paginate = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};



// ── ADMIN LOGIN ──
router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], asyncHandler(async (req, res) => {
  await connectDB();
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  if (user.role !== 'admin') {
    return res.status(401).json({ success: false, error: 'Invalid credentials' }); // Same error intentionally to avoid leaking roles
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = crypto.randomBytes(40).toString('hex');
  user.refreshTokens.push(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

// ── REQUIRE ADMIN AUTH MIDDLEWARE ──
router.use(requireAuth, requireRole('admin'));

// ── DASHBOARD STATS ──
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  await connectDB();
  
  const totalUsers = await User.countDocuments({ role: 'client' });
  const activeLawyers = await Lawyer.countDocuments({ isVerified: true });
  const pendingLawyers = await Lawyer.countDocuments({ $or: [{ isVerified: false }, { verificationStatus: 'pending' }] });
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const payments = await Payment.aggregate([
    { $match: { status: 'paid', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
  ]);
  const revenueThisMonth = payments.length > 0 ? payments[0].totalRevenue : 0;
  
  const activeSubscriptions = await UserSubscription.countDocuments({ status: 'active' });
  
  res.json({
    success: true,
    data: { totalUsers, activeLawyers, pendingLawyers, revenueThisMonth, activeSubscriptions }
  });
}));

// ── USERS ──
router.get('/users', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status !== undefined) filter.isBlocked = req.query.status === 'blocked';
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }
  
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await User.countDocuments(filter);
  
  res.json({ success: true, data: users, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

router.patch('/users/:id/status', asyncHandler(async (req, res) => {
  await connectDB();
  if (req.user.id === req.params.id) return res.status(400).json({ success: false, error: "Cannot modify your own status" });
  
  const isBlocked = req.body.isBlocked;
  if (typeof isBlocked !== 'boolean') return res.status(400).json({ success: false, error: 'isBlocked boolean is required' });

  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  
  res.json({ success: true, data: user });
}));

// ── LAWYERS ──
router.get('/lawyers/pending', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  
  const filter = { $or: [{ isVerified: false }, { verificationStatus: 'pending' }] };
  const lawyers = await Lawyer.find(filter).populate('user', 'email').sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Lawyer.countDocuments(filter);
  
  res.json({ success: true, data: lawyers, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

router.patch('/lawyers/:id/verify', asyncHandler(async (req, res) => {
  await connectDB();
  const { approved, reason } = req.body;
  if (typeof approved !== 'boolean') return res.status(400).json({ success: false, error: 'approved boolean is required' });
  
  const status = approved ? 'verified' : 'rejected';
  const lawyer = await Lawyer.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: status,
      isVerified: approved === true,
      rejectionReason: approved ? '' : (reason || 'Verification rejected')
    },
    { new: true }
  );
  if (!lawyer) return res.status(404).json({ success: false, error: 'Lawyer not found' });
  
  // Send email notification
  const subject = approved ? 'Account Verified - Justice Junction' : 'Account Verification Rejected - Justice Junction';
  const html = approved 
    ? `<p>Dear ${lawyer.name},</p><p>Your account has been successfully verified! You will now appear in search results.</p>`
    : `<p>Dear ${lawyer.name},</p><p>Unfortunately, your verification was rejected.</p><p>Reason: ${reason || 'Verification rejected'}</p><p>Please update your credentials and try again.</p>`;
    
  sendEmail({ to: lawyer.email, subject, html }).catch(console.error);

  res.json({ success: true, data: lawyer, message: `Lawyer ${approved ? 'approved' : 'rejected'}` });
}));

// ── REVIEWS ──
router.get('/reviews/pending', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  
  const filter = { status: 'pending' };
  const reviews = await Review.find(filter)
    .populate('clientId', 'name email')
    .populate('lawyerId', 'name')
    .sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Review.countDocuments(filter);
  
  res.json({ success: true, data: reviews, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

router.patch('/reviews/:id/moderate', asyncHandler(async (req, res) => {
  await connectDB();
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'status must be approved or rejected' });
  }
  
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
  
  res.json({ success: true, data: review });
}));

// ── ARTICLES ──
router.get('/articles', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  const articles = await Article.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Article.countDocuments();
  res.json({ success: true, data: articles, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

router.post('/articles', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 250 }).withMessage('Title too long'),
  body('content').notEmpty().withMessage('Content is required'),
  validate
], asyncHandler(async (req, res) => {
  await connectDB();
  let { title, content, author, tags, isPublished, slug } = req.body;
  
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let existing = await Article.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${counter}`;
      existing = await Article.findOne({ slug });
      counter++;
    }
  } else {
    const existing = await Article.findOne({ slug });
    if (existing) return res.status(400).json({ success: false, error: 'Article with this slug already exists' });
  }
  
  const article = await Article.create({ title, slug, content, author, tags, isPublished });
  res.status(201).json({ success: true, data: article });
}));

router.put('/articles/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 250 }).withMessage('Title too long'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  validate
], asyncHandler(async (req, res) => {
  await connectDB();
  const { title, content, author, tags, isPublished, slug } = req.body;
  const updateData = { title, content, author, tags, isPublished };
  if (slug) {
    const existing = await Article.findOne({ slug, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ success: false, error: 'Slug already in use' });
    updateData.slug = slug;
  }
  
  const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
  res.json({ success: true, data: article });
}));

router.delete('/articles/:id', asyncHandler(async (req, res) => {
  await connectDB();
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
  res.json({ success: true, message: 'Article deleted' });
}));

// ── DOCUMENT TEMPLATES ──
router.get('/document-templates', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  const templates = await DocumentTemplate.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await DocumentTemplate.countDocuments();
  res.json({ success: true, data: templates, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

router.post('/document-templates', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 250 }).withMessage('Title too long'),
  body('category').optional().isString().withMessage('Category must be a string'),
  validate
], asyncHandler(async (req, res) => {
  await connectDB();
  const { title, category, description, fields, templateBody, isActive } = req.body;
  const templateData = { title, category, description, fields, templateBody, createdBy: req.user.id };
  if (isActive !== undefined) templateData.isActive = isActive;
  
  const template = await DocumentTemplate.create(templateData);
  res.status(201).json({ success: true, data: template });
}));

router.put('/document-templates/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 250 }).withMessage('Title too long'),
  body('category').optional().isString().withMessage('Category must be a string'),
  validate
], asyncHandler(async (req, res) => {
  await connectDB();
  const { title, category, description, fields, templateBody, isActive } = req.body;
  const templateData = { title, category, description, fields, templateBody };
  if (isActive !== undefined) templateData.isActive = isActive;
  
  const template = await DocumentTemplate.findByIdAndUpdate(req.params.id, templateData, { new: true });
  if (!template) return res.status(404).json({ success: false, error: 'Template not found' });
  res.json({ success: true, data: template });
}));

router.delete('/document-templates/:id', asyncHandler(async (req, res) => {
  await connectDB();
  const template = await DocumentTemplate.findByIdAndDelete(req.params.id);
  if (!template) return res.status(404).json({ success: false, error: 'Template not found' });
  res.json({ success: true, message: 'Template deleted' });
}));

// ── PAYMENTS ──
router.get('/payments', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  const { status, startDate, endDate } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  
  const payments = await Payment.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Payment.countDocuments(filter);
  res.json({ success: true, data: payments, total, page, totalPages: Math.ceil(total / limit) || 1 });
}));

// ── CHAT QUERIES ──
router.get('/chat-queries', asyncHandler(async (req, res) => {
  await connectDB();
  const { page, limit, skip } = paginate(req);
  const { classifiedCategory } = req.query;
  
  const filter = {};
  if (classifiedCategory) filter.classifiedCategory = classifiedCategory;
  
  const queries = await ChatQuery.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await ChatQuery.countDocuments(filter);
  
  const categoryCountsAgg = await ChatQuery.aggregate([
    { $group: { _id: '$classifiedCategory', count: { $sum: 1 } } }
  ]);
  const categoryCount = {};
  categoryCountsAgg.forEach(item => {
    categoryCount[item._id || 'Uncategorized'] = item.count;
  });
  
  res.json({ success: true, data: queries, total, page, totalPages: Math.ceil(total / limit) || 1, categoryCount });
}));



app.use('/api/admin', router);
// ── UNIFIED QUERIES & COMPLAINTS ──
router.get('/queries', asyncHandler(async (req, res) => {
  await connectDB();
  // Get query params
  const typeFilter = req.query.type || 'all'; // 'all', 'contact', 'chat', 'review'
  const resolvedFilter = req.query.resolved; // 'true', 'false', or undefined
  const search = req.query.search ? req.query.search.toLowerCase() : '';
  
  let results = [];
  
  // 1. Fetch Contact Messages
  if (typeFilter === 'all' || typeFilter === 'contact') {
    let q = {};
    if (resolvedFilter !== undefined) q.resolved = resolvedFilter === 'true';
    const contacts = await ContactMessage.find(q).sort({ createdAt: -1 }).limit(100).lean();
    contacts.forEach(c => {
      results.push({
        _id: c._id,
        sourceType: 'contact',
        user: { name: c.name, email: c.email },
        content: `Subject: ${c.subject || 'N/A'}\nMessage: ${c.message}`,
        resolved: c.resolved,
        adminNote: c.adminNote,
        createdAt: c.createdAt
      });
    });
  }
  
  // 2. Fetch Chat Queries
  if (typeFilter === 'all' || typeFilter === 'chat') {
    let q = {};
    if (resolvedFilter !== undefined) q.resolved = resolvedFilter === 'true';
    const chats = await ChatQuery.find(q).populate('userId', 'name email').sort({ createdAt: -1 }).limit(100).lean();
    chats.forEach(c => {
      results.push({
        _id: c._id,
        sourceType: 'chat',
        user: c.userId ? { name: c.userId.name, email: c.userId.email } : { name: 'Anonymous', email: '' },
        content: `Query: ${c.query}\nResponse: ${c.response}`,
        resolved: c.resolved,
        adminNote: c.adminNote,
        createdAt: c.createdAt
      });
    });
  }
  
  // 3. Fetch Reviews
  if (typeFilter === 'all' || typeFilter === 'review') {
    let q = {};
    if (resolvedFilter !== undefined) q.resolved = resolvedFilter === 'true';
    const reviews = await Review.find(q).populate('clientId', 'name email').populate('lawyerId', 'name').sort({ createdAt: -1 }).limit(100).lean();
    reviews.forEach(r => {
      results.push({
        _id: r._id,
        sourceType: 'review',
        user: r.clientId ? { name: r.clientId.name, email: r.clientId.email } : { name: 'Unknown', email: '' },
        content: `Lawyer: ${r.lawyerId ? r.lawyerId.name : 'Unknown'}\nRating: ${r.rating}\nComment: ${r.comment || 'No comment'}`,
        resolved: r.resolved,
        adminNote: r.adminNote,
        createdAt: r.createdAt
      });
    });
  }
  
  // Search filter
  if (search) {
    results = results.filter(r => 
      (r.user.name && r.user.name.toLowerCase().includes(search)) ||
      (r.user.email && r.user.email.toLowerCase().includes(search)) ||
      (r.content && r.content.toLowerCase().includes(search))
    );
  }
  
  // Sort combined results by descending date
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Simple array slice pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const paginatedResults = results.slice(skip, skip + limit);
  
  res.json({
    success: true,
    data: paginatedResults,
    total: results.length,
    page,
    totalPages: Math.ceil(results.length / limit) || 1
  });
}));

router.patch('/queries/resolve', asyncHandler(async (req, res) => {
  await connectDB();
  const { id, sourceType, resolved, adminNote } = req.body;
  if (!id || !sourceType) return res.status(400).json({ success: false, error: 'id and sourceType are required' });
  
  let Model;
  if (sourceType === 'contact') Model = ContactMessage;
  else if (sourceType === 'chat') Model = ChatQuery;
  else if (sourceType === 'review') Model = Review;
  else return res.status(400).json({ success: false, error: 'Invalid sourceType' });
  
  const updateData = {};
  if (resolved !== undefined) updateData.resolved = resolved;
  if (adminNote !== undefined) updateData.adminNote = adminNote;
  
  const doc = await Model.findByIdAndUpdate(id, updateData, { new: true });
  if (!doc) return res.status(404).json({ success: false, error: 'Record not found' });
  
  res.json({ success: true, data: doc, message: 'Updated successfully' });
}));

// ── REAL-TIME CASE DASHBOARD ──
router.get('/bookings', asyncHandler(async (req, res) => {
  await connectDB();
  
  const { status, lawyerId, search, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
  let query = {};
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (lawyerId) {
    query.lawyer = lawyerId;
  }
  
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { caseNumber: searchRegex },
      { clientName: searchRegex },
      { lawyerName: searchRegex }
    ];
  }
  
  const total = await Booking.countDocuments(query);
  
  const bookings = await Booking.find(query)
    .populate('client', 'name email phone')
    .populate('lawyer', 'name email phone barCouncilState')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();
    
  res.json({
    success: true,
    data: bookings,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)) || 1
  });
}));

module.exports = router;
