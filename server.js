require('dotenv').config();

const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: ${envVar} is not defined.`);
    process.exit(1);
  }
}

const app       = require('./app');
const connectDB = require('./middleware/db');

// ── Start server with eager DB connection ────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✓ Justice Junction API on port ${PORT} (${process.env.NODE_ENV || 'development'})`)
    );
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
