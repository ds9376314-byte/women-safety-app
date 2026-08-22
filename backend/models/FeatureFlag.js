const mongoose = require('mongoose');

const FeatureFlagSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isEnabled: { type: Boolean, default: false },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

module.exports = mongoose.model('FeatureFlag', FeatureFlagSchema);
