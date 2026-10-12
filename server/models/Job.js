import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ['employer', 'worker', 'system'], default: 'employer' },
  senderName: { type: String, default: 'User' },
  text: { type: String, required: true },
  translatedText: { type: String },
  time: { type: String }
}, { _id: false });

const JobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employerName: { type: String, default: 'Contractor' },
  employerPhone: { type: String },
  workerId: { type: String, required: true, index: true },
  workerName: { type: String },
  trade: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  offeredWage: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'rejected'],
    default: 'pending',
    index: true
  },
  createdAt: { type: String },
  completedAt: { type: String },
  matchScore: { type: Number, default: 90 },
  rating: { type: Number, default: null },
  review: { type: String, default: null },
  analyticsCounted: { type: Boolean, default: false },
  messages: [MessageSchema]
}, {
  timestamps: true,
  strict: false
});

// Index for query performance on employer/worker jobs & statuses
JobSchema.index({ workerId: 1, status: 1 });
JobSchema.index({ createdAt: -1 });

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
