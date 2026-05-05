const mongoose = require('mongoose');

const PracticeAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PracticeArea || mongoose.model('PracticeArea', PracticeAreaSchema);
