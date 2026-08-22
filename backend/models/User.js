const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.authProvider === 'local'; } },
  googleId: { type: String },
  authProvider: { type: String, default: 'local' },
  phone: { type: String },
  dob: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  medicalNotes: { type: String },
  profilePhoto: { type: String },
  emergencyMessage: { type: String, default: "I am in danger and need immediate help. Please track my location." },
  duressPin: { type: String },
  pushNotifications: { type: Boolean, default: true },
  emailAlerts: { type: Boolean, default: false },
  shareLocation: { type: Boolean, default: true },
  resetPasswordOtp: { type: String },
  resetPasswordExpire: { type: Date },
  isVerified: { type: Boolean, default: false },
  emailVerificationOtp: { type: String },
  emailVerificationExpire: { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
