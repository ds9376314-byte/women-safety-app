const mongoose = require('mongoose');

const PolicyAcceptanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentName: { type: String, enum: ['PRIVACY_POLICY', 'TERMS_OF_SERVICE', 'COMMUNITY_GUIDELINES'], required: true },
  version: { type: String, required: true },
  acceptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate acceptance records for the same version
PolicyAcceptanceSchema.index({ user: 1, documentName: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('PolicyAcceptance', PolicyAcceptanceSchema);
