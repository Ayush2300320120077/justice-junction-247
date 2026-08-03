require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ 
  origin: '*', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure req.url includes full path for Express router matching on Vercel
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && req.originalUrl && req.originalUrl.startsWith('/api')) {
    req.url = req.originalUrl;
  }
  next();
});

// Health checks
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount sub-apps
app.use(require('./_routes/auth'));
app.use(require('./_routes/lawyers'));
app.use(require('./_routes/bookings'));
app.use(require('./_routes/payments'));
app.use(require('./_routes/admin'));
app.use(require('./_routes/ai'));
app.use(require('./_routes/cases'));
app.use(require('./_routes/subscriptions'));
app.use(require('./_routes/documents'));
app.use(require('./_routes/articles'));
app.use(require('./_routes/reviews'));
app.use(require('./_routes/contact'));


module.exports = app;
