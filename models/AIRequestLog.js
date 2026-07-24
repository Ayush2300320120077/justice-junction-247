const mongoose = require('mongoose');

const aiRequestLogSchema = new mongoose.Schema({
  identifier: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: { expires: 3600 } } // TTL index: documents expire after 1 hour (3600 seconds)
});

module.exports = mongoose.models.AIRequestLog || mongoose.model('AIRequestLog', aiRequestLogSchema);
