import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_DISTRICTS } from '../../data/maharashtraDistricts';
import { 
  X, 
  Briefcase, 
  HardHat, 
  ShieldCheck, 
  Lock, 
  Phone, 
  User, 
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  MapPin,
  IndianRupee
} from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { 
    workers, 
    login,
    register,
    requestPasswordReset,
    resetPassword,
    loginAsAdmin,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authRole,
    userDistrict,
    language, 
    t 
  } = useApp();

  const showModal = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const closeModal = onClose || (() => setIsAuthModalOpen(false));

  // Modes: 'login' | 'register' | 'forgot' | 'reset' | 'admin'
  const [mode, setMode] = useState('login');

  // Shared status & loading
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('aditya@kaamsetu.in');
  const [loginPassword, setLoginPassword] = useState('KaamSetu2026!');

  // Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('employer'); // 'employer' | 'worker'
  const [regDistrict, setRegDistrict] = useState(userDistrict || 'Kolhapur');
  const [regTrade, setRegTrade] = useState('Electrician');
  const [regWage, setRegWage] = useState('650');

  // Forgot Password / Reset Form
  const [resetEmail, setResetEmail] = useState('');
  const [resetTokenOrCode, setResetTokenOrCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [devPreviewCode, setDevPreviewCode] = useState(null);

  // Admin PIN Form
  const [adminPin, setAdminPin] = useState('');

  // Check URL parameters for direct reset token on mount or open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('resetToken') || params.get('token') || params.get('code');
      const urlEmail = params.get('email');
      if (urlToken) {
        setResetTokenOrCode(urlToken);
        if (urlEmail) setResetEmail(decodeURIComponent(urlEmail));
        setMode('reset');
        setIsAuthModalOpen(true);
      }
    }
  }, [setIsAuthModalOpen]);

  if (!showModal) return null;

  // Clear messages on mode switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1-Click Demo Login fill
  const fillDemoAccount = (role) => {
    if (role === 'employer') {
      setLoginEmail('aditya@kaamsetu.in');
      setLoginPassword('KaamSetu2026!');
    } else if (role === 'worker') {
      setLoginEmail('bandu@kaamsetu.in');
      setLoginPassword('KaamSetu2026!');
    } else if (role === 'admin') {
      setLoginEmail('admin@kaamsetu.in');
      setLoginPassword('KaamSetu2026!');
    }
    setErrorMessage('');
  };

  // Submit Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      closeModal();
    } else {
      setErrorMessage(result.error || 'Invalid email or password. Please try again.');
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      district: regDistrict,
      city: regDistrict,
      workerTrade: regTrade,
      workerDailyWage: Number(regWage) || 600
    });
    setLoading(false);

    if (result.success) {
      closeModal();
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  // Submit Request Password Reset (Forgot Password)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const result = await requestPasswordReset(resetEmail || loginEmail);
    setLoading(false);

    if (result.success) {
      setSuccessMessage(result.data.message || 'Password reset instructions have been dispatched!');
      if (result.data.devPreview?.resetCode) {
        setDevPreviewCode(result.data.devPreview.resetCode);
      }
      // Transition to code confirmation
      setResetTokenOrCode(result.data.devPreview?.resetCode || '');
      setMode('reset');
    } else {
      setErrorMessage(result.error || 'Failed to dispatch reset code. Please check your email.');
    }
  };

  // Submit Reset Password with Code/Token
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match. Please verify.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(resetTokenOrCode, newPassword);
    setLoading(false);

    if (result.success) {
      // Clean URL params if any
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      closeModal();
    } else {
      setErrorMessage(result.error || 'Failed to reset password. The code may be expired or invalid.');
    }
  };

  // Submit Admin PIN
  const handleAdminPinSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const success = await loginAsAdmin(adminPin);
    setLoading(false);

    if (success) {
      closeModal();
    } else {
      setErrorMessage('Invalid Admin Passcode! Hint: Enter "admin123"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header with gradient branding */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              K
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-white">KaamSetu Identity Hub</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  कामसेतू
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Sign in to access your Maharashtra portal'}
                {mode === 'register' && 'Register your profile to hire or find gigs statewide'}
                {(mode === 'forgot' || mode === 'reset') && 'Secure email password verification & recovery'}
                {mode === 'admin' && 'Restricted Trust & Verification Officer Portal'}
              </p>
            </div>
          </div>

          {/* Top navigation tabs */}
          <div className="grid grid-cols-4 gap-1 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800 mt-4 text-[11px] font-bold">
            <button
              onClick={() => switchMode('login')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => switchMode('register')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            <button
              onClick={() => switchMode('forgot')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${
                mode === 'forgot' || mode === 'reset'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset PW</span>
            </button>

            <button
              onClick={() => switchMode('admin')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer ${
                mode === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff PIN</span>
            </button>
          </div>
        </div>

        {/* Global Error & Success Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-xs text-red-700 font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: SIGN IN (LOGIN)                                  */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            
            {/* Quick Demo Credentials Bar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-500 block mb-1.5">⚡ 1-Click Demo Profiles:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('employer')}
                  className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition text-center truncate cursor-pointer"
                >
                  💼 Aditya (Hire)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('worker')}
                  className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-[11px] transition text-center truncate cursor-pointer"
                >
                  👷 Bandu (Worker)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-xl font-bold text-[11px] transition text-center truncate cursor-pointer"
                >
                  🛡️ Admin Staff
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address / ईमेल
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@kaamsetu.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Password / पासवर्ड
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(loginEmail);
                    switchMode('forgot');
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In (प्रवेश करा)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Create Account (नोंदणी करा)
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 2: SIGN UP / REGISTER                               */}
        {/* ======================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            
            {/* Persona Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Select Your Role / भूमिका निवडा
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('employer')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    regRole === 'employer'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="text-xs font-bold">Customer / Contractor</div>
                  <div className="text-[10px] text-slate-500">I want to hire workers (काम देणारा)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('worker')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    regRole === 'worker'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-black shadow-sm ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <HardHat className="w-5 h-5 text-amber-600 mb-1" />
                  <div className="text-xs font-bold">Skilled Artisan / Shramik</div>
                  <div className="text-[10px] text-slate-500">I want to get jobs (काम करणारा)</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name / पूर्ण नाव
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Baburao Patil"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address / ईमेल
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile / मोबाइल
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 00000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Worker-Specific Attributes */}
            {regRole === 'worker' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Artisan Details (कारागीर कौशल्य तपशील)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Primary Trade / व्यवसाय
                    </label>
                    <select
                      value={regTrade}
                      onChange={(e) => setRegTrade(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Electrician">Electrician (इलेक्ट्रिशियन)</option>
                      <option value="Plumber">Plumber (प्लंबर)</option>
                      <option value="Carpenter">Carpenter (सुतार)</option>
                      <option value="Painter">Painter (रंगारी)</option>
                      <option value="Mason">Mason / Gavandi (गवंडी)</option>
                      <option value="Welder">Welder (वेल्डर)</option>
                      <option value="Fabrication">Fabrication (फॅब्रिकेशन)</option>
                      <option value="Tile / Flooring">Tile / Flooring (टाईल्स कारागीर)</option>
                      <option value="Hamal / Helper">Hamal / Helper (हमाल / मदतनीस)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Daily Wage / दैनिक मजुरी (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="300"
                        max="3000"
                        value={regWage}
                        onChange={(e) => setRegWage(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    District Hub / जिल्हा
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {MAHARASHTRA_DISTRICTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.nameMr})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Confirm password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create KaamSetu Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Sign In here (लॉग इन करा)
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 3: FORGOT PASSWORD (STEP 1: REQUEST CODE)           */}
        {/* ======================================================== */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 font-medium">
              📧 <strong>Password Recovery:</strong> Enter your registered KaamSetu email address. We will immediately dispatch a secure 6-digit code and direct password reset link.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Registered Email Address / नोंदणीकृत ईमेल
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. aditya@kaamsetu.in"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Password Reset Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back to Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Already have a reset code?
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 4: RESET PASSWORD (STEP 2: VERIFY CODE & NEW PW)    */}
        {/* ======================================================== */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
            
            {/* Dev Preview Helper Box (if in dev mode) */}
            {devPreviewCode && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 font-semibold space-y-1.5 animate-pulse">
                <div className="flex items-center justify-between">
                  <span>📬 Dev Mailbox Preview:</span>
                  <span className="font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-sm font-black">
                    {devPreviewCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResetTokenOrCode(devPreviewCode)}
                  className="w-full py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-lg text-[11px] font-black cursor-pointer"
                >
                  Click to Auto-fill Reset Code ({devPreviewCode})
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                6-Digit Verification Code or Reset Token
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 665359 or paste reset token"
                  value={resetTokenOrCode}
                  onChange={(e) => setResetTokenOrCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                New Password (नवीन पासवर्ड)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Save New Password & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 5: STAFF TRUST ADMIN PASSCODE                       */}
        {/* ======================================================== */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminPinSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200/80 text-xs text-red-950 font-medium flex items-start space-x-2">
              <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Restricted Staff Portal:</strong> Only authorized KaamSetu Trust & Verification registrars can access the governance layer to approve/revoke identity badges.
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
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Security Evaluation Passcode:</span>
              <button
                type="button"
                onClick={() => setAdminPin('admin123')}
                className="bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded font-mono font-bold text-slate-800 cursor-pointer"
              >
                admin123 (Auto-fill)
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Unlock Trust Admin Center</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back to User Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
