const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  resolved: { type: Boolean, default: false },
  adminNote: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
