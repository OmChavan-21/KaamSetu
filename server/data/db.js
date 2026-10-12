import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initialWorkers, initialJobs } from './seedData.js';
import { isMongoConnected } from './mongoConnection.js';
import { Worker } from '../models/Worker.js';
import { Job } from '../models/Job.js';
import { Analytics } from '../models/Analytics.js';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'store.json') : path.join(__dirname, 'store.json');

// Default hashed demo password ('KaamSetu2026!')
const DEFAULT_DEMO_PW_HASH = bcrypt.hashSync('KaamSetu2026!', 10);

export const initialUsers = [
  {
    id: 'usr-emp-101',
    name: 'Aditya Deshmukh (Contractor)',
    email: 'aditya@kaamsetu.in',
    phone: '+91 98221 00011',
    passwordHash: DEFAULT_DEMO_PW_HASH,
    role: 'employer',
    district: 'Pune',
    city: 'Pune',
    isEmailVerified: true
  },
  {
    id: 'usr-wrk-101',
    name: 'Bandu Patil',
    email: 'bandu@kaamsetu.in',
    phone: '+91 98229 55432',
    passwordHash: DEFAULT_DEMO_PW_HASH,
    role: 'worker',
    workerId: 'w-k1',
    district: 'Kolhapur',
    city: 'Kolhapur',
    isEmailVerified: true
  },
  {
    id: 'usr-wrk-102',
    name: 'Ramesh Pawar',
    email: 'ramesh@kaamsetu.in',
    phone: '+91 97654 23891',
    passwordHash: DEFAULT_DEMO_PW_HASH,
    role: 'worker',
    workerId: 'w-2',
    district: 'Pune',
    city: 'Pune',
    isEmailVerified: true
  },
  {
    id: 'usr-adm-101',
    name: 'Chief Verification Officer',
    email: 'admin@kaamsetu.in',
    phone: '+91 98000 00000',
    passwordHash: DEFAULT_DEMO_PW_HASH,
    role: 'admin',
    district: 'Kolhapur',
    city: 'Kolhapur',
    isEmailVerified: true
  }
];

class Database {
  constructor() {
    this.data = {
      workers: [...initialWorkers],
      jobs: [...initialJobs],
      users: [...initialUsers],
      analytics: {
        totalGigsCompleted: 248,
        totalEarningsDisbursed: 142800,
        avgTimeToHireMinutes: 8.4,
        chowkWaitTimeHours: 4.5,
        repeatHiringRate: 78
      }
    };
    this.init();
  }

  init() {
    try {
      const sourceFile = fs.existsSync(DB_FILE) ? DB_FILE : path.join(__dirname, 'store.json');
      if (fs.existsSync(sourceFile)) {
        const fileContent = fs.readFileSync(sourceFile, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.users) {
          this.data.users = [...initialUsers];
          this.save();
        }
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('DB initialization notice (using memory seed):', err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      // In serverless / read-only filesystem environment, data safely remains in memory & MongoDB
    }
  }

  // Hydrate memory cache from MongoDB if connected
  async hydrateFromMongo() {
    if (!isMongoConnected()) return;
    try {
      const mongoWorkers = await Worker.find().lean();
      if (mongoWorkers && mongoWorkers.length > 0) {
        this.data.workers = mongoWorkers;
      }
      const mongoJobs = await Job.find().lean();
      if (mongoJobs && mongoJobs.length > 0) {
        this.data.jobs = mongoJobs;
      }
      let mongoUsers = await User.find().lean();
      if (!mongoUsers || mongoUsers.length === 0) {
        await User.insertMany(initialUsers);
        mongoUsers = await User.find().lean();
      } else {
        // Ensure standard demo users exist
        for (const initU of initialUsers) {
          if (!mongoUsers.some(u => u.email === initU.email)) {
            await User.create(initU);
            mongoUsers.push(initU);
          }
        }
      }
      this.data.users = mongoUsers;
      const mongoAnalytics = await Analytics.findOne({ key: 'platform_metrics' }).lean();
      if (mongoAnalytics) {
        this.data.analytics = {
          totalGigsCompleted: mongoAnalytics.totalGigsCompleted,
          totalEarningsDisbursed: mongoAnalytics.totalEarningsDisbursed,
          avgTimeToHireMinutes: mongoAnalytics.avgTimeToHireMinutes,
          chowkWaitTimeHours: mongoAnalytics.chowkWaitTimeHours,
          repeatHiringRate: mongoAnalytics.repeatHiringRate
        };
      }
      this.save();
      console.log(`🔄 Hydrated ${this.data.workers.length} workers, ${this.data.jobs.length} jobs & ${this.data.users.length} users from MongoDB into local memory.`);
    } catch (err) {
      console.error('Failed to hydrate from MongoDB:', err.message);
    }
  }

  reset() {
    this.data = {
      workers: JSON.parse(JSON.stringify(initialWorkers)),
      jobs: JSON.parse(JSON.stringify(initialJobs)),
      users: JSON.parse(JSON.stringify(initialUsers)),
      analytics: {
        totalGigsCompleted: 248,
        totalEarningsDisbursed: 142800,
        avgTimeToHireMinutes: 8.4,
        chowkWaitTimeHours: 4.5,
        repeatHiringRate: 78
      }
    };
    this.save();

    // Async sync with MongoDB if connected
    if (isMongoConnected()) {
      (async () => {
        try {
          await Worker.deleteMany({});
          await Worker.insertMany(initialWorkers);
          await Job.deleteMany({});
          await Job.insertMany(initialJobs);
          await User.deleteMany({});
          await User.insertMany(initialUsers);
          await Analytics.findOneAndUpdate(
            { key: 'platform_metrics' },
            { $set: this.data.analytics },
            { upsert: true }
          );
          console.log('🍃 MongoDB collections reset to seed data.');
        } catch (err) {
          console.error('Error resetting MongoDB:', err.message);
        }
      })();
    }

    return this.data;
  }

  // =================== USERS & AUTH ===================
  getUsers() {
    return this.data.users || [];
  }

  getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return (this.data.users || []).find(u => u.email.toLowerCase() === cleanEmail);
  }

  getUserById(id) {
    return (this.data.users || []).find(u => u.id === id);
  }

  getUserByResetToken(tokenOrCode) {
    if (!tokenOrCode) return null;
    const clean = String(tokenOrCode).trim();
    return (this.data.users || []).find(u => 
      (u.resetPasswordToken === clean || (u.resetPasswordCode && String(u.resetPasswordCode).trim() === clean)) && 
      u.resetPasswordExpires && 
      new Date(u.resetPasswordExpires) > new Date()
    );
  }

  addUser(user) {
    if (!this.data.users) this.data.users = [];
    this.data.users.unshift(user);
    this.save();

    if (isMongoConnected()) {
      User.create(user).catch(err => console.error('MongoDB user insert error:', err.message));
    }
    return user;
  }

  updateUser(id, updates) {
    if (!this.data.users) this.data.users = [];
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();

      if (isMongoConnected()) {
        User.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' })
          .catch(err => console.error('MongoDB user update error:', err.message));
      }
      return this.data.users[idx];
    }
    return null;
  }

