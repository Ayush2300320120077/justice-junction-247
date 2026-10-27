const mongoose = require('mongoose');

const aiInteractionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query: { type: String, required: true },
  retrievedChunks: [
    {
      sourceId: String,
      score: Number,
      metadata: mongoose.Schema.Types.Mixed,
      text: String
    }
  ],
  response: { type: String, default: '' },
  module: { type: String, enum: ['chat', 'classify', 'match'], required: true },
  latencyMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  userFeedbackRating: { type: Number, min: 1, max: 5, default: null },
  reviewerRating: { type: Number, min: 1, max: 5, default: null },
  reviewerNotes: { type: String, default: '' },
  recommendedLawyerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' }],
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  // ── Temporal verification layer (optional) ──────────────────────────────────
  verificationStatus: { type: String, default: null },          // 'answered' | 'ask_dates' | 'abstained' | 'unverified' | 'not_applicable'
  resolvedRegime:     { type: mongoose.Schema.Types.Mixed, default: null }, // { PENAL, PROCEDURE, EVIDENCE } from resolver
  citationVerdicts:   { type: mongoose.Schema.Types.Mixed, default: null }  // array from trace.finalVerification
});


aiInteractionLogSchema.index({ userId: 1 });
aiInteractionLogSchema.index({ module: 1 });
aiInteractionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.models.AiInteractionLog || mongoose.model('AiInteractionLog', aiInteractionLogSchema);
