const mongoose = require('mongoose');

const generatedDocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate', required: true },
  filledData: { type: Map, of: mongoose.Schema.Types.Mixed },
  generatedFileUrl: String,
  title: String
}, { timestamps: true })

generatedDocumentSchema.index({ userId: 1 })

module.exports = mongoose.model('GeneratedDocument', generatedDocumentSchema)
