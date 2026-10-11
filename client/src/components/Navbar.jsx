import React from 'react';
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
  Bell,
  CheckCircle2
} from 'lucide-react';

export function Navbar() {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    soundEnabled, 
    setSoundEnabled,
    setShowAiAssistant,
    resetDemo,
    jobs,
    activeWorkerId,
    t
  } = useApp();

  // Pending jobs for current worker
  const pendingRequestsCount = jobs.filter(j => j.workerId === activeWorkerId && j.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRole('employer')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <span className="text-2xl font-black text-white tracking-tighter">K</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white flex items-center">
                  KaamSetu<span className="text-emerald-400 ml-1">AI</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                  कामसेतू
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                From labor chowk to smart hiring • AI + Full-Stack Web
              </p>
            </div>
          </div>

          {/* Mode / Role Switcher Tabs */}
          <div className="hidden md:flex items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setRole('employer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === 'employer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('roleEmployer')}</span>
            </button>

            <button
              onClick={() => setRole('worker')}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === 'worker'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{t('roleWorker')}</span>
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('roleAdmin')}</span>
            </button>
          </div>

          {/* Right Action Tools: AI Saathi, Language, Sound, Demo Reset */}
          <div className="flex items-center space-x-2.5">
            {/* Multilingual AI Saathi Floating Trigger */}
            <button
              onClick={() => setShowAiAssistant(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/25 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">कामसेतू साथी (AI Assist)</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-800 rounded-xl border border-slate-700 px-2 py-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-800 text-white">English</option>
                <option value="mr" className="bg-slate-800 text-white">मराठी</option>
                <option value="hi" className="bg-slate-800 text-white">हिंदी</option>
              </select>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Reset Demo */}
            <button
              onClick={resetDemo}
              title="Reset Demo Baseline"
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800">
          <button
            onClick={() => setRole('employer')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
              role === 'employer' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employer</span>
          </button>
          <button
            onClick={() => setRole('worker')}
            className={`relative flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
              role === 'worker' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Worker</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1 bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
              role === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
}
