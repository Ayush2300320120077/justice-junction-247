require('dotenv').config()

const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: ${envVar} is not defined.`);
    process.exit(1);
  }
}

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

app.use(helmet())

const allowedOrigins = [
  'https://justice-junction-app.vercel.app',
  'https://jj-fixed.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(mongoSanitize())

// Mount API sub-apps (each already has /api/xxx path set internally)
app.use(require('./api/_routes/auth'))
app.use(require('./api/_routes/lawyers'))
app.use(require('./api/_routes/bookings'))
app.use(require('./api/_routes/payments'))
app.use(require('./api/_routes/admin'))
app.use(require('./api/_routes/ai'))
app.use(require('./api/_routes/cases'))
app.use(require('./api/_routes/subscriptions'))
app.use(require('./api/_routes/documents'))
app.use(require('./api/_routes/articles'))
app.use(require('./api/_routes/reviews'))
app.use(require('./api/_routes/contact'))


// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    dbConnected: mongoose.connection.readyState
  });
})

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    }
  })
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Justice Junction API on port ${PORT}`))
