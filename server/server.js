import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './data/db.js';
import { rankWorkers, calculateDistanceKm } from './ai/matchEngine.js';
import { processAssistantMessage, translateText } from './ai/aiAssistant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'KaamSetu AI Core Server', time: new Date().toISOString() });
});

// Workers Routes
app.get('/api/workers', (req, res) => {
  try {
    let workers = db.getWorkers();
    const { trade, location, city, maxWage, availableOnly, search, userLat, userLng } = req.query;

    if (city && city !== 'all') {
      workers = workers.filter(w =>
        (w.city && w.city.toLowerCase() === city.toLowerCase()) ||
        w.location.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (trade && trade !== 'all') {
      workers = workers.filter(w => w.trade.toLowerCase() === trade.toLowerCase());
    }

    if (location && location !== 'all') {
      workers = workers.filter(w =>
        w.location.toLowerCase().includes(location.toLowerCase()) ||
        (w.locationArea && w.locationArea.toLowerCase().includes(location.toLowerCase()))
      );
    }

    if (maxWage) {
      const wageNum = Number(maxWage);
      workers = workers.filter(w => w.dailyWage <= wageNum);
    }

    if (availableOnly === 'true') {
      workers = workers.filter(w => w.isAvailable);
    }

    if (search) {
      const q = search.toLowerCase();
      workers = workers.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        (w.tradeMr && w.tradeMr.toLowerCase().includes(q)) ||
        (w.tradeHi && w.tradeHi.toLowerCase().includes(q)) ||
        w.location.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Dynamic distance calculation based on detected GPS or city center
    const uLat = userLat ? Number(userLat) : (city === 'Kolhapur' ? 16.6946 : 18.5204);
    const uLng = userLng ? Number(userLng) : (city === 'Kolhapur' ? 74.2238 : 73.8567);

    workers = workers.map(w => {
      const dist = calculateDistanceKm(uLat, uLng, w.lat, w.lng);
      return {
        ...w,
        distanceKm: dist,
        matchScore: w.matchScore || (w.id === 'w-1' || w.id === 'w-k1' ? 95 : 88)
      };
    });

    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/workers/:id', (req, res) => {
  const worker = db.getWorkerById(req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  res.json(worker);
});

app.post('/api/workers', (req, res) => {
  try {
    const { name, trade, experienceYears, dailyWage, location, skills, phone } = req.body;
    if (!name || !trade || !dailyWage || !location) {
      return res.status(400).json({ error: 'Missing required worker profile fields' });
    }

    const expNum = Number(experienceYears) || 1;
    const wageNum = Number(dailyWage) || 500;
    const newWorker = {
      id: `w-${Date.now()}`,
      name,
      trade,
      tradeMr: trade === 'Electrician' ? 'इलेक्ट्रिशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'सुतार' : trade,
      tradeHi: trade === 'Electrician' ? 'इलेक्ट्रीशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'कारपेंटर' : trade,
      experienceYears: expNum,
      dailyWage: wageNum,
      hourlyWage: Math.round(wageNum / 7),
      rating: 5.0,
      reviewsCount: 1,
      location,
      locationArea: location.split(',')[0].trim(),
      lat: 18.5204 + (Math.random() - 0.5) * 0.08,
      lng: 73.8567 + (Math.random() - 0.5) * 0.08,
      phone: phone || '+91 98000 00000',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      isAvailable: true,
      availableToday: true,
      isIdentityVerified: true,
      isSkillVerified: true,
      idProofType: "Aadhaar Verified",
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [trade]),
      bio: `${expNum} years of dedicated experience in ${trade}. Reliable and verified.`,
      recentWork: [],
      completedJobsCount: 0,
      totalEarnings: 0,
      matchScore: 88,
      distanceKm: 3.5,
      aiReason: `${trade} registered • Available now • Fits ₹${wageNum} budget`
    };

    const saved = db.addWorker(newWorker);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/workers/:id', (req, res) => {
  const updated = db.updateWorker(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Worker not found' });
  res.json(updated);
});

// AI Match Engine Endpoint (Slide 6)
app.post('/api/match', (req, res) => {
  try {
    const { trade, location, city, userLat, userLng, budget, needDescription, experienceMin, availableTodayOnly } = req.body;
    const allWorkers = db.getWorkers();
    const ranked = rankWorkers(allWorkers, {
      trade,
      location,
      city,
      userLat,
      userLng,
      budget,
      needDescription,
      experienceMin,
      availableTodayOnly
    });
    res.json({
      query: { trade, location, city, budget, needDescription },
      totalCandidates: allWorkers.length,
      recommendations: ranked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jobs Routes
app.get('/api/jobs', (req, res) => {
  try {
    let jobs = db.getJobs();
    const { workerId, status } = req.query;
    if (workerId) {
      jobs = jobs.filter(j => j.workerId === workerId);
    }
    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs', (req, res) => {
  try {
    const { employerName, employerPhone, workerId, workerName, trade, title, description, location, offeredWage, matchScore } = req.body;
    if (!workerId || !title || !offeredWage) {
      return res.status(400).json({ error: 'Missing required job parameters' });
    }

    const worker = db.getWorkerById(workerId);

    const newJob = {
      id: `job-${Date.now()}`,
      employerName: employerName || 'Aditya Deshmukh (Contractor)',
      employerPhone: employerPhone || '+91 98220 99887',
      workerId,
      workerName: workerName || (worker ? worker.name : 'Assigned Worker'),
      trade: trade || (worker ? worker.trade : 'General Worker'),
      title,
      description: description || 'Immediate assistance required.',
      location: location || (worker ? worker.location : 'Pune'),
      offeredWage: Number(offeredWage),
      status: 'pending', // pending -> accepted -> in_progress -> completed -> rejected
      createdAt: new Date().toISOString(),
      matchScore: matchScore || (worker ? worker.matchScore : 90),
      rating: null,
      review: null,
      messages: []
    };

    const saved = db.addJob(newJob);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/jobs/:id', (req, res) => {
  try {
    const updated = db.updateJob(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Job not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat Messages Routes for a Job
app.get('/api/jobs/:id/messages', (req, res) => {
  try {
    const messages = db.getJobMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/messages', (req, res) => {
  try {
    const { sender, senderName, text, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    const translatedText = translateText(text, targetLang || 'mr');
    const savedMsg = db.addJobMessage(req.params.id, {
      sender: sender || 'employer',
      senderName: senderName || 'User',
      text,
      translatedText
    });

    if (!savedMsg) return res.status(404).json({ error: 'Job not found' });
    res.status(201).json(savedMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multilingual AI Assistant (Slide 7)
app.post('/api/ai/assist', async (req, res) => {
  try {
    const { message, language } = req.body;
    const result = await processAssistantMessage(message, language);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat Translation
app.post('/api/ai/translate', (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const translated = translateText(text, targetLang);
    res.json({ original: text, targetLang, translated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics (Slide 11 & 13)
app.get('/api/analytics', (req, res) => {
  try {
    const stats = db.getAnalytics();
    const workers = db.getWorkers();
    const verifiedWorkers = workers.filter(w => w.isIdentityVerified).length;
    res.json({
      ...stats,
      activeWorkersCount: workers.length,
      verifiedWorkersPercentage: Math.round((verifiedWorkers / workers.length) * 100),
      availableNowCount: workers.filter(w => w.isAvailable).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset demo state
app.post('/api/reset', (req, res) => {
  const resetData = db.reset();
  res.json({ message: 'Database reset to default seed state', data: resetData });
});

// Serve static frontend in production / unified mode
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 KaamSetu AI Server running on http://localhost:${PORT}`);
});
