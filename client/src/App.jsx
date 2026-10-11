import React from 'react';
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
import { 
  Sparkles, 
  Briefcase, 
  HardHat, 
  ShieldCheck, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';

function MainLayout() {
  const { 
    role, 
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

  // Apply in-memory client filtering for instantaneous reactivity
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* EMPLOYER MODE */}
        {role === 'employer' && (
          <div className="space-y-6">
            <HeroBanner />
            <SearchFilterBar />

            {/* View Switching: Radar Map vs Grid */}
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
                  <span className="text-xs text-slate-500 font-semibold">
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

            {/* Real-time active gig management */}
            <ActiveJobsManager />

            {/* Impact & Scalability Dashboard */}
            <ImpactDashboard />
          </div>
        )}

        {/* WORKER MODE */}
        {role === 'worker' && (
          <div className="space-y-8">
            <WorkerDashboard />
            <ActiveJobsManager />
            <ImpactDashboard />
          </div>
        )}

        {/* ADMIN MODE */}
        {role === 'admin' && (
          <div className="space-y-8">
            <AdminVerificationModal />
            <ImpactDashboard />
          </div>
        )}

      </main>

      {/* Floating Summon AI Saathi Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAiAssistant(true)}
          className="group flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-full shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="tracking-wide">AI साथी (Assist)</span>
        </button>
      </div>

      {/* Modals */}
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