  // =================== WORKERS ===================
  getWorkers() {
    return this.data.workers;
  }

  getWorkerById(id) {
    return this.data.workers.find(w => w.id === id);
  }

  addWorker(worker) {
    this.data.workers.unshift(worker);
    this.save();

    if (isMongoConnected()) {
      Worker.create(worker).catch(err => console.error('MongoDB worker insert error:', err.message));
    }

    return worker;
  }

  updateWorker(id, updates) {
    const idx = this.data.workers.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.data.workers[idx] = { ...this.data.workers[idx], ...updates };
      this.save();

      if (isMongoConnected()) {
        Worker.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' })
          .catch(err => console.error('MongoDB worker update error:', err.message));
      }

      return this.data.workers[idx];
    }
    return null;
  }

  // =================== JOBS ===================
  getJobs() {
    return this.data.jobs;
  }

  getJobById(id) {
    return this.data.jobs.find(j => j.id === id);
  }

  addJob(job) {
    if (!job.messages) job.messages = [];
    this.data.jobs.unshift(job);
    this.save();

    if (isMongoConnected()) {
      Job.create(job).catch(err => console.error('MongoDB job insert error:', err.message));
    }

    return job;
  }

  updateJob(id, updates) {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      this.data.jobs[idx] = { ...this.data.jobs[idx], ...updates };

      // Update analytics and worker stats if completed
      if (updates.status === 'completed' && !this.data.jobs[idx].analyticsCounted) {
        this.data.jobs[idx].analyticsCounted = true;
        this.data.analytics.totalGigsCompleted += 1;
        this.data.analytics.totalEarningsDisbursed += (this.data.jobs[idx].offeredWage || 600);

        // Update worker earnings, completed jobs and dynamically add to recentWork ledger
        const worker = this.getWorkerById(this.data.jobs[idx].workerId);
        if (worker) {
          worker.completedJobsCount = (worker.completedJobsCount || 0) + 1;
          worker.totalEarnings = (worker.totalEarnings || 0) + (this.data.jobs[idx].offeredWage || 600);
          
          if (updates.rating) {
            const currentTotal = worker.rating * worker.reviewsCount;
            worker.reviewsCount += 1;
            worker.rating = Number(((currentTotal + updates.rating) / worker.reviewsCount).toFixed(1));
          }

          if (!worker.recentWork) worker.recentWork = [];
          worker.recentWork.unshift({
            title: this.data.jobs[idx].title,
            location: this.data.jobs[idx].location,
            rating: updates.rating || 5.0,
            wage: this.data.jobs[idx].offeredWage || 600,
            date: 'Just now'
          });

          if (isMongoConnected()) {
            Worker.findOneAndUpdate(
              { id: worker.id },
              {
                $set: {
                  completedJobsCount: worker.completedJobsCount,
                  totalEarnings: worker.totalEarnings,
                  rating: worker.rating,
                  reviewsCount: worker.reviewsCount,
                  recentWork: worker.recentWork
                }
              }
            ).catch(err => console.error('MongoDB worker earnings sync error:', err.message));
          }
        }

        if (isMongoConnected()) {
          Analytics.findOneAndUpdate(
            { key: 'platform_metrics' },
            { $set: this.data.analytics },
            { upsert: true }
          ).catch(err => console.error('MongoDB analytics update error:', err.message));
        }
      }

      this.save();

      if (isMongoConnected()) {
        Job.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' })
          .catch(err => console.error('MongoDB job update error:', err.message));
      }

      return this.data.jobs[idx];
    }
    return null;
  }

  addJobMessage(jobId, message) {
    const job = this.getJobById(jobId);
    if (job) {
      if (!job.messages) job.messages = [];
      const msgObj = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...message,
        time: message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      job.messages.push(msgObj);
      this.save();

      if (isMongoConnected()) {
        Job.findOneAndUpdate(
          { id: jobId },
          { $push: { messages: msgObj } }
        ).catch(err => console.error('MongoDB message push error:', err.message));
      }

      return msgObj;
    }
    return null;
  }

  getJobMessages(jobId) {
    const job = this.getJobById(jobId);
    return job ? (job.messages || []) : [];
  }

  getAnalytics() {
    return this.data.analytics;
  }
}

export const db = new Database();
