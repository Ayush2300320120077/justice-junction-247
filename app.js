'use strict';

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path          = require('path');
const cookieParser  = require('cookie-parser');

const app = express();

// ── Security headers via Helmet ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for inline scripts (Razorpay, Google Fonts)
        'https://checkout.razorpay.com',
        'https://fonts.googleapis.com'
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com'
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'https://api.razorpay.com',
        'https://lumberjack.razorpay.com'
      ],
      frameSrc: [
        "'self'",
        'https://api.razorpay.com',
        'https://*.jit.si' // Jitsi Meet for video consultations
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    }
  },
  crossOriginEmbedderPolicy: false, // Required for Razorpay iframe
}));

// ── CORS — strict allowlist only (handles all routes including sub-apps) ─────
const allowedOrigins = [
  'https://justice-junction-app.vercel.app',
  'https://jj-fixed.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`), false);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL injection via sanitizing $, . in fields

// ── Ensure req.url includes full path for Express router matching on Vercel ──
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && req.originalUrl && req.originalUrl.startsWith('/api')) {
    req.url = req.originalUrl;
  }
  next();
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use(require('./api/_routes/auth'));
app.use(require('./api/_routes/lawyers'));
app.use(require('./api/_routes/bookings'));
app.use(require('./api/_routes/payments'));
app.use(require('./api/_routes/admin'));
app.use(require('./api/_routes/ai'));
app.use(require('./api/_routes/cases'));
app.use(require('./api/_routes/subscriptions'));
app.use(require('./api/_routes/documents'));
app.use(require('./api/_routes/articles'));
app.use(require('./api/_routes/reviews'));
app.use(require('./api/_routes/contact'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    dbConnected: mongoose.connection.readyState
  });
});

// ── Catch-all 404 for unmatched API routes ────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ── Serve built frontend in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Don't expose internal error details in production
  const isDev = process.env.NODE_ENV !== 'production';
  console.error(`[${new Date().toISOString()}] Unhandled Error on ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    success: false,
    error: isDev ? err.message : 'An internal server error occurred'
  });
});

module.exports = app;
