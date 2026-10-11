import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Eye, 
  Sparkles, 
  Zap, 
  IndianRupee 
} from 'lucide-react';

export function WorkerCard({ worker }) {
  const { 
    setSelectedWorkerForJob, 
    setSelectedWorkerForProfile, 
    language, 
    t 
  } = useApp();

  const tradeName = language === 'mr' ? (worker.tradeMr || worker.trade) :
                    language === 'hi' ? (worker.tradeHi || worker.trade) :
                    worker.trade;

  return (
    <div className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Section: Avatar, Status & AI Match Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              {worker.avatar ? (
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {worker.name.charAt(0)}
                </div>
              )}
              {worker.isAvailable && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/40" />
              )}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                {worker.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {tradeName} • {worker.experienceYears} {t('yearsExp')}
              </p>
              
              {/* Rating & Verified badge */}
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center text-xs font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 mr-1" />
                  {worker.rating}
                </span>

                {worker.isIdentityVerified && (
                  <span className="inline-flex items-center text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                    <ShieldCheck className="w-3 h-3 mr-1 text-teal-600" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Match % Badge (Matches Slide 1 & 6) */}
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{worker.matchScore || 92}% {t('aiMatchScore')}</span>
            </div>
            {worker.distanceKm && (
              <span className="text-[11px] text-slate-400 font-medium mt-1">
                {worker.distanceKm} km {t('away')}
              </span>
            )}
          </div>
        </div>

        {/* Wage & Location tags (Matches Slide 1) */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-black text-sm border border-emerald-200">
            <span>₹{worker.dailyWage}{t('perDay')}</span>
          </div>

          <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>{worker.locationArea || worker.location}</span>
          </div>

          {worker.isAvailable ? (
            <div className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-100/70 text-emerald-700 font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
              {t('availableNowBadge')}
            </div>
          ) : (
            <div className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs">
              {t('offlineBadge')}
            </div>
          )}
        </div>

        {/* AI Recommendation Reason Snippet */}
        {worker.aiReason && (
          <div className="mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-medium flex items-start space-x-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{worker.aiReason}</span>
          </div>
        )}

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-lg"
            >
              • {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium">+{worker.skills.length - 3}</span>
          )}
        </div>
      </div>

      {/* Action Buttons: Send Job Request + View Profile */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => setSelectedWorkerForJob(worker)}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-md shadow-emerald-600/25 transition duration-150 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{t('sendRequest')}</span>
        </button>

        <button
          onClick={() => setSelectedWorkerForProfile(worker)}
          title="View full work history & verification"
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
