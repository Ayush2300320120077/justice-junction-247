const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    // Existing platform roles → client | lawyer | admin
    // Case Vault (SIH26190) roles → officer | legal-officer | court-clerk
    enum: ['client', 'lawyer', 'admin', 'officer', 'legal-officer', 'court-clerk'],
    default: 'client',
  },
  previousRole: { type: String, default: null },
  phone: { type: String },
  city: { type: String },
  state: { type: String },
  isBlocked: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  rejectionReason: { type: String, default: '' },
  isSeedData: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Auth hardening fields
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
  refreshTokens: [{ type: String }],
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
