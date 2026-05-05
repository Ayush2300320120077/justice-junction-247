const mongoose = require('mongoose');

const AdminAuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'DELETE_LAWYER', 'SUSPEND_CLIENT'
  targetId: { type: String },
  targetModel: { type: String }, // e.g., 'Lawyer', 'User'
  ipAddress: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AdminAuditLog || mongoose.model('AdminAuditLog', AdminAuditLogSchema);
