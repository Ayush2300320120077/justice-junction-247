const mongoose = require('mongoose')

const lawyerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  barCouncilNumber: { type: String, required: true },
  specialization: { type: String, required: true },
  city: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.LawyerApplication || mongoose.model('LawyerApplication', lawyerApplicationSchema)
