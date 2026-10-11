import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BarChart3, 
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';

export function ImpactDashboard() {
  const { analytics, language, t } = useApp();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('metricsTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Slide 11 & 13: Measure the outcome in time, opportunity and trust across Pune pilot cluster.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Pilot Metrics: Real Impact</span>
        </div>
      </div>

      {/* Side-by-side comparison matrix: Labor Chowk vs KaamSetu AI (Slide 2 & 3 vs Slide 4 & 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-red-50/50 rounded-2xl border border-red-200/80">
          <span className="text-xs font-black uppercase tracking-wider text-red-800 flex items-center">
            ⚠️ Traditional Physical Labor Chowk
          </span>
          <ul className="mt-3 space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>4+ hours waiting time:</strong> Workers stand in heat/rain with uncertain employment.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>No verification:</strong> Skills and experience are difficult to validate consistently.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>No digital history:</strong> Work is forgotten; wages often disputed without records.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Limited reach:</strong> A worker misses jobs only 2 kilometers away.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-300">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center">
            ✅ KaamSetu AI Digital Solution
          </span>
          <ul className="mt-3 space-y-2 text-xs text-slate-800 font-medium">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>8.4 mins time-to-hire:</strong> Direct matching from home or ongoing work.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>100% Aadhaar & Skill verified:</strong> Trust layer with trade badges.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Permanent work history:</strong> Cumulative ratings build lifelong reputation.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Multilingual voice assistant:</strong> Instant Marathi, Hindi & English translation.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Time-to-Hire</span>
          </div>
          <div className="text-2xl font-black text-slate-900">8.4 mins</div>
          <div className="text-[11px] text-emerald-600 font-bold">96% faster than Chowk</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Wages Disbursed</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{analytics ? analytics.totalEarningsDisbursed.toLocaleString('en-IN') : '1,42,800'}
          </div>
          <div className="text-[11px] text-slate-500">Direct to daily-wage workers</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed Hires</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {analytics ? analytics.totalGigsCompleted : 248}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">100% verified execution</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Repeat Hiring</span>
          </div>
          <div className="text-2xl font-black text-slate-900">78%</div>
          <div className="text-[11px] text-slate-500">Contractors re-hire same artisan</div>
        </div>
      </div>

      {/* Roadmap Progress (Slide 14) */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
          Roadmap Phases (Slide 14)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
            <div className="font-black text-emerald-800">PHASE 1: MVP</div>
            <div className="text-[11px] text-emerald-700 mt-1">Core profiles, search & requests, basic AI matching (Completed)</div>
          </div>

          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow">
            <div className="font-black">PHASE 2: PILOT (ACTIVE)</div>
            <div className="text-[11px] text-emerald-100 mt-1">Pune cluster verification, multilingual support, ratings</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
            <div className="font-black text-slate-800">PHASE 3: GROWTH</div>
            <div className="text-[11px] text-slate-500 mt-1">More trades, contractor partnerships, improved ranking</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
            <div className="font-black text-slate-800">PHASE 4: SCALE</div>
            <div className="text-[11px] text-slate-500 mt-1">City expansion (Mumbai, Nashik, Nagpur), advanced AI</div>
          </div>
        </div>
      </div>

    </div>
  );
}
