const mongoose = require('mongoose');

const SOSAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SOSAlert', SOSAlertSchema);
