import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialWorkers, initialJobs } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'store.json');

class Database {
  constructor() {
    this.data = {
      workers: [...initialWorkers],
      jobs: [...initialJobs],
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
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.workers || !this.data.workers.some(w => w.id === 'w-k1')) {
          this.reset();
        }
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing db from file, using initial memory seed:', err);
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db file:', err);
    }
  }

  reset() {
    this.data = {
      workers: JSON.parse(JSON.stringify(initialWorkers)),
      jobs: JSON.parse(JSON.stringify(initialJobs)),
      analytics: {
        totalGigsCompleted: 248,
        totalEarningsDisbursed: 142800,
        avgTimeToHireMinutes: 8.4,
        chowkWaitTimeHours: 4.5,
        repeatHiringRate: 78
      }
    };
    this.save();
    return this.data;
  }

  getWorkers() {
    return this.data.workers;
  }

  getWorkerById(id) {
    return this.data.workers.find(w => w.id === id);
  }

  addWorker(worker) {
    this.data.workers.unshift(worker);
    this.save();
    return worker;
  }

  updateWorker(id, updates) {
    const idx = this.data.workers.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.data.workers[idx] = { ...this.data.workers[idx], ...updates };
      this.save();
      return this.data.workers[idx];
    }
    return null;
  }

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
        }
      }

      this.save();
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
