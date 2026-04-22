const mongoose = require('mongoose');

const caseUpdateSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caseNumber: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  stage: {
    type: String,
    enum: ['consultation', 'filing', 'hearing', 'judgment', 'appeal', 'closed'],
    default: 'consultation'
  },
  status: { type: String, enum: ['done', 'active', 'pending'], default: 'active' },
  nextHearing: { type: Date },
  documents: [{ name: String, url: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CaseUpdate ||
  mongoose.model('CaseUpdate', caseUpdateSchema);
