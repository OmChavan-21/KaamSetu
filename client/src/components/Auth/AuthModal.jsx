import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Briefcase, 
  HardHat, 
  ShieldCheck, 
  Lock, 
  Phone, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { 
    workers, 
    loginAsEmployer, 
    loginAsWorker, 
    loginAsAdmin, 
    currentUser, 
    authRole, 
    isAuthModalOpen,
    setIsAuthModalOpen,
    language, 
    t 
  } = useApp();

  const showModal = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const closeModal = onClose || (() => setIsAuthModalOpen(false));

  const [activeTab, setActiveTab] = useState(authRole || 'employer'); // 'employer' | 'worker' | 'admin'

  // Employer Form
  const [empName, setEmpName] = useState('Aditya Deshmukh (Contractor)');
  const [empPhone, setEmpPhone] = useState('+91 98221 00011');

  // Worker Form
  const [selectedWorkerId, setSelectedWorkerId] = useState('w-2'); // Ramesh Pawar
  const [workerPhone, setWorkerPhone] = useState('+91 97654 23891');
  const [workerOtp, setWorkerOtp] = useState('4829');
  const [otpSent, setOtpSent] = useState(false);

  // Admin Form
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!showModal) return null;

  const handleEmployerLogin = (e) => {
    e.preventDefault();
    loginAsEmployer({
      id: 'emp-101',
      name: empName,
      phone: empPhone,
      role: 'employer'
    });
    closeModal();
  };

  const handleWorkerLogin = (e) => {
    e.preventDefault();
    const worker = workers.find(w => w.id === selectedWorkerId);
    if (worker) {
      loginAsWorker(worker);
      closeModal();
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPin);
    if (success) {
      setAdminError('');
      closeModal();
    } else {
      setAdminError('Invalid Admin Passcode! Hint: Use "admin123"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 relative">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              K
            </div>
            <div>
              <h3 className="text-xl font-black text-white">KaamSetu Account Portal</h3>
              <p className="text-xs text-slate-400">Choose your role to access your dedicated space</p>
            </div>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800 mt-4 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('employer'); setAdminError(''); }}
              className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'employer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Customer / Hire</span>
            </button>

            <button
              onClick={() => { setActiveTab('worker'); setAdminError(''); }}
              className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'worker'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Skilled Worker</span>
            </button>

            <button
              onClick={() => { setActiveTab('admin'); setAdminError(''); }}
              className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust Admin</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Customer / Employer */}
        {activeTab === 'employer' && (
          <form onSubmit={handleEmployerLogin} className="p-6 space-y-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 font-medium">
              💡 <strong>Customer / Contractor Portal:</strong> Search verified electricians, plumbers & painters, use Virtual Chowk Radar, and dispatch job requests.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Your Name / Contractor Business
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick Demo Presets */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Quick Presets:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEmpName('Aditya Deshmukh (Contractor)'); setEmpPhone('+91 98221 00011'); }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Aditya (Contractor)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmpName('Meera Patel (Homeowner)'); setEmpPhone('+91 98234 55566'); }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Meera (Homeowner)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Enter Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Skilled Worker Login */}
        {activeTab === 'worker' && (
          <form onSubmit={handleWorkerLogin} className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 font-medium">
              👷 <strong>Artisan Station:</strong> Manage incoming gig requests, broadcast your live availability on Digital Chowk, and view daily earnings.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Your Worker Profile
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => {
                  setSelectedWorkerId(e.target.value);
                  const w = workers.find(item => item.id === e.target.value);
                  if (w) setWorkerPhone(w.phone || '+91 98000 00000');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.trade} ({w.locationArea || w.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Registered Mobile (OTP Verification)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Simulated OTP Verification:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                OTP: 4829 (Auto-verified)
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Enter Worker Station</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Protected Trust Admin Portal */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200/80 text-xs text-red-900 font-medium flex items-start space-x-2">
              <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Restricted Staff Portal:</strong> Only authorized KaamSetu verification officers can access the Trust Layer to approve/revoke identity and skill certificates.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Security PIN / Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter Admin PIN (Default: admin123)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {adminError && (
                <p className="text-xs font-bold text-red-600 mt-1">{adminError}</p>
              )}
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              Passcode hint for evaluation: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">admin123</code>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Unlock Trust Admin Center</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
