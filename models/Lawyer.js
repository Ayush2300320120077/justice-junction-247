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
  consultationFee: { type: Number, required: true },
  bio: String,
  languages: [String],
  isVerified: { type: Boolean, default: false },
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
  createdAt: { type: Date, default: Date.now }
})

lawyerSchema.methods.updateRating = function() {
  if (!this.reviews.length) { this.averageRating = 0; return }
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0)
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10
  this.totalReviews = this.reviews.length
}

module.exports = mongoose.models.Lawyer || mongoose.model('Lawyer', lawyerSchema)
