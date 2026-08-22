const mongoose = require('mongoose');

const TrustedContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The actual user account of the contact
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  relation: { type: String },
  status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
  isPrimary: { type: Boolean, default: false },
  priority: { type: Number, default: 2 }, // 1 is highest priority
  permissions: {
    emergencyAlerts: { type: Boolean, default: true },
    emergencyLocation: { type: Boolean, default: true },
    journeyAlerts: { type: Boolean, default: false },
    timerAlerts: { type: Boolean, default: false },
    safeZoneAlerts: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('TrustedContact', TrustedContactSchema);
