const mongoose = require('mongoose');

const UnsafeAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UnsafeAreaSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('UnsafeArea', UnsafeAreaSchema);
