const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  courtName: { type: String, trim: true },
  caseNumber: { type: String, trim: true },
  nextHearingDate: { type: Date },
  notes: { type: String },
  status: { type: String, enum: ['active', 'closed', 'pending'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

caseSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.models.Case || mongoose.model('Case', caseSchema)
