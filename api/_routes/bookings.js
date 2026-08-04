require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../../middleware/db');
const Booking = require('../../models/Booking');
const Lawyer = require('../../models/Lawyer');

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

router.post('/', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { lawyerId, caseType, description, scheduledDate, scheduledTime } = req.body;
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    if (!lawyer.isAvailable) return res.status(400).json({ error: 'Lawyer not available' });
    const booking = await Booking.create({
      client: user.id, clientName: user.name,
      lawyer: lawyer._id, lawyerName: lawyer.name,
      caseType, description, scheduledDate, scheduledTime,
      fee: lawyer.consultationFee,
      meetingLink: `https://meet.jit.si/JJ-${Math.random().toString(36).substr(2, 8)}`
    });
    res.status(201).json({ booking, message: 'Booking confirmed!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    let bookings;
    if (user.role === 'client') {
      bookings = await Booking.find({ client: user.id }).sort({ createdAt: -1 });
    } else {
      const lawyer = await Lawyer.findOne({ user: user.id });
      if (!lawyer) return res.json({ bookings: [] });
      bookings = await Booking.find({ lawyer: lawyer._id }).sort({ createdAt: -1 });
    }
    res.json({ bookings });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/status', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });
    booking.status = req.body.status;
    await booking.save();
    res.json({ booking, message: 'Status updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/bookings', router);
module.exports = app;
