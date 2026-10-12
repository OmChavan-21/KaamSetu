import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  key: { type: String, default: 'platform_metrics', unique: true, index: true },
  totalGigsCompleted: { type: Number, default: 248 },
  totalEarningsDisbursed: { type: Number, default: 142800 },
  avgTimeToHireMinutes: { type: Number, default: 8.4 },
  chowkWaitTimeHours: { type: Number, default: 4.5 },
  repeatHiringRate: { type: Number, default: 78 }
}, {
  timestamps: true
});

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
