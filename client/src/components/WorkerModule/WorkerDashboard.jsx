import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  QrCode, 
  Star, 
  IndianRupee, 
  MapPin, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Briefcase, 
  PlayCircle, 
  MessageSquare, 
  Award, 
  Sparkles, 
  Radio, 
  UserPlus,
  X 
} from 'lucide-react';

export function WorkerDashboard() {
  const { 
    workers, 
    activeWorkerId, 
    setActiveWorkerId, 
    activeWorkerUser, 
    toggleWorkerAvailability, 
    jobs, 
    updateJobStatus, 
    setActiveChatJob, 
    registerWorker,
    language, 
    t 
  } = useApp();

  const worker = activeWorkerUser;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    trade: 'Electrician',
    experienceYears: 3,
    dailyWage: 600,
    location: 'Kothrud, Pune',
    skills: 'Wiring, MCB, Appliance repair',
    phone: '+91 98555 44332'
  });
  const [registering, setRegistering] = useState(false);

  if (!worker) return null;

  // Filter jobs relevant to this worker
  const workerJobs = jobs.filter(j => j.workerId === worker.id);
  const pendingRequests = workerJobs.filter(j => j.status === 'pending');
  const activeGig = workerJobs.find(j => j.status === 'accepted' || j.status === 'in_progress');
  const completedGigs = workerJobs.filter(j => j.status === 'completed');

  const tradeName = language === 'mr' ? (worker.tradeMr || worker.trade) :
                    language === 'hi' ? (worker.tradeHi || worker.trade) :
                    worker.trade;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    await registerWorker({
      ...regForm,
      experienceYears: Number(regForm.experienceYears),
      dailyWage: Number(regForm.dailyWage)
    });
    setRegistering(false);
    setShowRegisterModal(false);
    setRegForm({
      name: '',
      trade: 'Electrician',
      experienceYears: 3,
      dailyWage: 600,
      location: 'Kothrud, Pune',
      skills: 'Wiring, MCB, Appliance repair',
      phone: '+91 98555 44332'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Identity Switcher Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
            👷
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Simulated Worker Identity:</h3>
            <p className="text-xs text-slate-400">Select which artisan persona you are experiencing:</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {workers.slice(0, 5).map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWorkerId(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeWorkerId === w.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{w.name}</span>
              <span className="text-[10px] text-emerald-300 opacity-80">({w.trade})</span>
            </button>
          ))}

          {/* Register New Artisan Button (Slide 5 & 8) */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register New</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Digital Smart Artisan Card (Slide 8 & 9) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Card Background holographic badge */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <QrCode className="w-36 h-36" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                KAAMSETU SMART ARTISAN ID
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                PUNE-{worker.id.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-5">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-18 h-18 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-lg"
              />
              <div>
                <h2 className="text-xl font-black text-white">{worker.name}</h2>
                <p className="text-xs font-semibold text-emerald-300">
                  {tradeName} • {worker.experienceYears} {t('yearsExp')}
                </p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-xs font-black text-amber-400 flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    {worker.rating}
                  </span>
                  <span className="text-xs text-slate-400">• {worker.completedJobsCount} gigs</span>
                </div>
              </div>
            </div>

            {/* Verification Proofs */}
            <div className="space-y-2 mb-6 text-xs bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Identity / OTP Check:</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Aadhaar Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Skill Accreditation:</span>
                <span className="text-teal-400 font-bold flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1" /> {worker.isSkillVerified ? 'ITI Trade Certified' : 'Peer Verified'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Base Wage:</span>
                <span className="text-white font-black">₹{worker.dailyWage} / day</span>
              </div>
            </div>

            {/* Online / Available Now Big Switch */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white">Chowk Broadcast Status</div>
                  <div className="text-[11px] text-slate-400">
                    {worker.isAvailable ? t('onlineForWork') : t('offlineForWork')}
                  </div>
                </div>
                <button
                  onClick={() => toggleWorkerAvailability(worker.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-md cursor-pointer ${
                    worker.isAvailable
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {worker.isAvailable ? 'ONLINE' : 'GO ONLINE'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500">{t('totalEarningsLabel')}</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{worker.totalEarnings ? worker.totalEarnings.toLocaleString('en-IN') : '54,600'}
              </div>
              <span className="text-[10px] text-slate-400">Direct to bank/UPI</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500">{t('completedGigsLabel')}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {worker.completedJobsCount || 84}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">100% on-time</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Incoming Requests & Active Work Lifecycle */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incoming Job Requests */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <span>{t('incomingRequests')}</span>
                {pendingRequests.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce">
                    {pendingRequests.length} New
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-400">Direct dispatch from employers</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                <Radio className="w-8 h-8 mx-auto mb-2 text-emerald-500 animate-pulse" />
                <p className="font-semibold">{t('noPendingRequests')}</p>
                <p className="text-slate-400 mt-1">Switch to "Employer Mode" to send a new job request to {worker.name}!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(job => (
                  <div key={job.id} className="p-5 bg-gradient-to-r from-amber-50/70 to-emerald-50/40 rounded-2xl border border-amber-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="font-black text-base text-slate-900">{job.title}</h4>
                      <span className="text-lg font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                        ₹{job.offeredWage}/day
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2">
                      Employer: <span className="font-bold text-slate-800">{job.employerName}</span> ({job.employerPhone})
                    </p>

                    <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 mb-3">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-xs text-slate-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateJobStatus(job.id, { status: 'rejected' })}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                        >
                          {t('declineJob')}
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, { status: 'accepted' })}
                          className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('acceptJob')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Active Gig */}
          {activeGig && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-lg font-black text-white">{t('activeGigTitle')}</h3>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/40">
                  {activeGig.status.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4">
                <h4 className="text-base font-black text-white mb-1">{activeGig.title}</h4>
                <p className="text-xs text-slate-300 mb-2">{activeGig.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Employer: <strong className="text-white">{activeGig.employerName}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-white">{activeGig.location}</strong></span>
                  <span>•</span>
                  <span>Wage: <strong className="text-emerald-400 text-sm">₹{activeGig.offeredWage}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveChatJob(activeGig)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{t('chatWithEmployer')}</span>
                </button>

                {activeGig.status === 'accepted' ? (
                  <button
                    onClick={() => updateJobStatus(activeGig.id, { status: 'in_progress' })}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg transition cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{t('startJob')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateJobStatus(activeGig.id, { status: 'completed', rating: 5 })}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('completeJobBtn')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Verified Work History Ledger (Slide 9) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center justify-between">
              <span>{t('recentWorkHistory')}</span>
              <span className="text-xs text-slate-400 font-normal">All gigs verified on platform</span>
            </h3>

            <div className="space-y-2.5">
              {worker.recentWork && worker.recentWork.map((rw, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <h5 className="font-black text-sm text-slate-900">{rw.title}</h5>
                    <p className="text-xs text-slate-500">{rw.location} • {rw.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-700">₹{rw.wage}</div>
                    <div className="text-xs font-bold text-amber-500 flex items-center justify-end">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {rw.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Register New Artisan Modal (Slide 5: Register, Slide 8: Registration & Login) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Register as New Artisan</h3>
                <p className="text-xs text-slate-400">Join KaamSetu digital workforce in Pune</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Shinde"
                  value={regForm.name}
                  onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trade Skill</label>
                  <select
                    value={regForm.trade}
                    onChange={(e) => setRegForm(prev => ({ ...prev, trade: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Painter">Painter</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Mason">Mason (Mistri)</option>
                    <option value="Welder">Welder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    required
                    value={regForm.experienceYears}
                    onChange={(e) => setRegForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    min="350"
                    max="2000"
                    step="50"
                    required
                    value={regForm.dailyWage}
                    onChange={(e) => setRegForm(prev => ({ ...prev, dailyWage: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pune Locality</label>
                  <select
                    value={regForm.location}
                    onChange={(e) => setRegForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Kothrud, Pune">Kothrud</option>
                    <option value="Swargate, Pune">Swargate</option>
                    <option value="Pimpri, Pune">Pimpri-Chinchwad</option>
                    <option value="Hadapsar, Pune">Hadapsar</option>
                    <option value="Katraj, Pune">Katraj</option>
                    <option value="Baner, Pune">Baner</option>
                    <option value="Wakad, Pune">Wakad</option>
                    <option value="Wagholi, Pune">Wagholi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sub-skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Wiring, Pipe fitting, Tile finish"
                  value={regForm.skills}
                  onChange={(e) => setRegForm(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900">
                ✓ Aadhaar OTP simulated check will automatically be completed upon creation.
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  {registering ? 'Creating...' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
