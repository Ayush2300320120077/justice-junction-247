require('dotenv').config();
const express = require('express');
const connectDB = require('../../middleware/db');
const Lawyer = require('../../models/Lawyer');
const LawyerApplication = require('../../models/LawyerApplication');
const { requireAuth } = require('../../middleware/auth');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// ── No manual CORS headers — handled globally in server.js ──

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

const router = express.Router();

// GET /api/lawyers — public lawyer search with filters
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { city, state, specialization, minExp, maxFee, sort, page = 1, limit = 12 } = req.query;

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit) || 12)); // Cap at 50

    const filter = {
      $or: [
        { verificationStatus: 'verified' },
        { isVerified: true },
        { verificationStatus: { $exists: false } }
      ],
      verificationStatus: { $ne: 'rejected' },
      isBlocked: { $ne: true }
    };

    if (city) filter.city = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (state) filter.state = new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (specialization) filter.specializations = { $in: [new RegExp(specialization.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')] };
    if (minExp) filter.experience = { $gte: parseInt(minExp) };
    if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) };

    const sortMap = {
      rating:     { averageRating: -1 },
      price_low:  { consultationFee: 1 },
      price_high: { consultationFee: -1 },
      experience: { experience: -1 },
      newest:     { createdAt: -1 }
    };
    const sortOption = sortMap[sort] || { averageRating: -1 };
    const skip = (parsedPage - 1) * parsedLimit;

    const [lawyers, total] = await Promise.all([
      Lawyer.find(filter).sort(sortOption).skip(skip).limit(parsedLimit).select('-user -__v'),
      Lawyer.countDocuments(filter)
    ]);

    res.json({ lawyers, total, page: parsedPage, pages: Math.ceil(total / parsedLimit) });
  } catch (err) {
    console.error('Get lawyers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch lawyers.' });
  }
});

// GET /api/lawyers/:id — public lawyer profile
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lawyer ID' });
    }
    const lawyer = await Lawyer.findById(req.params.id).select('-user -__v');
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ lawyer });
  } catch (err) {
    console.error('Get lawyer error:', err.message);
    res.status(500).json({ error: 'Failed to fetch lawyer profile.' });
  }
});

// POST /api/lawyers/:id/review — client submits a review (BUG 17 FIX: full validation)
router.post('/:id/review', requireAuth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment must be under 1000 characters'),
  validate
], async (req, res) => {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lawyer ID' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can submit reviews' });
    }

    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    // BUG 17 FIX: Prevent lawyer from reviewing themselves
    if (lawyer.user && lawyer.user.toString() === req.user.id) {
      return res.status(403).json({ error: 'You cannot review your own profile' });
    }

    const { rating, comment } = req.body;
    lawyer.reviews.push({ client: req.user.id, clientName: req.user.name, rating, comment });
    lawyer.updateRating();
    await lawyer.save();

    res.json({ message: 'Review added successfully', averageRating: lawyer.averageRating });
  } catch (err) {
    console.error('Add review error:', err.message);
    res.status(500).json({ error: 'Failed to add review.' });
  }
});

// PUT /api/lawyers/profile/update — lawyer updates their own profile
router.put('/profile/update', requireAuth, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'lawyer') return res.status(403).json({ error: 'Access denied: lawyers only' });

    const lawyer = await Lawyer.findOne({ user: req.user.id });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' });

    const allowed = [
      'bio', 'consultationFee', 'specializations', 'languages', 'isAvailable',
      'phone', 'city', 'state', 'photo', 'address', 'dateOfBirth', 'gender',
      'barCouncilState', 'yearOfEnrollment', 'designation', 'currentFirm',
      'courts', 'consultationModes', 'availableDays', 'availableTimeFrom',
      'availableTimeTo', 'linkedinUrl', 'websiteUrl'
    ];

    allowed.forEach(f => { if (req.body[f] !== undefined) lawyer[f] = req.body[f]; });
    await lawyer.save();
    res.json({ message: 'Profile updated successfully', lawyer });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/lawyers/seed/demo — BUG 5 FIX: admin auth + dev-only guard
