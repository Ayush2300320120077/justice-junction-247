const mongoose = require('mongoose');

let cachedDb = null;
let cachedPromise = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    }).then(db => {
      cachedDb = db;
      return db;
    });
  }
  
  try {
    await cachedPromise;
  } catch (error) {
    cachedPromise = null;
    throw error;
  }
  
  return cachedDb;
}

module.exports = connectDB;
