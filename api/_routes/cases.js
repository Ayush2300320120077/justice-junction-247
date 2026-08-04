require('dotenv').config();
const express = require('express');
const connectDB = require('../../middleware/db');
const CaseUpdate = require('../../models/CaseUpdate');
const Case = require('../../models/Case');
const Booking = require('../../models/Booking');
const Lawyer = require('../../models/Lawyer');
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

// POST /api/cases — lawyer posts a case update
router.post('/', requireAuth, [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  validate
], async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });

    const { bookingId } = req.body;
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Valid bookingId is required' });
    }

    const lawyer = await Lawyer.findOne({ user: req.user.id });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Verify the lawyer owns this booking
    if (booking.lawyer.toString() !== lawyer._id.toString()) {
      return res.status(403).json({ error: 'Access denied: not your booking' });
    }

    const update = await CaseUpdate.create({
      booking: booking._id,
      lawyer: lawyer._id,
      client: booking.client,
      caseNumber: booking.caseNumber,
      title: req.body.title,
      description: req.body.description,
      stage: req.body.stage || 'consultation',
      status: req.body.status || 'active',
      nextHearing: req.body.nextHearing || null
    });

    res.status(201).json({ update, message: 'Case update posted' });
  } catch (err) {
    console.error('Post case update error:', err.message);
    res.status(500).json({ error: 'Failed to post case update.' });
  }
});

// GET /api/cases/booking/:bookingId — get updates for a booking
router.get('/booking/:bookingId', requireAuth, async (req, res) => {
  try {
    await connectDB();

    // BUG 13 FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const updates = await CaseUpdate.find({ booking: req.params.bookingId }).sort({ createdAt: 1 });
    res.json({ updates });
  } catch (err) {
    console.error('Get case updates error:', err.message);
    res.status(500).json({ error: 'Failed to fetch case updates.' });
  }
});

// GET /api/cases/my — client's case updates
router.get('/my', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const updates = await CaseUpdate.find({ client: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ updates });
  } catch (err) {
    console.error('Get my cases error:', err.message);
    res.status(500).json({ error: 'Failed to fetch case updates.' });
  }
});

// ── /api/my-cases — personal case tracker ────────────────────────────────────
const myCasesRouter = express.Router();

myCasesRouter.get('/', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const cases = await Case.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ cases });
  } catch (err) {
    console.error('Get my cases error:', err.message);
    res.status(500).json({ error: 'Failed to fetch cases.' });
  }
});

myCasesRouter.post('/', requireAuth, [
  body('title').trim().notEmpty().withMessage('Case title is required').isLength({ max: 200 }),
  body('courtName').optional().trim().isLength({ max: 200 }),
  body('caseNumber').optional().trim().isLength({ max: 100 }),
  body('notes').optional().trim().isLength({ max: 2000 }),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { title, courtName, caseNumber, nextHearingDate, notes } = req.body;
    const newCase = await Case.create({
      user: req.user.id, title, courtName, caseNumber,
      nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null,
      notes
    });
    return res.status(201).json({ case: newCase });
  } catch (err) {
    console.error('Create case error:', err.message);
    res.status(500).json({ error: 'Failed to create case.' });
  }
});

myCasesRouter.put('/:id', requireAuth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('notes').optional().trim().isLength({ max: 2000 }),
  validate
], async (req, res) => {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    const { title, courtName, caseNumber, nextHearingDate, notes } = req.body;
    const updated = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ownership enforced
      { title, courtName, caseNumber, nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null, notes, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Case not found' });
    return res.status(200).json({ case: updated });
  } catch (err) {
    console.error('Update case error:', err.message);
    res.status(500).json({ error: 'Failed to update case.' });
  }
});

myCasesRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    // Ownership enforced via query
    const deleted = await Case.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Case not found or access denied' });

    return res.status(200).json({ message: 'Case deleted' });
  } catch (err) {
    console.error('Delete case error:', err.message);
    res.status(500).json({ error: 'Failed to delete case.' });
  }
});

const app = express();
app.use('/api/cases', router);
app.use('/api/my-cases', myCasesRouter);
module.exports = app;