router.post('/seed/demo', requireAuth, async (req, res) => {
  try {
    // Only allow in non-production environments OR for admins
    if (process.env.NODE_ENV === 'production' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Seed endpoint is disabled in production' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    await connectDB();
    const demo = [
      { name:'Adv. Priya Sharma', email:'priya@demo.com', barRegistrationNumber:'BAR001', specializations:['Criminal Defence','Bail & Custody'], experience:15, experienceLevel:'senior', city:'Delhi', state:'Delhi', consultationFee:4500, averageRating:4.9, totalReviews:124, isVerified:true, isAvailable:true, bio:'Senior criminal defence specialist with 15 years of high court experience.', user:'000000000000000000000001' },
      { name:'Adv. Rahul Mehta', email:'rahul@demo.com', barRegistrationNumber:'BAR002', specializations:['Family Law','Divorce','Child Custody'], experience:7, experienceLevel:'mid', city:'Mumbai', state:'Maharashtra', consultationFee:2200, averageRating:4.8, totalReviews:98, isVerified:true, isAvailable:true, bio:'Compassionate family law advocate helping families navigate difficult transitions.', user:'000000000000000000000002' },
      { name:'Adv. Sneha Joshi', email:'sneha@demo.com', barRegistrationNumber:'BAR003', specializations:['Consumer Rights','Civil Disputes','RTI'], experience:2, experienceLevel:'junior', city:'Bangalore', state:'Karnataka', consultationFee:800, averageRating:4.6, totalReviews:52, isVerified:true, isAvailable:true, bio:'Passionate about consumer rights and civil justice for everyday people.', user:'000000000000000000000003' },
      { name:'Adv. Arjun Kapoor', email:'arjun@demo.com', barRegistrationNumber:'BAR004', specializations:['Corporate Law','Contracts','M&A'], experience:20, experienceLevel:'senior', city:'Gurgaon', state:'Haryana', consultationFee:8000, averageRating:5.0, totalReviews:211, isVerified:true, isAvailable:true, bio:'Top-tier corporate lawyer trusted by Fortune 500 companies.', user:'000000000000000000000004' },
      { name:'Adv. Nisha Rao', email:'nisha@demo.com', barRegistrationNumber:'BAR005', specializations:['Property Law','RERA','Land Disputes'], experience:10, experienceLevel:'mid', city:'Hyderabad', state:'Telangana', consultationFee:3000, averageRating:4.7, totalReviews:76, isVerified:true, isAvailable:true, bio:'Property law specialist with deep expertise in RERA disputes.', user:'000000000000000000000005' },
      { name:'Adv. Vikram Tiwari', email:'vikram@demo.com', barRegistrationNumber:'BAR006', specializations:['Labour Law','Employment','Wrongful Termination'], experience:5, experienceLevel:'mid', city:'Lucknow', state:'Uttar Pradesh', consultationFee:1500, averageRating:4.5, totalReviews:43, isVerified:true, isAvailable:true, bio:'Employment rights advocate fighting for workers across India.', user:'000000000000000000000006' }
    ];

    await Lawyer.deleteMany({ barRegistrationNumber: { $in: demo.map(d => d.barRegistrationNumber) } });
    await Lawyer.insertMany(demo);

    res.json({ message: 'Demo lawyers seeded', count: demo.length });
  } catch (err) {
    console.error('Seed demo error:', err.message);
    res.status(500).json({ error: 'Seeding failed.' });
  }
});

// ── POST /api/lawyer-application ──────────────────────────────────────────────
const applicationRouter = express.Router();

applicationRouter.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').matches(/^\d{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  body('barCouncilNumber').trim().notEmpty().withMessage('Bar Council number is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('yearsOfExperience').isInt({ min: 0, max: 60 }).withMessage('Valid years of experience is required'),
  validate
], async (req, res) => {
  try {
    const { name, phone, email, barCouncilNumber, specialization, city, yearsOfExperience } = req.body;

    await connectDB();

    const existing = await LawyerApplication.findOne({ $or: [{ email }, { barCouncilNumber }] });
    if (existing) {
      return res.status(409).json({ error: 'An application with this email or Bar Council number already exists.' });
    }

    const application = await LawyerApplication.create({
      name, phone, email, barCouncilNumber, specialization,
      city, yearsOfExperience: parseInt(yearsOfExperience)
    });

    // BUG 11 FIX: No PII in production logs
    if (process.env.NODE_ENV !== 'production') {
      console.log('New lawyer application:', application._id);
    }

    return res.status(201).json({
      message: 'Application submitted successfully! We will review and contact you within 24–48 hours.',
      id: application._id
    });
  } catch (err) {
    console.error('Lawyer application error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

const app = express();
app.use('/api/lawyers', router);
app.use('/api/search', router);
app.use('/api/lawyer-application', applicationRouter);
module.exports = app;
