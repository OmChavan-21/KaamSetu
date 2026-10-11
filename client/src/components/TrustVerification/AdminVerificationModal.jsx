import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Award, 
  FileCheck, 
  AlertTriangle, 
  Star,
  Users 
} from 'lucide-react';

export function AdminVerificationModal() {
  const { workers, verifyWorker, t } = useApp();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Trust Layer: Verification & Safety Center
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Slide 9 Architecture: Identity / OTP checks, Skill accreditation & Admin audits for reliable gig workforce.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{workers.length} Registered Artisans across Maharashtra</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider">
              <th className="py-3 px-4">Artisan</th>
              <th className="py-3 px-4">Trade & Exp</th>
              <th className="py-3 px-4">District & Chowk</th>
              <th className="py-3 px-4">Identity / OTP Proof</th>
              <th className="py-3 px-4">Skill Assessment</th>
              <th className="py-3 px-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workers.map(worker => (
              <tr key={worker.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2.5">
                  <img src={worker.avatar} alt={worker.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200" />
                  <div>
                    <div>{worker.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">★ {worker.rating} ({worker.reviewsCount} reviews)</div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  {worker.trade} <span className="text-slate-400">({worker.experienceYears} yrs)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  <span className="font-bold text-slate-800">{worker.district || worker.city}:</span> {worker.locationArea || worker.location}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl font-bold ${
                    worker.isIdentityVerified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{worker.idProofType || 'Aadhaar Card'}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl font-bold ${
                    worker.isSkillVerified
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Award className="w-3.5 h-3.5" />
                    <span>{worker.isSkillVerified ? 'Verified Skill' : 'Pending Test'}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => verifyWorker(worker.id, 'isSkillVerified')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      worker.isSkillVerified
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {worker.isSkillVerified ? 'Revoke Skill' : 'Verify Skill'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
