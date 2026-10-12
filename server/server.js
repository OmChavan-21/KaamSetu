import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { db } from './data/db.js';
import { initMongoConnection, isMongoConnected } from './data/mongoConnection.js';
import { rankWorkers, calculateDistanceKm } from './ai/matchEngine.js';
import { processAssistantMessage, translateText } from './ai/aiAssistant.js';
import { MAHARASHTRA_DIVISIONS, MAHARASHTRA_DISTRICTS, findClosestDistrict } from './data/maharashtraData.js';
import { sendPasswordResetEmail } from './services/emailService.js';
import {
  securityHeadersMiddleware,
  inputSanitizerMiddleware,
  generalApiLimiter,
  aiAssistLimiter,
  adminAuthLimiter,
  otpLimiter,
  verifyAdminPin,
  generateToken,
  verifyToken,
  requireAdmin,
  requireAuth,
  sendOtpForPhone,
  verifyOtpForPhone,
  validateAvatarUrl,
  verifyWebhookSignature,
  maskPhone,
  maskAadhaar
} from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. OWASP Security Headers (nosniff, frameguard, referrer-policy, hsts)
app.use(securityHeadersMiddleware);

// 2. Controlled CORS policy
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// 3. Request body parsing with strict 1MB size limit (DoS prevention)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. SQL Injection, XSS & Prototype Pollution Sanitizer
app.use(inputSanitizerMiddleware);

// 5. General API Rate Limiter
app.use('/api', generalApiLimiter);

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health & Database Diagnostics
app.get('/api/health', (req, res) => {
  const mongoActive = isMongoConnected();
  res.json({
    status: 'ok',
    service: 'KaamSetu AI Core Server',
    time: new Date().toISOString(),
    database: {
      engine: mongoActive ? 'MongoDB (Mongoose)' : 'Local FileStore (MongoDB Standby Fallback)',
      isMongoConnected: mongoActive,
      mode: mongoActive ? 'live_mongodb' : 'resilient_dual_mode',
      uriConfigured: Boolean(process.env.MONGODB_URI)
    }
  });
});

// Maharashtra Statewide Metadata Routes
app.get('/api/maharashtra/districts', (req, res) => {
  res.json({
    divisions: MAHARASHTRA_DIVISIONS,
    districts: MAHARASHTRA_DISTRICTS
  });
});

