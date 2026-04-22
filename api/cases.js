require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../middleware/db');
const CaseUpdate = require('../models/CaseUpdate');
const Booking = require('../models/Booking');
const Lawyer = require('../models/Lawyer');

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
    if (!user || user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' });
    const lawyer = await Lawyer.findOne({ user: user.id });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' });
    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    const update = await CaseUpdate.create({
      booking: booking._id, lawyer: lawyer._id, client: booking.client,
      caseNumber: booking.caseNumber, title: req.body.title,
      description: req.body.description, stage: req.body.stage || 'consultation',
      status: req.body.status || 'active', nextHearing: req.body.nextHearing || null
    });
    res.status(201).json({ update, message: 'Case update posted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/booking/:bookingId', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const updates = await CaseUpdate.find({ booking: req.params.bookingId }).sort({ createdAt: 1 });
    res.json({ updates });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my', async (req, res) => {
  try {
    await connectDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const updates = await CaseUpdate.find({ client: user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ updates });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/cases', router);
module.exports = app;
