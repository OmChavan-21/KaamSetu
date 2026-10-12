import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  trade: { type: String, required: true, index: true },
  tradeMr: { type: String },
  tradeHi: { type: String },
  experienceYears: { type: Number, default: 1 },
  dailyWage: { type: Number, required: true, index: true },
  hourlyWage: { type: Number },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 1 },
  district: { type: String, default: 'Maharashtra', index: true },
  city: { type: String, default: 'Maharashtra', index: true },
  division: { type: String, default: 'western' },
  location: { type: String, default: 'Maharashtra' },
  locationArea: { type: String },
  lat: { type: Number, default: 18.5204 },
  lng: { type: Number, default: 73.8567 },
  phone: { type: String, default: '+91 98000 00000' },
  avatar: { type: String },
  isAvailable: { type: Boolean, default: true, index: true },
  availableToday: { type: Boolean, default: true },
  isIdentityVerified: { type: Boolean, default: true },
  isSkillVerified: { type: Boolean, default: true },
  idProofType: { type: String, default: 'Aadhaar Verified' },
  skills: [{ type: String }],
  skillsMr: [{ type: String }],
  skillsHi: [{ type: String }],
  bio: { type: String },
  bioMr: { type: String },
  bioHi: { type: String },
  locality: { type: String },
  recentWork: [{ type: mongoose.Schema.Types.Mixed }],
  completedJobsCount: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  matchScore: { type: Number, default: 88 },
  distanceKm: { type: Number, default: 2.5 },
  aiReason: { type: String }
}, {
  timestamps: true,
  strict: false
});

// Compound index for hyper-local worker search
WorkerSchema.index({ district: 1, trade: 1, isAvailable: 1 });
WorkerSchema.index({ lat: 1, lng: 1 });

export const Worker = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
