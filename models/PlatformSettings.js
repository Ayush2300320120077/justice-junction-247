const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  registrationsPaused: { type: Boolean, default: false },
  dangerZoneEnabled: { type: Boolean, default: false },
  supportEmail: { type: String, default: process.env.SUPPORT_EMAIL || '' },
  platformFeePercentage: { type: Number, default: 10 },
  aiProvider: { type: String, enum: ['mock', 'gemini', 'anthropic'], default: 'mock' },
  aiApiKey: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PlatformSettings || mongoose.model('PlatformSettings', PlatformSettingsSchema);
