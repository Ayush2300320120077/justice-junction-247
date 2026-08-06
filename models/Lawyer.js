const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
})

const lawyerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  photo: { type: String, default: '' },
  barRegistrationNumber: { type: String, required: true, unique: true },
  specializations: [String],
  experience: { type: Number, required: true },
  experienceLevel: { type: String, enum: ['junior','mid','senior'], default: 'junior' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  courts: [String],
  consultationFee: { type: Number, required: true },
  bio: String,
  languages: [String],
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalCases: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  // Subscription
  subscription: { type: String, enum: ['free','basic','pro','elite'], default: 'free' },
  subscriptionExpiry: Date,
  subscriptionFeatures: {
    name: String,
    featured: { type: Boolean, default: false },
    priority: { type: Boolean, default: false },
    maxBookings: { type: Number, default: 5 }
  },
  // Personal Information (new)
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male','Female','Other','Prefer not to say'] },
  address: { type: String },
  // Professional Information (new)
  barCouncilState: { type: String },
  yearOfEnrollment: { type: Number },
  designation: { type: String },
  currentFirm: { type: String },
  // Consultation & Availability (new)
  consultationModes: [String],
  availableDays: [String],
  availableTimeFrom: { type: String },
  availableTimeTo: { type: String },
  // Online Presence (new)
  linkedinUrl: { type: String },
  websiteUrl: { type: String },
  // Seed data flag — allows safe identification/removal of demo data without touching real profiles
  isSeedData: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

lawyerSchema.methods.updateRating = function() {
  if (!this.reviews.length) { this.averageRating = 0; return }
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0)
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10
  this.totalReviews = this.reviews.length
}

// ── Search / sort indexes ──────────────────────────────────────────────────────────────
//
// Fields are derived from the actual query/sort shape in GET /api/lawyers
// (api/_routes/lawyers.js lines 31-54).  Every search executes with
// { isBlocked: {$ne:true}, verificationStatus: {$ne:'rejected'} } as base
// filters and defaults to averageRating:-1 as the sort key, so this
// compound index is hit on virtually every request.
//
// Compound: covers the most-queried path (filtered list sorted by rating)
lawyerSchema.index({ isBlocked: 1, verificationStatus: 1, averageRating: -1 });

// city / state — regex queries on these fields benefit from an index prefix
lawyerSchema.index({ city: 1 });
lawyerSchema.index({ state: 1 });

// specializations — queried with $in; a multikey index lets Mongo index each element
lawyerSchema.index({ specializations: 1 });

// Sort-only fields (when the caller overrides the default sort)
lawyerSchema.index({ consultationFee: 1 }); // sort: price_low / price_high
lawyerSchema.index({ experience: -1 });      // sort: experience
lawyerSchema.index({ createdAt: -1 });       // sort: newest

module.exports = mongoose.models.Lawyer || mongoose.model('Lawyer', lawyerSchema)
