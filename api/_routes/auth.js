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
const { sendEmail } = require('../../utils/mailer');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

// ── No manual CORS headers here — handled globally in server.js ──

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window (was 5 — too aggressive for login UX)
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

// Prevent refreshTokens array growing unboundedly — keep max 5
const MAX_REFRESH_TOKENS = 5;

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
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

    // Cap tokens array — keep only the most recent MAX_REFRESH_TOKENS
    user.refreshTokens = [...user.refreshTokens.slice(-(MAX_REFRESH_TOKENS - 1)), refreshToken];
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    // ── Send email-verification email (non-blocking) ─────────────────────────────────
    // Registration succeeds regardless of email delivery outcome.
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
    sendEmail({
      to: email,
      subject: 'Verify your Justice Junction email address',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#7B1D2E;color:#fff;padding:24px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;">Verify Your Email</h2>
          </div>
          <div style="padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
            <p>Hi ${name},</p>
            <p>Welcome to <strong>Justice Junction 24/7</strong>! Please verify your email address by clicking the button below.</p>
            <p style="text-align:center;margin:32px 0;">
              <a href="${verifyUrl}" style="background:#7B1D2E;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break:break-all;color:#7B1D2E;">${verifyUrl}</p>
            <p style="color:#888;font-size:12px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    }).catch(mailErr => console.error('[register] Verification email error (non-blocking):', mailErr.message));

    res.status(201).json({
      user: { id: user._id, name, email, role },
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
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

    // Cap tokens array
    user.refreshTokens = [...user.refreshTokens.slice(-(MAX_REFRESH_TOKENS - 1)), refreshToken];
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
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
    
    // Rotate: remove used token
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET, { expiresIn: '15m' }
    );
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    
    // Cap tokens array
    user.refreshTokens = [...user.refreshTokens.slice(-(MAX_REFRESH_TOKENS - 1)), newRefreshToken];
    await user.save();
    
    setAuthCookies(res, newAccessToken, newRefreshToken);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(500).json({ error: 'Token refresh failed.' });
  }
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
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ error: 'Logout failed.' });
  }
});

// BUG 2 FIX: resetToken is NEVER returned in the response — only sent via email
router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return the same response to prevent user enumeration
    const safeMsg = 'If that email is registered, a password reset link has been sent.';
    if (!user) {
      return res.json({ message: safeMsg });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // ── Send password-reset email (non-blocking) ──────────────────────────────
    // The token travels only via the registered email address — never in the
    // HTTP response (which is intentionally generic to prevent user enumeration).
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    sendEmail({
      to: user.email,
      subject: 'Reset your Justice Junction password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#7B1D2E;color:#fff;padding:24px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;">Password Reset Request</h2>
          </div>
          <div style="padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;">
            <p>We received a request to reset the password for your Justice Junction account.</p>
            <p>Click the button below to set a new password. <strong>This link expires in 15 minutes.</strong></p>
            <p style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="background:#7B1D2E;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset My Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break:break-all;color:#7B1D2E;">${resetUrl}</p>
            <p style="color:#888;font-size:12px;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
          </div>
        </div>
      `,
    }).catch(mailErr => console.error('[forgot-password] Reset email error (non-blocking):', mailErr.message));

    res.json({ message: safeMsg });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Request failed. Please try again.' });
  }
});

router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Valid token is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
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
    user.refreshTokens = []; // Invalidate all sessions on password reset
    
    await user.save();
    
    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Password reset failed. Please try again.' });
  }
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
  } catch (err) {
    console.error('Email verification error:', err.message);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id).select('-password -refreshTokens -resetPasswordToken -emailVerificationToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const app = express();
app.use('/api/auth', router);
module.exports = app;