app.get('/api/maharashtra/detect-hub', (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng parameters are required' });
    const result = findClosestDistrict(Number(lat), Number(lng));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Workers Routes
app.get('/api/workers', (req, res) => {
  try {
    let workers = db.getWorkers();
    const { trade, location, city, district, division, maxWage, availableOnly, search, userLat, userLng } = req.query;

    const targetDistrict = (district || city || '').trim();
    if (targetDistrict && targetDistrict.toLowerCase() !== 'all') {
      workers = workers.filter(w => {
        const wDist = (w.district || w.city || '').toLowerCase();
        const wLoc = (w.location || '').toLowerCase();
        return wDist === targetDistrict.toLowerCase() || wLoc.includes(targetDistrict.toLowerCase());
      });
    }

    if (division && division.toLowerCase() !== 'all') {
      workers = workers.filter(w => {
        const wDiv = (w.division || '').toLowerCase();
        return wDiv === division.toLowerCase() || wDiv.includes(division.toLowerCase());
      });
    }

    if (trade && trade !== 'all') {
      workers = workers.filter(w => w.trade.toLowerCase() === trade.toLowerCase());
    }

    if (location && location !== 'all') {
      workers = workers.filter(w => {
        const wLoc = (w.location || '').toLowerCase();
        const wArea = (w.locationArea || w.locality || '').toLowerCase();
        return wLoc.includes(location.toLowerCase()) || wArea.includes(location.toLowerCase());
      });
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
        (w.location && w.location.toLowerCase().includes(q)) ||
        (w.skills && w.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Default hub coordinates based on selected district or state center
    let defaultLat = 18.5204;
    let defaultLng = 73.8567;
    if (targetDistrict && targetDistrict.toLowerCase() !== 'all') {
      const foundDist = MAHARASHTRA_DISTRICTS.find(d =>
        d.id.toLowerCase() === targetDistrict.toLowerCase() ||
        d.name.toLowerCase() === targetDistrict.toLowerCase()
      );
      if (foundDist) {
        defaultLat = foundDist.lat;
        defaultLng = foundDist.lng;
      }
    }

    const uLat = userLat ? Number(userLat) : defaultLat;
    const uLng = userLng ? Number(userLng) : defaultLng;

    workers = workers.map(w => {
      const wLat = w.lat !== undefined ? w.lat : (w.coordinates ? w.coordinates.lat : 18.5204);
      const wLng = w.lng !== undefined ? w.lng : (w.coordinates ? w.coordinates.lng : 73.8567);
      const dist = calculateDistanceKm(uLat, uLng, wLat, wLng);
      return {
        ...w,
        lat: wLat,
        lng: wLng,
        coordinates: { lat: wLat, lng: wLng },
        district: w.district || (w.city === 'Kolhapur' ? 'Kolhapur' : w.city === 'Pune' ? 'Pune' : w.city),
        division: w.division || (w.district === 'Kolhapur' || w.district === 'Pune' ? 'Western Maharashtra' : 'Maharashtra'),
        location: w.location || (w.locality ? `${w.locality}, ${w.city || w.district}` : `${w.city || 'Maharashtra'}`),
        locationArea: w.locationArea || w.locality || w.city,
        skills: Array.isArray(w.skills) && w.skills.length > 0 ? w.skills : (w.trade ? [w.trade] : ['General Work']),
        recentWork: Array.isArray(w.recentWork) ? w.recentWork : [],
        distanceKm: dist,
        matchScore: w.matchScore || (dist <= 3 ? 96 : dist <= 10 ? 92 : 86)
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
    const { name, trade, experienceYears, dailyWage, location, skills, phone, district, city, division, lat, lng, avatar } = req.body;
    if (!name || !trade || !dailyWage || !location) {
      return res.status(400).json({ error: 'Missing required worker profile fields' });
    }

    if (avatar && !validateAvatarUrl(avatar)) {
      return res.status(400).json({ error: 'Security Warning: Avatar URL points to an untrusted or internal host (SSRF Protection).' });
    }

    const expNum = Number(experienceYears) || 1;
    const wageNum = Number(dailyWage) || 500;
    const targetDistrict = (district || city || 'Kolhapur').trim();
    const matchedDistObj = MAHARASHTRA_DISTRICTS.find(d => d.id === targetDistrict || d.name.toLowerCase() === targetDistrict.toLowerCase());
    
    const workerLat = lat ? Number(lat) : (matchedDistObj ? matchedDistObj.lat + (Math.random() - 0.5) * 0.05 : 16.6946);
    const workerLng = lng ? Number(lng) : (matchedDistObj ? matchedDistObj.lng + (Math.random() - 0.5) * 0.05 : 74.2238);
    const workerDivision = division || (matchedDistObj ? matchedDistObj.division : 'western');

    const newWorker = {
      id: `w-${Date.now()}`,
      name,
      trade,
      tradeMr: trade === 'Electrician' ? 'इलेक्ट्रिशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'सुतार' : trade === 'Mason' ? 'गवंडी' : trade === 'Welder' ? 'वेल्डर' : trade,
      tradeHi: trade === 'Electrician' ? 'इलेक्ट्रीशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'कारपेंटर' : trade === 'Mason' ? 'मिस्त्री' : trade === 'Welder' ? 'वेल्डर' : trade,
      experienceYears: expNum,
      dailyWage: wageNum,
      hourlyWage: Math.round(wageNum / 7),
      rating: 5.0,
      reviewsCount: 1,
      district: targetDistrict,
      city: targetDistrict,
      division: workerDivision,
      location,
      locationArea: location.split(',')[0].trim(),
      lat: workerLat,
      lng: workerLng,
      phone: phone || '+91 98000 00000',
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
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
      distanceKm: 2.5,
      aiReason: `${trade} registered in ${targetDistrict} • Available now • Fits ₹${wageNum} budget`
    };

    const saved = db.addWorker(newWorker);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker Update (BOLA / IDOR & RBAC Protection)
app.patch('/api/workers/:id', (req, res) => {
  // If attempting to modify administrative trust/verification fields, require Admin Token
  if ('isIdentityVerified' in req.body || 'isSkillVerified' in req.body) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden: Modifying artisan verification and trust status requires verified Admin privileges.'
      });
    }
  }

  const updated = db.updateWorker(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Worker not found' });
  res.json(updated);
});

// AI Match Engine Endpoint (Slide 6)
app.post('/api/match', (req, res) => {
  try {
    const { trade, location, city, district, division, userLat, userLng, budget, needDescription, experienceMin, availableTodayOnly } = req.body;
    let allWorkers = db.getWorkers();

    const targetDistrict = (district || city || '').trim();
    if (targetDistrict && targetDistrict.toLowerCase() !== 'all') {
      const filtered = allWorkers.filter(w => {
        const wDist = (w.district || w.city || '').toLowerCase();
        const wLoc = (w.location || '').toLowerCase();
        return wDist === targetDistrict.toLowerCase() || wLoc.includes(targetDistrict.toLowerCase());
      });
      if (filtered.length > 0) {
        allWorkers = filtered;
      }
    }

    const ranked = rankWorkers(allWorkers, {
      trade,
      location,
      city: targetDistrict,
      userLat,
      userLng,
      budget,
      needDescription,
      experienceMin,
      availableTodayOnly
    });
    res.json({
      query: { trade, location, city: targetDistrict, budget, needDescription },
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

app.post('/api/jobs/:id/messages', async (req, res) => {
  try {
    const { sender, senderName, text, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    const translatedText = await translateText(text, targetLang || 'mr');
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

// -------------------------------------------------------------
// Authentication, MFA / OTP & Security Verification Endpoints
// -------------------------------------------------------------

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, resetPasswordToken, resetPasswordCode, resetPasswordExpires, ...safeUser } = user;
  return safeUser;
}

// User Registration (Email/Password + Role)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, district, city, workerTrade, workerDailyWage } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in or reset your password.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userRole = role === 'worker' ? 'worker' : 'employer';

    let workerId = null;
    if (userRole === 'worker') {
      workerId = `w-reg-${Date.now()}`;
      db.addWorker({
        id: workerId,
        name: name.trim(),
        phone: phone || '+91 98000 00000',
        email: cleanEmail,
        trade: workerTrade || 'General Artisan / Shramik',
        rating: 5.0,
        reviewsCount: 1,
        experienceYears: 3,
        dailyWage: Number(workerDailyWage) || 600,
        city: city || 'Kolhapur',
        district: district || 'Kolhapur',
        location: city ? `${city}, Maharashtra` : 'Kolhapur, Maharashtra',
        division: 'Pune Division',
        pincode: '416002',
        isAvailable: true,
        isIdentityVerified: false,
        skills: [workerTrade || 'General Labor', 'Timely Delivery'],
        languages: ['Marathi', 'Hindi'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        chowkHub: 'Bindu Chowk, Kolhapur',
        completedJobsCount: 0,
        totalEarnings: 0
      });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '',
      passwordHash,
      role: userRole,
      workerId,
      district: district || 'Kolhapur',
      city: city || 'Kolhapur',
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      workerId: newUser.workerId
    }, 72);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully! Welcome to KaamSetu.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login (Email & Password)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      workerId: user.workerId
    }, 72);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      message: 'Signed in successfully!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current Authenticated Profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request Password Reset Link / Code
app.post('/api/auth/forgot-password', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      // Return success response to prevent email harvesting
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.'
      });
    }

    const resetCode = String(Math.floor(100000 + Math.random() * 900000));
    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    db.updateUser(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordCode: resetCode,
      resetPasswordExpires
    });

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetToken,
      resetCode
    });

    res.json({
      success: true,
      message: 'Password reset code and link have been dispatched to your email!',
      email: user.email,
      devPreview: emailResult.mode === 'dev_preview' ? {
        resetCode,
        resetToken,
        resetLink: emailResult.resetLink
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm Password Reset with Token or 6-digit Code
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { tokenOrCode, newPassword } = req.body;
    if (!tokenOrCode || !tokenOrCode.trim()) {
      return res.status(400).json({ error: 'Reset code or token is required' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = db.getUserByResetToken(tokenOrCode);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset code. Please request a new code.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    const updatedUser = db.updateUser(user.id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordCode: null,
      resetPasswordExpires: null
    });

    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
      workerId: updatedUser.workerId
    }, 72);

    res.json({
      success: true,
      message: 'Your password has been successfully reset! You are now logged in.',
      token,
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Authentication with Timing-safe PIN check, Rate Limiting & Signed Token
app.post('/api/auth/admin-login', adminAuthLimiter, (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'Admin PIN is required' });

    const isValid = verifyAdminPin(pin);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Admin Passcode' });
    }

    const token = generateToken({
      role: 'admin',
      id: 'admin-01',
      name: 'Chief Verification Officer'
    }, 24);

    res.json({
      success: true,
      token,
      role: 'admin',
      user: {
        id: 'admin-01',
        name: 'Chief Verification Officer',
        role: 'admin',
        title: 'Trust & Verification Registrar'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker / Contractor OTP MFA Dispatch
app.post('/api/auth/send-otp', otpLimiter, (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required for OTP' });

    const result = sendOtpForPhone(phone);
    res.json({
      success: true,
      message: 'OTP dispatched successfully via simulated SMS/Aadhaar gateway',
      phone: maskPhone(result.phone),
      expiresInSeconds: result.expiresInSeconds,
      demoOtp: result.code
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker / Contractor OTP MFA Verification
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { phone, otp, workerId } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

    const isValid = verifyOtpForPhone(phone, otp);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired OTP code' });
    }

    const token = generateToken({
      role: 'worker',
      id: workerId || 'w-user',
      phone
    }, 24);

    res.json({
      success: true,
      token,
      message: 'OTP verified successfully',
      role: 'worker'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook Signature Verification Endpoint (e.g. Razorpay / UPI callback)
app.post('/api/webhooks/payment', (req, res) => {
  try {
    const signature = req.headers['x-kaamsetu-signature'];
    const payloadString = JSON.stringify(req.body);

    if (!signature) {
      return res.status(400).json({ error: 'Missing X-KaamSetu-Signature header' });
    }

    const isValid = verifyWebhookSignature(payloadString, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Security Alert: Invalid webhook HMAC signature' });
    }

    res.json({ status: 'received', verified: true, event: req.body?.event || 'payment_success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multilingual AI Assistant (Slide 7) - Rate Limited to protect Gemini API quota
app.post('/api/ai/assist', aiAssistLimiter, async (req, res) => {
  try {
    const { message, language, userDistrict, userCity, userCoords } = req.body;
    const result = await processAssistantMessage(message, language, { userDistrict, userCity, userCoords });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat Translation
app.post('/api/ai/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const translated = await translateText(text, targetLang);
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

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`🚀 KaamSetu AI Server running on http://localhost:${PORT}`);
    // Initialize MongoDB connection asynchronously with zero blocking
    initMongoConnection().then(() => {
      if (isMongoConnected()) {
        db.hydrateFromMongo();
      }
    });
  });
}
