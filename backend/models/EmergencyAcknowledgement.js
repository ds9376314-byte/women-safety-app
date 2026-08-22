const mongoose = require('mongoose');

const EmergencyAcknowledgementSchema = new mongoose.Schema({
  emergencySession: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencySession', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user in emergency
  contactUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The trusted contact who acknowledged
  trustedContactRef: { type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'ACKNOWLEDGED' }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyAcknowledgement', EmergencyAcknowledgementSchema);
