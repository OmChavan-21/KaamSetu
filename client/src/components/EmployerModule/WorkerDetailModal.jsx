import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Award, 
  Phone, 
  Send, 
  FileCheck, 
  Briefcase 
} from 'lucide-react';

export function WorkerDetailModal() {
  const { 
    selectedWorkerForProfile, 
    setSelectedWorkerForProfile, 
    setSelectedWorkerForJob, 
    language, 
    t 
  } = useApp();

  if (!selectedWorkerForProfile) return null;
  const worker = selectedWorkerForProfile;

  const tradeName = language === 'mr' ? (worker.tradeMr || worker.trade) :
                    language === 'hi' ? (worker.tradeHi || worker.trade) :
                    worker.trade;

  const bioText = language === 'mr' ? (worker.bioMr || worker.bio) :
                  language === 'hi' ? (worker.bioHi || worker.bio) :
                  worker.bio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white rounded-t-3xl">
          <button
            onClick={() => setSelectedWorkerForProfile(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black">{worker.name}</h2>
                {worker.isIdentityVerified && (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-emerald-300 font-semibold text-sm">
                {tradeName} • {worker.experienceYears} {t('yearsExp')} experience
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-flex items-center text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-slate-950 mr-1" />
                  {worker.rating} ({worker.reviewsCount} {t('reviews')})
                </span>
                <span className="text-xs text-slate-300 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  {worker.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Trust Layer Verification Box (Matches Slide 9) */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-2 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Trust Layer: Verification & Safety
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-100 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Identity / OTP: {worker.idProofType}</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-100 font-medium">
                <Award className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Trade Skill: {worker.isSkillVerified ? 'Verified by Trade Guild' : 'Under Assessment'}</span>
              </div>
            </div>
          </div>

          {/* Bio & Skills */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 mb-2">About Worker</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {bioText}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {(worker.skills || [worker.trade]).map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job History (Matches Slide 9: Job History & Recent Work) */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-1 text-slate-500" />
              Verified Job History & Ratings
            </h4>
            
            <div className="space-y-2.5">
              {worker.recentWork && worker.recentWork.length > 0 ? (
                worker.recentWork.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5 text-slate-400" />{item.location}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-right">
                      <div className="text-sm font-black text-emerald-700">₹{item.wage}</div>
                      <div className="flex items-center text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No previous jobs recorded yet.</p>
              )}
            </div>
          </div>

          {/* Wage details */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
            <div>
              <span className="text-xs text-slate-400">Daily Wage Expectation</span>
              <div className="text-2xl font-black text-emerald-400">₹{worker.dailyWage} <span className="text-xs text-slate-300 font-normal">/ day (8 hrs)</span></div>
            </div>
            <button
              onClick={() => {
                setSelectedWorkerForProfile(null);
                setSelectedWorkerForJob(worker);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Hire Now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
