const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  type: { type: String, enum: ['booking', 'subscription'], required: true },
  referenceId: mongoose.Schema.Types.ObjectId
}, { timestamps: true })

paymentSchema.index({ userId: 1 })
paymentSchema.index({ razorpayOrderId: 1 })
paymentSchema.index({ status: 1 })

module.exports = mongoose.model('Payment', paymentSchema)
