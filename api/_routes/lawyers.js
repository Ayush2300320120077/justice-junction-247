require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../../middleware/db');
const Lawyer = require('../../models/Lawyer');
const LawyerApplication = require('../../models/LawyerApplication');
const mongoose = require('mongoose');


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

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { city, state, specialization, minExp, maxFee, sort, page = 1, limit = 12 } = req.query;
    const filter = {
      $or: [
        { verificationStatus: 'verified' },
        { isVerified: true },
        { verificationStatus: { $exists: false } }
      ],
      verificationStatus: { $ne: 'rejected' },
      isBlocked: { $ne: true }
    };
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (specialization) filter.specializations = { $in: [new RegExp(specialization, 'i')] };
    if (minExp) filter.experience = { $gte: parseInt(minExp) };
    if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) };
    const sortMap = {
      rating: { averageRating: -1 }, price_low: { consultationFee: 1 },
      price_high: { consultationFee: -1 }, experience: { experience: -1 }, newest: { createdAt: -1 }
    };
    const sortOption = sortMap[sort] || { averageRating: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [lawyers, total] = await Promise.all([
      Lawyer.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)).select('-user -__v'),
      Lawyer.countDocuments(filter)
    ]);
    res.json({ lawyers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lawyer ID' });
    }
    const lawyer = await Lawyer.findById(req.params.id).select('-user -__v');
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ lawyer });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.post('/:id/review', async (req, res) => {
  try {
    await connectDB();
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    lawyer.reviews.push({ client: decoded.id, clientName: decoded.name, rating: req.body.rating, comment: req.body.comment });
    lawyer.updateRating();
    await lawyer.save();
    res.json({ message: 'Review added', averageRating: lawyer.averageRating });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/profile/update', async (req, res) => {
  try {
    await connectDB();
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    if (decoded.role !== 'lawyer') return res.status(403).json({ error: 'Access denied' });
    const lawyer = await Lawyer.findOne({ user: decoded.id });
    if (!lawyer) return res.status(404).json({ error: 'Profile not found' });
    const allowed = ['bio', 'consultationFee', 'specializations', 'languages', 'isAvailable', 'phone', 'city', 'state',
      'photo', 'address', 'dateOfBirth', 'gender', 'barCouncilState', 'yearOfEnrollment', 'designation', 'currentFirm',
      'courts', 'consultationModes', 'availableDays', 'availableTimeFrom', 'availableTimeTo', 'linkedinUrl', 'websiteUrl'];
    allowed.forEach(f => { if (req.body[f] !== undefined) lawyer[f] = req.body[f]; });
    await lawyer.save();
    res.json({ message: 'Profile updated', lawyer });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/seed/demo', async (req, res) => {
  try {
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
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/lawyer-application — join-as-lawyer form submission ────────────
const applicationRouter = express.Router();

applicationRouter.post('/', async (req, res) => {
  try {
    const { name, phone, email, barCouncilNumber, specialization, city, yearsOfExperience } = req.body;

    if (!name || !phone || !email || !barCouncilNumber || !specialization || !city || !yearsOfExperience) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
    }

    await connectDB();

    const existing = await LawyerApplication.findOne({ $or: [{ email }, { barCouncilNumber }] });
    if (existing) {
      return res.status(409).json({ error: 'An application with this email or Bar Council number already exists.' });
    }

    const application = await LawyerApplication.create({
      name, phone, email, barCouncilNumber, specialization,
      city, yearsOfExperience: parseInt(yearsOfExperience)
    });

    console.log('NEW LAWYER APPLICATION received:', application._id, name, email);
    return res.status(201).json({
      message: 'Application submitted successfully! We will review and contact you within 24–48 hours.',
      id: application._id
    });
  } catch (err) {
    console.error('Lawyer application error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

app.use('/api/lawyers', router);
app.use('/api/search', router);
app.use('/api/lawyer-application', applicationRouter);
module.exports = app;

