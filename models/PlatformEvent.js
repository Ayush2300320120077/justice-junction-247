const mongoose = require('mongoose');

const PlatformEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'lawyer_registered', 'booking_created'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PlatformEvent || mongoose.model('PlatformEvent', PlatformEventSchema);
