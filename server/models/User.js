import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['employer', 'worker', 'admin'], 
    default: 'employer',
    index: true 
  },
  workerId: { type: String, default: null }, // Linked worker ID if role is worker
  district: { type: String, default: 'Kolhapur' },
  city: { type: String, default: 'Kolhapur' },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordCode: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null }
}, {
  timestamps: true,
  strict: false
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash passwords
UserSchema.statics.hashPassword = async function(plaintextPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plaintextPassword, salt);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
