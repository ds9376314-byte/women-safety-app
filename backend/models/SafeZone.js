const mongoose = require('mongoose');

const SafeZoneSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  radiusMeters: { type: Number, default: 100 },
  icon: { type: String, default: 'MapPin' },
  enabled: { type: Boolean, default: true },
  notifyContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact' }],
  lastTriggeredAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('SafeZone', SafeZoneSchema);
