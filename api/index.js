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
app.use(require('./auth'));
app.use(require('./lawyers'));
app.use(require('./bookings'));
app.use(require('./payments'));
app.use(require('./admin'));
app.use(require('./ai'));
app.use(require('./cases'));
app.use(require('./subscriptions'));
app.use(require('./documents'));
app.use(require('./articles'));
app.use(require('./reviews'));

module.exports = app;
