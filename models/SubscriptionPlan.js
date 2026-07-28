const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  features: [String],
  maxBookingsPerMonth: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema)
