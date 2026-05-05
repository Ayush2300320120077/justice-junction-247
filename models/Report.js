const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  reporterEmail: { type: String, required: true },
  reportedEntity: { type: String, enum: ['lawyer', 'client', 'platform'], required: true },
  reportedId: { type: mongoose.Schema.Types.ObjectId }, // Can be null if reporting platform
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'investigating', 'resolved', 'dismissed'], default: 'pending' },
  adminResolution: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);
