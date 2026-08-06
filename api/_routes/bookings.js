require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const connectDB = require('../../middleware/db');
const Booking = require('../../models/Booking');
const Lawyer = require('../../models/Lawyer');
const { requireAuth } = require('../../middleware/auth');
const mongoose = require('mongoose');

// ── No manual CORS headers — handled globally in server.js ──

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 bookings per IP per hour
  message: { error: 'Too many booking attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const ALLOWED_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const router = express.Router();

// POST /api/bookings — create a booking (auth required)
router.post('/', requireAuth, bookingLimiter, async (req, res) => {
  try {
    await connectDB();
    const { lawyerId, caseType, description, scheduledDate, scheduledTime } = req.body;

    // Validate inputs
    if (!lawyerId || !mongoose.Types.ObjectId.isValid(lawyerId)) {
      return res.status(400).json({ error: 'Valid lawyerId is required' });
    }
    if (!caseType) return res.status(400).json({ error: 'caseType is required' });
    if (description && description.length > 2000) {
      return res.status(400).json({ error: 'Description must be under 2000 characters' });
    }

    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    if (!lawyer.isAvailable) return res.status(400).json({ error: 'Lawyer is not available for bookings' });

    const booking = await Booking.create({
      client: req.user.id,
      clientName: req.user.name,
      lawyer: lawyer._id,
      lawyerName: lawyer.name,
      caseType,
      description: description || '',
      scheduledDate,
      scheduledTime,
      fee: lawyer.consultationFee, // Always use server-side fee
      meetingLink: `https://meet.jit.si/JJ-${require('crypto').randomBytes(6).toString('hex')}`
    });

    res.status(201).json({ booking, message: 'Booking created! Complete payment to confirm.' });
  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ error: 'Failed to create booking. Please try again.' });
  }
});

// GET /api/bookings/my — get current user's bookings
router.get('/my', requireAuth, async (req, res) => {
  try {
    await connectDB();
    let bookings;
    if (req.user.role === 'client') {
      bookings = await Booking.find({ client: req.user.id }).sort({ createdAt: -1 });
    } else {
      const lawyer = await Lawyer.findOne({ user: req.user.id });
      if (!lawyer) return res.json({ bookings: [] });
      bookings = await Booking.find({ lawyer: lawyer._id }).sort({ createdAt: -1 });
    }
    res.json({ bookings });
  } catch (err) {
    console.error('Get bookings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/bookings/:id — get single booking (BUG 4 FIX: ownership check)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    await connectDB();

    // Validate ObjectId (BUG 13)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // BUG 4 FIX: Verify the requesting user owns this booking or is the lawyer
    if (req.user.role === 'admin') {
      return res.json({ booking }); // Admins can see all
    }

    const isClient = booking.client.toString() === req.user.id;
    let isLawyer = false;
    if (req.user.role === 'lawyer') {
      const lawyerProfile = await Lawyer.findOne({ user: req.user.id }).select('_id');
      isLawyer = lawyerProfile && booking.lawyer.toString() === lawyerProfile._id.toString();
    }

    if (!isClient && !isLawyer) {
      return res.status(403).json({ error: 'Access denied: not your booking' });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Get booking error:', err.message);
    res.status(500).json({ error: 'Failed to fetch booking.' });
  }
});

// PUT /api/bookings/:id/status — update booking status (BUG 3 FIX: ownership + enum validation)
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    await connectDB();

    // Validate ObjectId (BUG 13)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const { status } = req.body;

    // BUG 3 FIX: Validate status value
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // BUG 3 FIX: Role-based permission checks
    if (req.user.role === 'admin') {
      // Admins can update any booking
    } else if (req.user.role === 'client') {
      // Clients can only cancel their own bookings
      if (booking.client.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied: not your booking' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ error: 'Clients can only cancel bookings' });
      }
    } else if (req.user.role === 'lawyer') {
      // Lawyers can only update their own bookings
      const lawyerProfile = await Lawyer.findOne({ user: req.user.id }).select('_id');
      if (!lawyerProfile || booking.lawyer.toString() !== lawyerProfile._id.toString()) {
        return res.status(403).json({ error: 'Access denied: not your booking' });
      }
      // Lawyers can confirm or complete bookings
      if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(403).json({ error: 'Invalid status transition' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    booking.status = status;
    await booking.save();
    res.json({ booking, message: 'Status updated' });
  } catch (err) {
    console.error('Update booking status error:', err.message);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

const app = express();
app.use('/api/bookings', router);
module.exports = app;
