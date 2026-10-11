import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldCheck, Zap, TrendingUp, Sparkles, MapPin } from 'lucide-react';

export function HeroBanner() {
  const { t, analytics, setShowAiAssistant, userCity, userDistrict, userCoords } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-slate-700/60 shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI + FULL-STACK WEB • MAHARASHTRA STATEWIDE LAUNCH</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">
              {userDistrict === 'all' 
                ? 'Maharashtra Statewide • 36 Districts • 6 Divisions (Expanding to India)'
                : `${userDistrict} Hub • Live Labor Chowks • ${userCoords.name || 'Local GPS Hub'}`}
            </span>
          </div>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-3">
            {t('tagline')}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-300/90 mb-4">
            {t('subtitle')}
          </p>
          <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl font-normal leading-relaxed">
            <span className="font-semibold text-white">{t('corePromise')}</span> — {t('humanInLoop')}
          </p>
        </div>

        {/* Live Impact Badges matching Slide 11 & 13 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4" />
              <span>Time-to-Hire</span>
            </div>
            <div className="text-2xl font-black text-white">8.4 mins</div>
            <div className="text-[11px] text-slate-400">vs 4.5 hrs at Chowk</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Trust</span>
            </div>
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-[11px] text-slate-400">Aadhaar + Skill checks</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Wages Disbursed</span>
            </div>
            <div className="text-2xl font-black text-white">
              ₹{analytics ? analytics.totalEarningsDisbursed.toLocaleString('en-IN') : '1,42,800'}
            </div>
            <div className="text-[11px] text-slate-400">Zero commission fee</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/50">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold mb-1">
              <Zap className="w-4 h-4" />
              <span>AI Match Engine</span>
            </div>
            <div className="text-2xl font-black text-white">94% Fit</div>
            <div className="text-[11px] text-slate-400">Multi-factor ranking</div>
          </div>
        </div>

      </div>
    </div>
  );
}
