const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String }, // removed `required: true`
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

// Set password method
userSchema.methods.setPassword = async function(password) {
  if (!password) throw new Error('Password is required');
  this.passwordHash = await bcrypt.hash(password, 10);
};

// Verify password method
userSchema.methods.verifyPassword = async function(password) {
  if (!password || !this.passwordHash) return false; // safe check
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
