import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  HardHat, 
  ShieldCheck, 
  Globe, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw,
  User,
  ChevronDown,
  LogOut,
  Radio,
  Clock,
  Layers,
  Lock,
  MapPin
} from 'lucide-react';

export function Navbar({ onNavigateSection }) {
  const { 
    authRole, 
    currentUser, 
    setIsAuthModalOpen, 
    loginAsEmployer, 
    userCity,
    userDistrict,
    selectDistrict,
    selectCity,
    language, 
    setLanguage, 
    soundEnabled, 
    setSoundEnabled,
    setShowAiAssistant,
    resetDemo,
    jobs,
    activeWorkerId,
    viewMode,
    setViewMode,
    t
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Pending jobs for current worker
  const pendingRequestsCount = jobs.filter(j => j.workerId === activeWorkerId && j.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigateSection?.('search')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <span className="text-2xl font-black text-white tracking-tighter">K</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white flex items-center">
                  KaamSetu<span className="text-emerald-400 ml-1">AI</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {authRole === 'worker' ? 'कामगार स्टेशन' : authRole === 'admin' ? 'सुरक्षा केंद्र' : 'कामसेतू'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {authRole === 'worker' 
                  ? 'Artisan Portal • Manage Gigs & Build Digital Reputation' 
                  : authRole === 'admin'
                  ? 'Trust Layer • Government ID & Skill Verification Center'
                  : 'From labor chowk to smart hiring • AI + Full-Stack Web'}
              </p>
            </div>
          </div>

          {/* Role-Specific Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {authRole === 'employer' && (
              <div className="flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
                <button
                  onClick={() => { setViewMode('grid'); onNavigateSection?.('search'); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t('navFindWorkers')}</span>
                </button>

                <button
                  onClick={() => { setViewMode('map'); onNavigateSection?.('map'); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    viewMode === 'map' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                  <span>{t('navVirtualChowk')}</span>
                </button>

                <button
                  onClick={() => onNavigateSection?.('jobs')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700/60 transition flex items-center space-x-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('navActiveJobs')}</span>
                  {jobs.length > 0 && (
                    <span className="bg-slate-700 text-emerald-300 px-1.5 py-0.2 rounded-full text-[10px]">
                      {jobs.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigateSection?.('metrics')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700/60 transition flex items-center space-x-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('navAnalytics')}</span>
                </button>
              </div>
            )}

            {authRole === 'worker' && (
              <div className="flex items-center space-x-2 bg-emerald-950/60 px-4 py-2 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <HardHat className="w-4 h-4 text-emerald-400" />
                <span>Logged in as Verified Artisan: <strong>{currentUser.name}</strong></span>
                {pendingRequestsCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-bounce">
                    {pendingRequestsCount} New Gigs
                  </span>
                )}
              </div>
            )}

            {authRole === 'admin' && (
              <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-slate-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security Clearance: <strong className="text-white">Admin Level 1</strong></span>
              </div>
            )}
          </div>

          {/* Right Action Tools: AI Saathi, Language, Sound, Account Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Multilingual AI Saathi Floating Trigger (Customer mode) */}
            {authRole === 'employer' && (
              <button
                onClick={() => setShowAiAssistant(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/25 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>कामसेतू साथी (AI Assist)</span>
              </button>
            )}

            {/* Quick Maharashtra District Switcher Pill */}
            <button
              onClick={() => {
                const hubs = ['Kolhapur', 'Pune', 'Mumbai', 'Thane', 'Chhatrapati Sambhajinagar', 'Nagpur', 'Nashik', 'all'];
                const currentIndex = hubs.indexOf(userDistrict);
                const nextDistrict = hubs[(currentIndex + 1) % hubs.length];
                selectDistrict(nextDistrict);
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Click to cycle through Maharashtra districts"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {userDistrict === 'all' 
                  ? '🚩 MH State' 
                  : userDistrict === 'Chhatrapati Sambhajinagar'
                  ? 'संभाजीनगर'
                  : userDistrict}
              </span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-800 rounded-xl border border-slate-700 px-2 py-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-800 text-white">EN</option>
                <option value="mr" className="bg-slate-800 text-white">मराठी</option>
                <option value="hi" className="bg-slate-800 text-white">हिंदी</option>
              </select>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Authenticated User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl border transition cursor-pointer ${
                  authRole === 'worker'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                    : authRole === 'admin'
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  authRole === 'worker' ? 'bg-amber-500 text-slate-950' :
                  authRole === 'admin' ? 'bg-slate-700 text-emerald-400' :
                  'bg-emerald-500 text-slate-950'
                }`}>
                  {authRole === 'worker' ? '👷' : authRole === 'admin' ? '🛡️' : '👤'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {authRole === 'worker' ? 'Artisan' : authRole === 'admin' ? 'Admin' : 'Customer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl mb-2 border border-slate-700/60">
                    <div className="font-black text-white text-sm">{currentUser.name}</div>
                    <div className="text-emerald-400 font-semibold text-[11px] mt-0.5">{currentUser.title}</div>
                    <div className="text-slate-400 text-[10px] mt-1">{currentUser.phone}</div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Switch Account / Persona</span>
                    </button>

                    {authRole !== 'employer' && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          loginAsEmployer();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-emerald-300 hover:bg-emerald-950/60 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        <span>Go to Customer Portal (Hire)</span>
                      </button>
                    )}

                    {authRole !== 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Trust Admin Login (Staff)</span>
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        resetDemo();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 flex items-center space-x-2 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      <span>Reset Demo Baseline</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          {authRole === 'employer' ? (
            <>
              <button
                onClick={() => { setViewMode('grid'); onNavigateSection?.('search'); }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
              <button
                onClick={() => { setViewMode('map'); onNavigateSection?.('map'); }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold ${
                  viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Radar</span>
              </button>
              <button
                onClick={() => onNavigateSection?.('jobs')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold text-slate-400"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Hires ({jobs.length})</span>
              </button>
            </>
          ) : (
            <div className="text-center py-1 text-slate-300 font-bold">
              {authRole === 'worker' ? '👷 Skilled Worker Station' : '🛡️ Trust Admin Center'}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
