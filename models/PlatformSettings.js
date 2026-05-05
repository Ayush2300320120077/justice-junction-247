const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  registrationsPaused: { type: Boolean, default: false },
  dangerZoneEnabled: { type: Boolean, default: false },
  supportEmail: { type: String, default: 'support@justicejunction.in' },
  platformFeePercentage: { type: Number, default: 10 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PlatformSettings || mongoose.model('PlatformSettings', PlatformSettingsSchema);
