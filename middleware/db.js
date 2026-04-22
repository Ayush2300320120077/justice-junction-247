const mongoose = require('mongoose');

let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  cachedDb = db;
  return db;
}

module.exports = connectDB;
