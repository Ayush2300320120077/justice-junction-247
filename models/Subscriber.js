import mongoose from 'mongoose'

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: 'knowledge-hub' },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
})

export default mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema)
