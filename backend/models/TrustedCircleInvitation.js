const mongoose = require('mongoose');

const TrustedCircleInvitationSchema = new mongoose.Schema({
  inviter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteeEmail: { type: String, required: true },
  inviteePhone: { type: String },
  relation: { type: String },
  permissions: {
    emergencyAlerts: { type: Boolean, default: true },
    emergencyLocation: { type: Boolean, default: true },
    journeyAlerts: { type: Boolean, default: false },
    timerAlerts: { type: Boolean, default: false },
    safeZoneAlerts: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED'], default: 'PENDING' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TrustedCircleInvitation', TrustedCircleInvitationSchema);
