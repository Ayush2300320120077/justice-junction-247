const mongoose = require('mongoose');

const chatQuerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query: String,
  classifiedCategory: String,
  response: String,
  recommendedLawyerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' }],
  sessionId: String
}, { timestamps: true })

chatQuerySchema.index({ userId: 1 })
chatQuerySchema.index({ createdAt: -1 })

module.exports = mongoose.model('ChatQuery', chatQuerySchema)
