require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const connectDB = require('../../middleware/db');
const User = require('../../models/User');
const Lawyer = require('../../models/Lawyer');
const { requireAuth } = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
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
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
};

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
], async (req, res) => {
  try {
    await connectDB();
    let { name, email, password, role, phone, city, state,
            specializations, experience, barRegistrationNumber,
            consultationFee, bio,
            dateOfBirth, gender, photo, address,
            barCouncilState, yearOfEnrollment, designation, currentFirm,
            courts, languages,
            consultationModes, availableDays, availableTimeFrom, availableTimeTo,
            linkedinUrl, websiteUrl } = req.body;

    role = (role === 'lawyer') ? 'lawyer' : 'client';

    if (role === 'lawyer') {
      phone = phone || '9876543210';
      city = city || 'Delhi';
      state = state || 'Delhi';
      barRegistrationNumber = barRegistrationNumber || `BAR/${Date.now().toString().slice(-6)}`;
      barCouncilState = barCouncilState || state || 'Delhi';
      specializations = (Array.isArray(specializations) && specializations.length > 0) ? specializations : ['General Practice'];
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({ 
      name, email, password, role, phone, city, state,
      emailVerificationToken, emailVerificationExpires
    });
    
    if (role === 'lawyer') {
      const exp = parseInt(experience) || 0;
      const level = exp >= 13 ? 'senior' : exp >= 5 ? 'mid' : 'junior';
      await Lawyer.create({
        user: user._id, name, email, phone, city, state,
        barRegistrationNumber, specializations: specializations || [],
        experience: exp, experienceLevel: level,
        consultationFee: parseFloat(consultationFee) || 0,
        bio: bio || '',
        // New fields
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        photo: photo || '',
        address: address || '',
        barCouncilState: barCouncilState || '',
        yearOfEnrollment: yearOfEnrollment ? parseInt(yearOfEnrollment) : undefined,
        designation: designation || '',
        currentFirm: currentFirm || '',
        courts: courts || [],
        languages: languages || [],
        consultationModes: consultationModes || [],
        availableDays: availableDays || [],
        availableTimeFrom: availableTimeFrom || '',
        availableTimeTo: availableTimeTo || '',
        linkedinUrl: linkedinUrl || '',
        websiteUrl: websiteUrl || '',
      });
    }
    
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET, { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(40).toString('hex');
    user.refreshTokens.push(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);
    
    res.status(201).json({ 
      user: { id: user._id, name, email, role },
      message: 'Registration successful. Please verify your email.'
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    
    if (user.isBlocked) return res.status(403).json({ error: 'Your account has been blocked by an administrator.' });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: 'Account temporarily locked. Please try again later.' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }
      await user.save();
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET, { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(40).toString('hex');
    user.refreshTokens.push(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/refresh', async (req, res) => {
  try {
    await connectDB();
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET, { expiresIn: '15m' }
    );
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    
    user.refreshTokens.push(newRefreshToken);
    await user.save();
    
    setAuthCookies(res, newAccessToken, newRefreshToken);
    
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/logout', async (req, res) => {
  try {
    await connectDB();
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findOne({ refreshTokens: refreshToken });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        await user.save();
      }
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    
    res.json({ message: 'If that email is registered, a reset link has been sent.', resetToken });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Valid token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = [];
    
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/verify-email', [
  body('token').notEmpty().withMessage('Token is required'),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { token } = req.body;
    
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) { res.status(401).json({ error: 'Invalid token' }); }
});

app.use('/api/auth', router);
module.exports = app;
