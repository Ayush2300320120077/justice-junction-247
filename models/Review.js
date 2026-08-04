const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true })

reviewSchema.index({ lawyerId: 1 })
reviewSchema.index({ clientId: 1 })
reviewSchema.index({ bookingId: 1 })

module.exports = mongoose.model('Review', reviewSchema)
