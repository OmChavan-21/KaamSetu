import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  MapPin, 
  Navigation, 
  Zap, 
  Send, 
  Eye, 
  Star, 
  ShieldCheck, 
  Info,
  Layers,
  Crosshair
} from 'lucide-react';

export function VirtualChowkMap({ workers = [] }) {
  const { 
    setSelectedWorkerForJob, 
    setSelectedWorkerForProfile, 
    userCity, 
    userDistrict,
    maharashtraDistricts = [],
    userCoords, 
    language, 
    t 
  } = useApp();

  const isAllMaharashtra = userDistrict === 'all';
  const currentDistrictObj = maharashtraDistricts.find(
    d => d.id === userDistrict || d.name === userDistrict
  );

  const [selectedMapWorker, setSelectedMapWorker] = useState(null);
  const [activeRadiusKm, setActiveRadiusKm] = useState(isAllMaharashtra ? 400 : 25);

  // Dynamic bounding box calculation
  let minLat, maxLat, minLng, maxLng, landmarks = [];

  if (isAllMaharashtra) {
    // Entire Maharashtra State bounding box
    minLat = 15.60;
    maxLat = 22.05;
    minLng = 72.60;
    maxLng = 80.90;
    landmarks = maharashtraDistricts.map(d => ({
      name: `${d.name} (${d.nameMr})`,
      lat: d.lat,
      lng: d.lng
    }));
  } else if (currentDistrictObj) {
    // District-specific bounding box centered on district hub
    const spanLat = 0.14;
    const spanLng = 0.16;
    minLat = currentDistrictObj.lat - spanLat;
    maxLat = currentDistrictObj.lat + spanLat;
    minLng = currentDistrictObj.lng - spanLng;
    maxLng = currentDistrictObj.lng + spanLng;
    landmarks = (currentDistrictObj.chowks || []).map(c => ({
      name: c.name,
      lat: c.lat || currentDistrictObj.lat,
      lng: c.lng || currentDistrictObj.lng
    }));
  } else {
    // Fallback: Kolhapur
    minLat = 16.63;
    maxLat = 16.78;
    minLng = 74.18;
    maxLng = 74.31;
    landmarks = [
      { name: 'Bindu Chowk (मजूर नाका)', lat: 16.6946, lng: 74.2238 },
      { name: 'Rajarampuri', lat: 16.6923, lng: 74.2486 },
      { name: 'Shahupuri', lat: 16.7027, lng: 74.2384 },
      { name: 'Shiroli MIDC', lat: 16.7578, lng: 74.2829 }
    ];
  }

  const projectToMapCoords = (lat, lng) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    const xPercent = ((lng - minLng) / (maxLng - minLng)) * 100;
    const yPercent = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(6, Math.min(94, xPercent)),
      y: Math.max(8, Math.min(92, yPercent))
    };
  };

  // Center coordinates on user's active GPS / chosen district
  const centerCoords = projectToMapCoords(userCoords.lat, userCoords.lng);

  const filteredWorkers = workers.filter(w => {
    if (isAllMaharashtra) return true;
    return (w.distanceKm || 5) <= activeRadiusKm;
  });

  if (selectedMapWorker && !isAllMaharashtra && (selectedMapWorker.distanceKm || 5) > activeRadiusKm) {
    setSelectedMapWorker(null);
  }

  const districtDisplayName = isAllMaharashtra
    ? (language === 'mr' ? 'संपूर्ण महाराष्ट्र (Statewide)' : 'All Maharashtra (Statewide)')
    : `${currentDistrictObj?.name || userDistrict} (${currentDistrictObj?.nameMr || ''})`;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === 'mr' 
                ? `आभासी मजूर नाका रडार • ${districtDisplayName}`
                : `Virtual Chowk Live Radar • ${districtDisplayName}`}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {isAllMaharashtra ? 'Statewide 36 Districts' : 'Live Hub'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr' 
              ? `भौतिक मजूर नाक्यावर (उदा. ${isAllMaharashtra ? 'स्थानिक मजूर नाके' : (currentDistrictObj?.chowks?.[0]?.name || 'मुख्य नाका')}) तासनतास न थांबता, थेट डिजिटल नकाशावरून कुशल कारागीर निवडा.`
              : `Bypassing physical labor chowks across Maharashtra: verified artisans broadcast live availability with GPS distance.`}
          </p>
        </div>

        {/* Radius filter */}
        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-semibold">Radar Range:</span>
          <span className="text-xs font-black text-emerald-400">
            {isAllMaharashtra ? 'Statewide' : `${activeRadiusKm} km`}
          </span>
          {!isAllMaharashtra && (
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={activeRadiusKm}
              onChange={(e) => setActiveRadiusKm(Number(e.target.value))}
              className="w-24 accent-emerald-500 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Interactive Map Surface */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Concentric radar rings centered on active coordinate */}
        <div 
          className="absolute rounded-full border border-emerald-500/25 pointer-events-none"
          style={{
            width: isAllMaharashtra ? '240px' : '180px',
            height: isAllMaharashtra ? '240px' : '180px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute rounded-full border border-emerald-500/15 pointer-events-none"
          style={{
            width: isAllMaharashtra ? '420px' : '320px',
            height: isAllMaharashtra ? '420px' : '320px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute rounded-full border border-teal-500/10 pointer-events-none"
          style={{
            width: isAllMaharashtra ? '600px' : '460px',
            height: isAllMaharashtra ? '600px' : '460px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Radar beam rotation animation */}
        <div
          className="absolute rounded-full pointer-events-none overflow-hidden"
          style={{
            width: isAllMaharashtra ? '580px' : '420px',
            height: isAllMaharashtra ? '580px' : '420px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="w-full h-full origin-center animate-spin"
            style={{
              animationDuration: isAllMaharashtra ? '10s' : '6s',
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.25) 0deg, rgba(16, 185, 129, 0) 60deg, transparent 360deg)'
            }}
          />
        </div>

        {/* Center / Employer Active Marker */}
        <div
          className="absolute z-20 flex flex-col items-center pointer-events-none"
          style={{
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-5 h-5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/40 shadow-lg shadow-cyan-400/50 animate-ping" />
          <div className="w-4 h-4 rounded-full bg-cyan-300 absolute" />
          <span className="text-[10px] font-black text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-md mt-6 border border-cyan-500/40 whitespace-nowrap shadow-md">
            📍 {userCoords.name || `${currentDistrictObj?.name || 'Maharashtra'} Center`}
          </span>
        </div>

        {/* Locality Reference Labels (Chowks / Districts) */}
        {landmarks.slice(0, 10).map((loc, idx) => {
          const coords = projectToMapCoords(loc.lat, loc.lng);
          return (
            <div
              key={idx}
              className="absolute pointer-events-none text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, 14px)'
              }}
            >
              • {loc.name}
            </div>
          );
        })}

        {/* Worker Markers */}
        {filteredWorkers.map(worker => {
          const wLat = worker.lat !== undefined ? worker.lat : (worker.coordinates?.lat || 18.5204);
          const wLng = worker.lng !== undefined ? worker.lng : (worker.coordinates?.lng || 73.8567);
          const coords = projectToMapCoords(wLat, wLng);
          const isSelected = selectedMapWorker?.id === worker.id;

          return (
            <div
              key={worker.id}
              onClick={() => setSelectedMapWorker(worker)}
              className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`
              }}
            >
              {/* Pulse halo if available now */}
              {worker.isAvailable && (
                <div className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
              )}

              {/* Worker Pin */}
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl shadow-xl border-2 transition ${
                isSelected
                  ? 'bg-amber-400 border-white ring-4 ring-amber-400/50 scale-110 text-slate-950 font-black'
                  : worker.isAvailable
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-300 text-white font-bold'
                  : 'bg-slate-700 border-slate-500 text-slate-300 font-medium'
              }`}>
                <span className="text-xs font-black">{worker.name.charAt(0)}</span>
                
                {/* AI Match badge floating pill */}
                <span className="absolute -top-2 -right-2 text-[9px] font-black bg-slate-900 text-emerald-300 px-1 py-0.2 rounded-md border border-emerald-500/50">
                  {worker.matchScore || 92}%
                </span>
              </div>

              {/* Compact Name Tag */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-700 shadow-md">
                {worker.name} • {worker.distanceKm ? `${worker.distanceKm}km` : (worker.district || worker.city)}
              </div>
            </div>
          );
        })}

        {/* Selected Worker Floating Inspection Card */}
        {selectedMapWorker && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/50 shadow-2xl z-40 animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedMapWorker.avatar}
                  alt={selectedMapWorker.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400"
                />
                <div>
                  <h4 className="text-sm font-black text-white">{selectedMapWorker.name}</h4>
                  <p className="text-xs text-emerald-300 font-semibold">
                    {selectedMapWorker.trade} • {selectedMapWorker.experienceYears} yrs
                  </p>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-300 mt-0.5">
                    <span className="text-amber-400 font-bold">★ {selectedMapWorker.rating}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">₹{selectedMapWorker.dailyWage}/day</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMapWorker(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-800/80 p-2 rounded-xl mb-3 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span>District Hub:</span>
                <span className="font-bold text-white">{selectedMapWorker.district || selectedMapWorker.city}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Distance from you:</span>
                <span className="font-bold text-white">{selectedMapWorker.distanceKm || 1.2} km</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Locality / Chowk:</span>
                <span className="font-bold text-white">{selectedMapWorker.locationArea || selectedMapWorker.location}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>AI Match:</span>
                <span className="font-bold text-emerald-400">{selectedMapWorker.matchScore || 95}% Fit</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedWorkerForJob(selectedMapWorker)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </button>

              <button
                onClick={() => setSelectedWorkerForProfile(selectedMapWorker)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-400/40" />
            <span>Available on Chowk ({filteredWorkers.filter(w => w.isAvailable).length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
            <span>Active Location ({userCoords.name || currentDistrictObj?.name || 'Center'})</span>
          </div>
        </div>
        <div>
          <span>Showing {filteredWorkers.length} verified workers across {isAllMaharashtra ? 'Maharashtra' : `${currentDistrictObj?.name || userDistrict} Hub`}</span>
        </div>
      </div>

    </div>
  );
}
