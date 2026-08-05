require('dotenv').config();

// Vercel serverless entrypoint — all middleware and routes come from the
// shared app module so production has identical behaviour to local dev.
module.exports = require('../app');
