# KaamSetu AI (कामसेतू AI)
> **Smart Gig Worker Hiring Platform: From labor chowk to smart hiring**  
> *Connecting skilled hands with real opportunities.*  
> **Domain**: Artificial Intelligence + Full-Stack Web Development  
> **Pune Pilot Cluster**: Swargate, Kothrud, Pimpri-Chinchwad, Hadapsar, Katraj, Baner, Wagholi, Bhosari MIDC

---

## 🎯 Core Promise
> **Right worker × right job × right location × right time**  
> *AI supports the decision; people remain in control of hiring.*

---

## 🚀 Live App Access
The full-stack application is currently running:
- **Unified Full-Stack App (Express + React build)**: [`http://localhost:5000`](http://localhost:5000)
- **Vite React Dev Server (with HMR)**: [`http://localhost:5173`](http://localhost:5173)
- **API Health Check**: [`http://localhost:5000/api/health`](http://localhost:5000/api/health)

---

## 🌟 Key Highlights & Implementation Grounded in Reference Deck

### 1. Multi-factor AI Matching Engine (Slide 6 & Slide 1)
- **Factors Computed**:
  1. **Trade & Sub-Skill Fit** (30 pts): Matches trade plus sub-skills (e.g. *Residential wiring*, *MCB fix*, *Pipe leakage*).
  2. **Proximity & Distance Score** (25 pts): Haversine distance from employer's coordinates across Pune localities.
  3. **Wage Budget Fit** (15 pts): Comparison of worker's daily wage with employer's budget.
  4. **Availability Fit** (15 pts): Priority for *Available Now* and *Available Today*.
  5. **Reputation & Verification** (15 pts): 5-star ratings + verified badge multipliers.
- **Explainable Match Reason**: Transparent reasoning shown directly on worker cards (e.g., *"94% Match: Sanjay More — Exact trade match for residential wiring, 6 yrs experience, 2.1 km away, fits ₹650 budget"*).

### 2. Virtual Chowk Radar (Slide 1, 2, 3 & 4)
- Digitizes the physical labor chowk (Swargate, Alka Talkies, Pimpri Chowk) into an interactive real-time radar map.
- Real Pune coordinates for artisans (Kothrud, Swargate, Pimpri, Hadapsar, Katraj, Baner, Wagholi, Bhosari).
- Concentric radar waves, pulse halos for active workers, distance calculation, and 1-click hire from the map.

### 3. Multilingual AI Assistant: "कामसेतू साथी" (KaamSetu Saathi) (Slide 7 & 12)
- Conversational natural language support in **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
- **Voice Speech Recognition**: Microphone input via Web Speech API.
- **Text-to-Speech Playback**: Speaks back in Marathi, Hindi, and English.
- **Entity Extraction**: Automatically parses trade, location, budget, and urgency from sentences like *"मला कोथरूड मध्ये उद्यासाठी 600 रुपयांपर्यंत इलेक्ट्रिशियन हवा आहे"*.

### 4. Trust Layer & Verification System (Slide 9)
- **Identity / OTP Checks**: Aadhaar card & phone OTP badge.
- **Skill Checks**: Government ITI Electrician Certificate, Skill India Apprentice credentials.
- **Verified Work History**: Permanent digital ledger with past gig earnings and client reviews (e.g. *Residential wiring ₹650 ★ 5.0*, *Home wiring ₹550 ★ 4.8*).
- **Trust Admin Portal**: Review and verify worker credentials.

### 5. Two-Sided Platform Workflows (Slide 8)
- **Employer Module**:
  - Filter by trade, locality, budget, and live availability.
  - Dispatch job request with instant notifications.
  - Active gig lifecycle manager: *Requested* → *Accepted* → *Working* → *Completed*.
  - Star rating & review submission with wage disbursement animation.
  - One-click *Simulate Worker Acceptance* for smooth demos.
- **Worker Module (Worker Station & Smart Artisan ID)**:
  - Personal Digital Artisan Card with photo, trade, and QR code.
  - Tactile **Available Now / Online** toggle switch.
  - Earnings tracker (Total Wages Earned, Completed Gigs).
  - Incoming job inbox with *Accept* and *Decline* actions.
  - Ongoing gig actions (*I Have Arrived* / *Complete & Collect Wage*).

### 6. Real-Time Chat with Instant Auto-Translation (Slide 7 & 12)
- Direct messaging between employer and worker.
- Live bi-directional auto-translation toggle (**English ↔ Marathi ↔ Hindi**) to eliminate language barriers.

### 7. Impact & Scalability Dashboard (Slide 11, 13 & 14)
- **Chowk vs KaamSetu Comparison Matrix**: 4.5 hour wait time reduced to 8.4 minutes.
- **Pilot KPIs**: Total wages disbursed (₹1,42,800+), 248 completed gigs, 78% repeat hiring rate.
- **Roadmap Tracker**: Phase 1 (MVP) → Phase 2 (Pilot) → Phase 3 (Growth) → Phase 4 (Scale).

---

## 🛠️ Technology Stack (Slide 10)
- **Frontend**: React.js, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js
- **Database**: Persistent JSON database store with automatic fallback seed
- **Matching Engine**: Multi-factor AI Match Algorithm
- **AI / Multilingual**: Web Speech API (STT & TTS), Trilingual NLP parser (EN / MR / HI)
- **Audio Feedback**: Synthesized Web Audio API tones (success chimes, request alert bells, coin sounds)

---

## 📁 Project Structure
```
KaamSetu/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistant/
│   │   │   │   └── KaamSetuSaathi.jsx       # Voice & multilingual chat assistant
│   │   │   ├── Analytics/
│   │   │   │   └── ImpactDashboard.jsx       # Slide 11, 13 & 14 impact metrics
│   │   │   ├── Chat/
│   │   │   │   └── JobChatModal.jsx          # Live chat with auto-translation
│   │   │   ├── EmployerModule/
│   │   │   │   ├── ActiveJobsManager.jsx     # Gig lifecycle tracker
│   │   │   │   ├── HeroBanner.jsx            # Slide 1 & 4 hero banner
│   │   │   │   ├── SearchFilterBar.jsx       # Trade chips & filters
│   │   │   │   ├── SendJobModal.jsx          # Job dispatch form
│   │   │   │   ├── VirtualChowkMap.jsx       # Interactive Pune radar map
│   │   │   │   ├── WorkerCard.jsx            # Worker profile card
│   │   │   │   └── WorkerDetailModal.jsx     # Slide 9 trust profile & history
│   │   │   ├── TrustVerification/
│   │   │   │   └── AdminVerificationModal.jsx # Admin verification center
│   │   │   ├── WorkerModule/
│   │   │   │   └── WorkerDashboard.jsx       # Smart ID card & worker station
│   │   │   └── Navbar.jsx                    # Header with role switcher & i18n
│   │   ├── context/
│   │   │   └── AppContext.jsx                # Global state, sounds & API hooks
│   │   ├── i18n/
│   │   │   └── translations.js               # Trilingual translations (EN, MR, HI)
│   │   ├── utils/
│   │   │   └── sound.js                      # Web Audio sound synthesizer
│   │   ├── App.jsx                           # Main layout
│   │   └── index.css                         # Tailwind v4 setup & animations
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── ai/
│   │   ├── aiAssistant.js                    # Trilingual NLP entity parser
│   │   └── matchEngine.js                    # Multi-factor algorithmic ranking
│   ├── data/
│   │   ├── db.js                             # Persistent DB wrapper
│   │   ├── seedData.js                       # Slide-grounded workers and jobs
│   │   └── store.json                        # Live data store
│   ├── package.json
│   └── server.js                             # Express server & API routes
├── package.json                              # Root orchestration package.json
└── README.md
```

---

## 🏃 Running the Application
```bash
# In client terminal:
cd client && npm run dev

# In server terminal:
cd server && npm run dev

# Or unified access:
node server/server.js
# Visit http://localhost:5000 or http://localhost:5173
```
