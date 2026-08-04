const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  razorpaySubscriptionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true })

userSubscriptionSchema.index({ userId: 1 })
userSubscriptionSchema.index({ status: 1 })
userSubscriptionSchema.index({ userId: 1, status: 1 }) // Fast active-subscription lookups

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema)
