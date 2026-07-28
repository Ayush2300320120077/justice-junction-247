const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  fieldName: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'number', 'date', 'select', 'checkbox'], default: 'text' },
  required: { type: Boolean, default: false },
  options: [String]
}, { _id: false })

const documentTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  fields: [fieldSchema],
  templateBody: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('DocumentTemplate', documentTemplateSchema)
