const mongoose = require('mongoose')

const caseOutcomeSchema = new mongoose.Schema({
  caseType:    { type: String, required: true, trim: true },
  outcome:     { type: String, enum: ['won', 'lost', 'settled'], required: true },
  durationDays:{ type: Number, required: true, min: 0 },
  dateClosed:  { type: Date,   required: true },
  lawyerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  createdAt:   { type: Date, default: Date.now }
})

module.exports = mongoose.models.CaseOutcome || mongoose.model('CaseOutcome', caseOutcomeSchema)
