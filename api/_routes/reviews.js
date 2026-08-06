require('dotenv').config();
const express = require('express');
const connectDB = require('../../middleware/db');
const authMiddleware = require('../../middleware/auth');
const Review = require('../../models/Review');
const Lawyer = require('../../models/Lawyer');
const Booking = require('../../models/Booking');

const app = express();
app.use(express.json());

const router = express.Router();

// POST /api/reviews — client posts a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    if (req.user.role !== 'client') return res.status(403).json({ error: 'Only clients can post reviews' });
    const { lawyerId, bookingId, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    
    // Verify booking exists and is completed
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      if (booking.client.toString() !== req.user.id) return res.status(403).json({ error: 'Not your booking' });
      if (booking.status !== 'completed') return res.status(400).json({ error: 'Booking must be completed before leaving a review' });
    }
    
    // Check if already reviewed this booking
    if (bookingId) {
      const existing = await Review.findOne({ clientId: req.user.id, bookingId });
      if (existing) return res.status(400).json({ error: 'You have already reviewed this booking' });
    }
    
    const review = await Review.create({ clientId: req.user.id, lawyerId, bookingId, rating, comment });
    
    // Update lawyer's average rating
    const lawyer = await Lawyer.findById(lawyerId);
    if (lawyer) {
      await lawyer.updateRating();
      await lawyer.save();
    }
    
    res.status(201).json({ review, message: 'Review posted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/reviews/lawyer/:lawyerId — public, paginated reviews for a lawyer
router.get('/lawyer/:lawyerId', async (req, res) => {
  try {
    await connectDB();
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reviews, total] = await Promise.all([
      Review.find({ lawyerId: req.params.lawyerId })
        .populate('clientId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ lawyerId: req.params.lawyerId })
    ]);
    res.json({ reviews, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/reviews', router);
module.exports = app;
