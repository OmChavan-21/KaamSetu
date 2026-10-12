import mongoose from 'mongoose';
import { Worker } from '../models/Worker.js';
import { Job } from '../models/Job.js';
import { Analytics } from '../models/Analytics.js';
import { initialWorkers, initialJobs } from './seedData.js';

let isConnected = false;

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function seedMongoIfEmpty() {
  try {
    if (!isMongoConnected()) return;

    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      console.log(`🍃 Seeding MongoDB with ${initialWorkers.length} workers...`);
      const preparedWorkers = initialWorkers.map(w => {
        const wLat = w.lat !== undefined ? w.lat : (w.coordinates ? w.coordinates.lat : 18.5204);
        const wLng = w.lng !== undefined ? w.lng : (w.coordinates ? w.coordinates.lng : 73.8567);
        const loc = w.location || (w.locality ? `${w.locality}, ${w.city || 'Maharashtra'}` : (w.city || 'Maharashtra'));
        return {
          ...w,
          location: loc,
          lat: wLat,
          lng: wLng,
          district: w.district || (w.city === 'Kolhapur' ? 'Kolhapur' : w.city === 'Pune' ? 'Pune' : w.city || 'Maharashtra'),
          division: w.division || 'western'
        };
      });
      await Worker.insertMany(preparedWorkers);
      console.log(`✅ Successfully seeded workers to MongoDB.`);
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log(`🍃 Seeding MongoDB with ${initialJobs.length} jobs...`);
      await Job.insertMany(initialJobs);
      console.log(`✅ Successfully seeded jobs to MongoDB.`);
    }

    const analyticsDoc = await Analytics.findOne({ key: 'platform_metrics' });
    if (!analyticsDoc) {
      console.log(`🍃 Seeding default platform metrics to MongoDB...`);
      await Analytics.create({
        key: 'platform_metrics',
        totalGigsCompleted: 248,
        totalEarningsDisbursed: 142800,
        avgTimeToHireMinutes: 8.4,
        chowkWaitTimeHours: 4.5,
        repeatHiringRate: 78
      });
      console.log(`✅ Successfully seeded platform analytics to MongoDB.`);
    }
  } catch (err) {
    console.error('⚠️ Error during MongoDB seeding:', err.message);
  }
}

export async function initMongoConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kaamsetu';

  try {
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connected', async () => {
      isConnected = true;
      console.log(`🍃 Connected to MongoDB successfully (${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')})`);
      await seedMongoIfEmpty();
    });

    mongoose.connection.on('error', (err) => {
      isConnected = false;
      console.log(`⚠️ MongoDB Connection Notice: ${err.message}`);
      console.log(`📁 KaamSetu is operating safely in resilient Dual-Mode Local Store fallback.`);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.log(`⚠️ MongoDB disconnected. Active requests served via resilient Local Store.`);
    });

    // Connect to MongoDB Atlas or local daemon
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    });
    isConnected = true;
  } catch (err) {
    isConnected = false;
    console.log(`ℹ️ MongoDB not available locally (${err.message.split('\n')[0]}).`);
    console.log(`🛡️ Dual-Mode active: KaamSetu running on persistent JSON store (zero downtime). Ready for MongoDB Atlas URI!`);
  }
}
