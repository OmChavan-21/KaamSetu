import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

// Earth radius distance calculation (Haversine formula in km)
export function calculateClientDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.5;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c * 10) / 10;
  return isNaN(dist) ? 3.5 : dist;
}

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication & Portal Isolation State
  const [authRole, setAuthRole] = useState('employer'); // 'employer' | 'worker' | 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: 'emp-101',
    name: 'Aditya Deshmukh (Contractor)',
    phone: '+91 98221 00011',
    role: 'employer',
    title: 'General Contractor • Pune'
  });

  const [language, setLanguage] = useState('en'); // 'en' | 'mr' | 'hi'
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Geolocation & City State (Defaults to Kolhapur as requested)
  const [userCity, setUserCity] = useState('Kolhapur'); // 'Kolhapur' | 'Pune' | 'all'
  const [userCoords, setUserCoords] = useState({
    lat: 16.6946,
    lng: 74.2238,
    name: 'Kolhapur Central (Bindu Chowk)'
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('active'); // 'detected' | 'manual' | 'active'

  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active simulated worker identity when in worker mode (default to w-k1 Bandu Patil when Kolhapur or w-2 Ramesh Pawar)
  const [activeWorkerId, setActiveWorkerId] = useState('w-k1');

  // Filters state (for employer search)
  const [filters, setFilters] = useState({
    city: 'Kolhapur',
    trade: 'all',
    location: 'all',
    maxWage: 1000,
    availableOnly: false,
    search: '',
    sortBy: 'distance' // default to closest distance
  });

  // Active Modals state
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState(null);
  const [selectedWorkerForJob, setSelectedWorkerForJob] = useState(null);
  const [activeChatJob, setActiveChatJob] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    if (soundEnabled) {
      if (type === 'success') sound.playSuccess();
      else if (type === 'alert') sound.playAlert();
      else sound.playClick();
    }
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Geolocation detection method
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'alert');
      return;
    }
    setIsLocating(true);
    addToast(
      language === 'mr' ? 'GPS स्थान शोधत आहे...' :
      language === 'hi' ? 'GPS स्थान खोजा जा रहा है...' :
      'Detecting live GPS coordinates...',
      'info'
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        // Check proximity: Kolhapur center (16.7050, 74.2433) vs Pune center (18.5204, 73.8567)
        const distToKolhapur = calculateClientDistance(latitude, longitude, 16.7050, 74.2433);
        const distToPune = calculateClientDistance(latitude, longitude, 18.5204, 73.8567);
        const detectedCity = distToKolhapur < distToPune ? 'Kolhapur' : 'Pune';

        const newCoords = {
          lat: latitude,
          lng: longitude,
          accuracy,
          name: `${detectedCity} (Live GPS)`
        };

        setUserCoords(newCoords);
        setUserCity(detectedCity);
        setFilters(prev => ({ ...prev, city: detectedCity, location: 'all' }));
        setLocationStatus('detected');
        setIsLocating(false);

        // Dynamically recalculate distances for all loaded workers
        setWorkers(prev => prev.map(w => ({
          ...w,
          distanceKm: calculateClientDistance(latitude, longitude, w.lat, w.lng)
        })));

        addToast(
          language === 'mr' ? `स्थान निश्चित झाले: ${detectedCity === 'Kolhapur' ? 'कोल्हापूर' : 'पुणे'}! जवळील कारागीर दाखवत आहे.` :
          language === 'hi' ? `स्थान मिला: ${detectedCity}! आस-पास के कारीगर दिखाए जा रहे हैं।` :
          `Live GPS Detected: ${detectedCity}! Showing nearest verified artisans.`,
          'success'
        );
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err.message);
        addToast(
          language === 'mr' ? 'GPS परवानगी नाकारली. तुम्ही मॅन्युअली कोल्हापूर किंवा पुणे निवडू शकता.' :
          'GPS access denied or unavailable. You can easily switch city manually.',
          'alert'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Manual city selection method
  const selectCity = (cityName) => {
    setUserCity(cityName);
    setLocationStatus('manual');

    let newCoords;
    if (cityName === 'Kolhapur') {
      newCoords = { lat: 16.6946, lng: 74.2238, name: 'Kolhapur Central (Bindu Chowk)' };
      addToast(
        language === 'mr' ? 'कोल्हापूर शहर सक्रिय: बिंदू चौक, राजारामपुरी व शाहूपुरी कारागीर!' :
        'Switched to Kolhapur: Showing Bindu Chowk, Rajarampuri & Kolhapur artisans!',
        'success'
      );
    } else if (cityName === 'Pune') {
      newCoords = { lat: 18.5204, lng: 73.8567, name: 'Pune Central (Swargate/Shivajinagar)' };
      addToast(
        language === 'mr' ? 'पुणे शहर सक्रिय: स्वारगेट, कोथरूड व पिंपरी कारागीर!' :
        'Switched to Pune: Showing Swargate, Kothrud & Pune artisans!',
        'success'
      );
    } else {
      newCoords = userCoords;
      addToast('Showing all registered artisans across Maharashtra.', 'info');
    }

    setUserCoords(newCoords);
    setFilters(prev => ({ ...prev, city: cityName, location: 'all' }));

    // Recalculate distance for all workers relative to selected city
    setWorkers(prev => prev.map(w => ({
      ...w,
      distanceKm: calculateClientDistance(newCoords.lat, newCoords.lng, w.lat, w.lng)
    })));
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [workersRes, jobsRes, analyticsRes] = await Promise.all([
        fetch('/api/workers'),
        fetch('/api/jobs'),
        fetch('/api/analytics')
      ]);

      if (workersRes.ok) {
        const rawWorkers = await workersRes.json();
        const mappedWorkers = rawWorkers.map(w => ({
          ...w,
          distanceKm: calculateClientDistance(userCoords.lat, userCoords.lng, w.lat, w.lng)
        }));
        setWorkers(mappedWorkers);
      }
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Failed to fetch from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Authentication Switcher Methods
  const loginAsEmployer = (userData) => {
    setAuthRole('employer');
    setCurrentUser({
      id: userData?.id || 'emp-101',
      name: userData?.name || 'Aditya Deshmukh (Contractor)',
      phone: userData?.phone || '+91 98221 00011',
      role: 'employer',
      title: 'Customer / Contractor'
    });
    if (soundEnabled) sound.playSuccess();
    addToast(
      language === 'mr' ? 'ग्राहक पोर्टलवर स्वागत आहे!' :
      language === 'hi' ? 'ग्राहक पोर्टल में आपका स्वागत है!' :
      'Switched to Customer / Employer Portal!',
      'success'
    );
  };

  const loginAsWorker = (workerUser) => {
    setAuthRole('worker');
    setActiveWorkerId(workerUser.id);
    setCurrentUser({
      id: workerUser.id,
      name: workerUser.name,
      phone: workerUser.phone || '+91 98000 00000',
      role: 'worker',
      trade: workerUser.trade,
      title: `${workerUser.trade} • ${workerUser.locationArea || workerUser.location}`
    });
    if (soundEnabled) sound.playSuccess();
    addToast(
      language === 'mr' ? `स्वागत आहे, ${workerUser.name}! कारागीर स्टेशन उघडले आहे.` :
      language === 'hi' ? `स्वागत है, ${workerUser.name}! कारीगर स्टेशन सक्रिय है।` :
      `Logged in as ${workerUser.name} (${workerUser.trade})!`,
      'success'
    );
  };

  const loginAsAdmin = (pin) => {
    if (pin === 'admin123' || pin === 'kaamsetu2026') {
      setIsAdminAuthenticated(true);
      setAuthRole('admin');
      setCurrentUser({
        id: 'admin-01',
        name: 'Chief Verification Officer',
        role: 'admin',
        title: 'Trust & Verification Registrar'
      });
      if (soundEnabled) sound.playSuccess();
      addToast('Trust Admin Portal Unlocked!', 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthModalOpen(true);
  };

  // Dispatch Job Request
  const sendJobRequest = async (jobPayload) => {
    try {
      const payload = {
        ...jobPayload,
        employerName: currentUser.name,
        employerPhone: currentUser.phone
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const createdJob = await res.json();
        setJobs(prev => [createdJob, ...prev]);
        setSelectedWorkerForJob(null);
        addToast(
          language === 'mr' ? 'कामाची मागणी यशस्वीरित्या पाठवली!' :
          language === 'hi' ? 'काम का अनुरोध सफलतापूर्वक भेजा गया!' :
          'Job request dispatched successfully to worker!',
          'success'
        );
        return createdJob;
      }
    } catch (err) {
      addToast('Failed to dispatch job request', 'alert');
    }
  };

  // Update Job Status
  const updateJobStatus = async (jobId, updates) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
        
        // Trigger celebratory sound and confetti if job is completed
        if (updates.status === 'completed') {
          if (soundEnabled) sound.playCoin();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          addToast(
            language === 'mr' ? 'काम पूर्ण! मजुरी जमा झाली.' :
            language === 'hi' ? 'काम पूरा हुआ! मजदूरी जमा हुई।' :
            'Gig completed! Wage payment recorded.',
            'success'
          );
        } else if (updates.status === 'accepted') {
          if (soundEnabled) sound.playSuccess();
          addToast(
            language === 'mr' ? 'कारागिराने काम स्वीकारले!' :
            language === 'hi' ? 'कारीगर ने काम स्वीकार कर लिया!' :
            'Worker accepted the job!',
            'success'
          );
        }

        // Refresh analytics & workers
        fetch('/api/analytics').then(r => r.json()).then(setAnalytics).catch(() => {});
        fetch('/api/workers').then(r => r.json()).then(setWorkers).catch(() => {});
        return updated;
      }
    } catch (err) {
      addToast('Error updating job status', 'alert');
    }
  };

  // Toggle Worker Availability
  const toggleWorkerAvailability = async (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    const newStatus = !worker.isAvailable;
    try {
      const res = await fetch(`/api/workers/${workerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkers(prev => prev.map(w => w.id === workerId ? updated : w));
        if (soundEnabled) sound.playClick();
        addToast(
          newStatus ? 
            (language === 'mr' ? 'तुम्ही आता ऑनलाइन आहात! काम मिळण्यास तयार.' : 'You are now Online on Digital Chowk!') :
            (language === 'mr' ? 'तुम्ही ऑफलाइन झाला आहात.' : 'You are now Offline.'),
          'info'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify Worker (Trust Layer Admin)
  const verifyWorker = async (workerId, field = 'isSkillVerified') => {
    try {
      const worker = workers.find(w => w.id === workerId);
      const updates = { [field]: !worker[field] };
      const res = await fetch(`/api/workers/${workerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkers(prev => prev.map(w => w.id === workerId ? updated : w));
        addToast(`Worker ${field === 'isSkillVerified' ? 'Skill' : 'Identity'} status updated!`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Register New Worker
  const registerWorker = async (workerData) => {
    try {
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workerData)
      });
      if (res.ok) {
        const createdWorker = await res.json();
        setWorkers(prev => [createdWorker, ...prev]);
        loginAsWorker(createdWorker);
        return createdWorker;
      }
    } catch (err) {
      addToast('Error registering worker', 'alert');
    }
  };

  // AI Matching Hook
  const runAiMatch = async (requirement) => {
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirement)
      });
      if (res.ok) {
        const data = await res.json();
        setWorkers(data.recommendations);
        if (soundEnabled) sound.playSuccess();
        addToast(
          language === 'mr' ? 'AI मॅचिंग इंजिनने सर्वोत्तम कारागीर क्रमवारी लावली!' :
          language === 'hi' ? 'AI मैचिंग इंजन ने सर्वश्रेष्ठ कामगार रैंक किए!' :
          'AI Match Engine ranked workers by skill, location, budget and rating!',
          'success'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Demo
  const resetDemo = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        fetchData();
        addToast('Reset demo state to initial presentation baseline!', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeWorkerUser = workers.find(w => w.id === activeWorkerId) || workers[0];

  return (
    <AppContext.Provider
      value={{
        role: authRole,
        authRole,
        setRole: setAuthRole,
        currentUser,
        isAdminAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAsEmployer,
        loginAsWorker,
        loginAsAdmin,
        logout,
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        userCity,
        setUserCity,
        userCoords,
        setUserCoords,
        isLocating,
        locationStatus,
        detectUserLocation,
        selectCity,
        calculateClientDistance,
        workers,
        setWorkers,
        jobs,
        setJobs,
        analytics,
        loading,
        activeWorkerId,
        setActiveWorkerId,
        activeWorkerUser,
        filters,
        setFilters,
        selectedWorkerForProfile,
        setSelectedWorkerForProfile,
        selectedWorkerForJob,
        setSelectedWorkerForJob,
        activeChatJob,
        setActiveChatJob,
        showAdminModal,
        setShowAdminModal,
        showAiAssistant,
        setShowAiAssistant,
        viewMode,
        setViewMode,
        toasts,
        addToast,
        t,
        sendJobRequest,
        updateJobStatus,
        toggleWorkerAvailability,
        verifyWorker,
        registerWorker,
        runAiMatch,
        resetDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
