require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const connectDB = require('../../middleware/db');
const User = require('../../models/User');
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

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, phone, city, state,
            specializations, experience, barRegistrationNumber,
            consultationFee, bio } = req.body;
    const role = (req.body.role === 'lawyer') ? 'lawyer' : 'client';

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, role, phone, city, state });

    if (role === 'lawyer') {
      const exp = parseInt(experience) || 0;
      const level = exp >= 13 ? 'senior' : exp >= 5 ? 'mid' : 'junior';
      await Lawyer.create({
        user: user._id, name, email, phone, city, state,
        barRegistrationNumber, specializations: specializations || [],
        experience: exp, experienceLevel: level,
        consultationFee: parseFloat(consultationFee) || 0,
        bio: bio || ''
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PROFILE
router.get('/me', async (req, res) => {
  try {
    await connectDB();
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.use('/.netlify/functions/auth', router);
module.exports.handler = serverless(app);
