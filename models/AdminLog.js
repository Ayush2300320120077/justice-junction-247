const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String, default: '' }
});

module.exports = mongoose.models.AdminLog || mongoose.model('AdminLog', adminLogSchema);
