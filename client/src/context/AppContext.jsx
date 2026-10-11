import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [role, setRole] = useState('employer'); // 'employer' | 'worker' | 'admin'
  const [language, setLanguage] = useState('en'); // 'en' | 'mr' | 'hi'
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active simulated worker identity when in worker mode (default to w-1 Sanjay More or w-2 Ramesh Pawar)
  const [activeWorkerId, setActiveWorkerId] = useState('w-1');

  // Filters state
  const [filters, setFilters] = useState({
    trade: 'all',
    location: 'all',
    maxWage: 1000,
    availableOnly: false,
    search: '',
    sortBy: 'aiMatch' // 'aiMatch' | 'rating' | 'wageLow' | 'distance'
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

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [workersRes, jobsRes, analyticsRes] = await Promise.all([
        fetch('/api/workers'),
        fetch('/api/jobs'),
        fetch('/api/analytics')
      ]);

      if (workersRes.ok) setWorkers(await workersRes.json());
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

  // Dispatch Job Request
  const sendJobRequest = async (jobPayload) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
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

        // Refresh analytics & workers to reflect rating/earnings updates
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
        setActiveWorkerId(createdWorker.id);
        if (soundEnabled) sound.playSuccess();
        addToast(
          language === 'mr' ? 'नवीन कारागीर नोंदणी यशस्वी झाली!' :
          language === 'hi' ? 'नए कारीगर का पंजीकरण सफल हुआ!' :
          'Artisan registered successfully on Digital Chowk!',
          'success'
        );
        return createdWorker;
      }
    } catch (err) {
      addToast('Error registering worker', 'alert');
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
        role,
        setRole,
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
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
