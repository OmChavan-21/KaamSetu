import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/EmployerModule/HeroBanner';
import { SearchFilterBar } from './components/EmployerModule/SearchFilterBar';
import { WorkerCard } from './components/EmployerModule/WorkerCard';
import { VirtualChowkMap } from './components/EmployerModule/VirtualChowkMap';
import { ActiveJobsManager } from './components/EmployerModule/ActiveJobsManager';
import { WorkerDetailModal } from './components/EmployerModule/WorkerDetailModal';
import { SendJobModal } from './components/EmployerModule/SendJobModal';
import { WorkerDashboard } from './components/WorkerModule/WorkerDashboard';
import { KaamSetuSaathi } from './components/AIAssistant/KaamSetuSaathi';
import { JobChatModal } from './components/Chat/JobChatModal';
import { AdminVerificationModal } from './components/TrustVerification/AdminVerificationModal';
import { ImpactDashboard } from './components/Analytics/ImpactDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { 
  Sparkles, 
  Briefcase, 
  HardHat, 
  ShieldCheck, 
  SlidersHorizontal,
  Bot,
  Lock,
  ArrowRight,
  ShieldAlert,
  Unlock,
  UserCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

function MainLayout() {
  const { 
    role, 
    authRole,
    currentUser,
    isAdminAuthenticated,
    loginAsAdmin,
    logout,
    loginAsEmployer,
    setIsAuthModalOpen,
    workers, 
    loading, 
    viewMode, 
    filters, 
    showAiAssistant, 
    setShowAiAssistant,
    toasts,
    t,
    language 
  } = useApp();

  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPinInput);
    if (success) {
      setAdminPinError('');
      setAdminPinInput('');
    } else {
      setAdminPinError('Invalid security PIN! Authorized staff PIN is "admin123"');
    }
  };

  const handleNavigateSection = (section) => {
    if (section === 'search') {
      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'map') {
      document.getElementById('radar-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'jobs') {
      document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'metrics') {
      document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // In-memory client filtering for instantaneous reactivity
  let displayedWorkers = [...workers];

  if (filters.trade && filters.trade !== 'all') {
    displayedWorkers = displayedWorkers.filter(w =>
      w.trade.toLowerCase() === filters.trade.toLowerCase()
    );
  }

  if (filters.location && filters.location !== 'all') {
    displayedWorkers = displayedWorkers.filter(w =>
      (w.locationArea && w.locationArea.toLowerCase().includes(filters.location.toLowerCase())) ||
      w.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.maxWage) {
    displayedWorkers = displayedWorkers.filter(w => w.dailyWage <= filters.maxWage);
  }

  if (filters.availableOnly) {
    displayedWorkers = displayedWorkers.filter(w => w.isAvailable);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    displayedWorkers = displayedWorkers.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.trade.toLowerCase().includes(q) ||
      (w.tradeMr && w.tradeMr.toLowerCase().includes(q)) ||
      (w.tradeHi && w.tradeHi.toLowerCase().includes(q)) ||
      w.location.toLowerCase().includes(q) ||
      w.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (filters.sortBy === 'rating') {
    displayedWorkers.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'wageLow') {
    displayedWorkers.sort((a, b) => a.dailyWage - b.dailyWage);
  } else if (filters.sortBy === 'distance') {
    displayedWorkers.sort((a, b) => (a.distanceKm || 5) - (b.distanceKm || 5));
  } else {
    // Default: AI Best Match
    displayedWorkers.sort((a, b) => (b.matchScore || 80) - (a.matchScore || 80));
  }

  const currentRole = authRole || role || 'employer';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar onNavigateSection={handleNavigateSection} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* 1. CUSTOMER / EMPLOYER PORTAL (Strictly for hiring)      */}
        {/* ======================================================== */}
        {currentRole === 'employer' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Banner */}
            <HeroBanner />

            {/* Search & Filter Bar */}
            <div id="search-section">
              <SearchFilterBar />
            </div>

            {/* View Switching: Radar Map vs Grid */}
            <div id="radar-section">
              {viewMode === 'map' ? (
                <VirtualChowkMap workers={displayedWorkers} />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-slate-900">
                        {t('navFindWorkers')}
                      </h3>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {displayedWorkers.length} {t('availableNowBadge')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
                      Ranked by AI Match Engine
                    </span>
                  </div>

                  {displayedWorkers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                        🔍
                      </div>
                      <h4 className="text-base font-bold text-slate-700">No workers match this filter</h4>
                      <p className="text-xs text-slate-400 mt-1">Try broadening your trade, wage or location radius.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedWorkers.map(worker => (
                        <WorkerCard key={worker.id} worker={worker} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real-time active gig management */}
            <div id="jobs-section">
              <ActiveJobsManager />
            </div>

            {/* Impact & Scalability Dashboard */}
            <div id="analytics-section">
              <ImpactDashboard />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. WORKER STATION (Strictly for artisans)                 */}
        {/* ======================================================== */}
        {currentRole === 'worker' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Artisan Station Status Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  👷
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {currentUser.name}
                    </h2>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Verified Artisan
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    {currentUser.title || 'Skilled Daily-Wage Artisan'} • Phone: {currentUser.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  Switch Artisan Identity
                </button>
                <button
                  onClick={loginAsEmployer}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Exit to Customer Portal</span>
                </button>
              </div>
            </div>

            {/* Dedicated Worker Station Dashboard */}
            <WorkerDashboard />

            {/* Active jobs manager from worker perspective */}
            <div id="jobs-section">
              <ActiveJobsManager />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TRUST ADMIN PORTAL (Protected Verification Staff Only) */}
        {/* ======================================================== */}
        {currentRole === 'admin' && (
          <div className="space-y-8 animate-fade-in">
            {isAdminAuthenticated ? (
              // Authenticated Admin View
              <>
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      🛡️
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                          Government Trust & Verification Center
                        </h2>
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Unlocked
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Chief Verification Officer Session Active • Audit Aadhaar, OTP Proofs & Skill Badges
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button
                      onClick={loginAsEmployer}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Back to Customer Portal</span>
                    </button>
                    <button
                      onClick={logout}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Portal</span>
                    </button>
                  </div>
                </div>

                {/* Verification Panel */}
                <AdminVerificationModal />

                {/* Ecosystem Analytics */}
                <div id="analytics-section">
                  <ImpactDashboard />
                </div>
              </>
            ) : (
              // Protected Lock Screen
              <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center animate-slide-up">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Restricted Staff Portal
                </h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  The Trust & Verification Center is restricted to authorized field staff. Enter the security passcode to audit credentials and issue certifications.
                </p>

                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Enter Admin PIN (Hint: admin123)"
                      value={adminPinInput}
                      onChange={(e) => {
                        setAdminPinInput(e.target.value);
                        setAdminPinError('');
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {adminPinError && (
                      <p className="text-xs text-red-600 font-semibold mt-2 flex items-center justify-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{adminPinError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>Unlock Verification Center</span>
                  </button>

                  <button
                    type="button"
                    onClick={loginAsEmployer}
                    className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    Cancel & Return to Customer Portal
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Summon AI Saathi Button (Available in Customer & Worker views) */}
      {currentRole !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowAiAssistant(true)}
            className="group flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-full shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="tracking-wide">AI साथी (Assist)</span>
          </button>
        </div>
      )}

      {/* Application Modals */}
      <AuthModal />
      <WorkerDetailModal />
      <SendJobModal />
      <JobChatModal />
      <KaamSetuSaathi />

      {/* Toast Notifications Stack */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border flex items-center space-x-2 transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'
                : toast.type === 'alert'
                ? 'bg-red-950 text-red-200 border-red-500/50 shadow-red-500/20'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Footer matching Slide 15 */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-xl font-black text-white">
            <span>KaamSetu<span className="text-emerald-400">AI</span></span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              कामसेतू
            </span>
          </div>
          <p className="text-emerald-300 text-sm font-semibold">
            Real skills. Real people. Real opportunities.
          </p>
          <p className="text-slate-400 text-xs max-w-xl mx-auto">
            From labor chowk to smart hiring • A trusted digital layer connecting daily-wage workers and employers with practical AI.
          </p>
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            AI + Full-Stack Web Development • Pune Pilot Cluster
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
