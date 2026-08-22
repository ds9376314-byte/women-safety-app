const mongoose = require('mongoose');

const PrivacyRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['DATA_ACCESS', 'DATA_EXPORT', 'DATA_DELETION', 'PRIVACY_QUESTION'], required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'], default: 'PENDING' },
  details: { type: String },
  resolutionNotes: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('PrivacyRequest', PrivacyRequestSchema);
