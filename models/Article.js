const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: String,
  category: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImageUrl: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  description: String,
  tags: [String]
}, { timestamps: true })

articleSchema.index({ slug: 1 }, { unique: true })
articleSchema.index({ isPublished: 1 })
articleSchema.index({ category: 1 })

module.exports = mongoose.model('Article', articleSchema)
