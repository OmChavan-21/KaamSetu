import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, IndianRupee, MapPin, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export function SendJobModal() {
  const { 
    selectedWorkerForJob, 
    setSelectedWorkerForJob, 
    sendJobRequest, 
    language, 
    t 
  } = useApp();

  const worker = selectedWorkerForJob;

  const [title, setTitle] = useState('');
  const [wage, setWage] = useState(600);
  const [location, setLocation] = useState('Pune');
  const [description, setDescription] = useState('Need experienced worker on site tomorrow at 9:00 AM. Tools required.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (worker) {
      setWage(worker.dailyWage || 600);
      setLocation(worker.locationArea ? `${worker.locationArea}, Pune` : worker.location || 'Kothrud, Pune');
      setTitle(
        worker.trade === 'Electrician' ? 'Residential flat electrical wiring & MCB check' :
        worker.trade === 'Plumber' ? 'Bathroom pipe leakage and tap replacement' :
        worker.trade === 'Painter' ? 'Living room interior wall putty & paint' :
        worker.trade === 'Carpenter' ? 'Kitchen modular cabinet & door repair' :
        `${worker.trade} maintenance and fitting`
      );
    }
  }, [worker?.id]);

  if (!worker) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await sendJobRequest({
      employerName: 'Aditya Deshmukh (Contractor)',
      employerPhone: '+91 98221 00011',
      workerId: worker.id,
      workerName: worker.name,
      trade: worker.trade,
      title,
      description,
      location,
      offeredWage: Number(wage),
      matchScore: worker.matchScore || 92
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setSelectedWorkerForJob(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400"
            />
            <div>
              <h3 className="text-xl font-black">{t('sendJobTitle')}</h3>
              <p className="text-xs text-slate-300">
                To: <span className="font-bold text-emerald-400">{worker.name}</span> ({worker.trade})
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('jobTitleLabel')}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('offeredWageLabel')}
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('locationLabel')}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('instructionsLabel')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Info */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center space-x-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Worker will receive a notification and can accept or negotiate instantly.</span>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedWorkerForJob(null)}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Dispatching...' : t('sendJobBtn')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
