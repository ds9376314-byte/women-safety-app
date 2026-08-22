const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
  emergencySession: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencySession', required: true },
  senderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trustedContact: { type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact', required: true },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  retryCount: { type: Number, default: 0 },
  sentAt: { type: Date },
  failedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);
