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
  Info 
} from 'lucide-react';

export function VirtualChowkMap({ workers }) {
  const { setSelectedWorkerForJob, setSelectedWorkerForProfile, language, t } = useApp();
  const [selectedMapWorker, setSelectedMapWorker] = useState(null);
  const [activeRadiusKm, setActiveRadiusKm] = useState(15);

  // Pune bounding box normalization for SVG map projection
  // Pune Lat range: ~18.44 (Katraj) to ~18.64 (Pimpri/Bhosari)
  // Pune Lng range: ~73.72 (Hinjewadi) to ~74.00 (Wagholi)
  const minLat = 18.44;
  const maxLat = 18.65;
  const minLng = 73.72;
  const maxLng = 74.00;

  const projectToMapCoords = (lat, lng) => {
    const xPercent = ((lng - minLng) / (maxLng - minLng)) * 100;
    const yPercent = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(8, Math.min(92, xPercent)),
      y: Math.max(10, Math.min(90, yPercent))
    };
  };

  // Center / Employer location (Swargate/Shivajinagar Central Pune: 18.5204, 73.8567)
  const centerCoords = projectToMapCoords(18.5204, 73.8567);

  const filteredWorkers = workers.filter(w => (w.distanceKm || 5) <= activeRadiusKm);

  if (selectedMapWorker && (selectedMapWorker.distanceKm || 5) > activeRadiusKm) {
    setSelectedMapWorker(null);
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === 'mr' ? 'आभासी मजूर नाका (Virtual Chowk Radar)' : 'Virtual Chowk Live Radar'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Live Pune
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr' 
              ? 'भौतिक मजूर नाक्यावर तासनतास थांबण्याऐवजी, थेट नकाशावर उपलब्ध कारागीर शोधा.'
              : 'Instead of standing at physical chowks, workers broadcast live availability across Pune.'}
          </p>
        </div>

        {/* Radius filter */}
        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-semibold">Radar Radius:</span>
          <span className="text-xs font-black text-emerald-400">{activeRadiusKm} km</span>
          <input
            type="range"
            min="5"
            max="25"
            step="2"
            value={activeRadiusKm}
            onChange={(e) => setActiveRadiusKm(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Interactive Map Surface */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Concentric radar rings centered on Pune */}
        <div 
          className="absolute rounded-full border border-emerald-500/20 pointer-events-none"
          style={{
            width: '180px',
            height: '180px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute rounded-full border border-emerald-500/15 pointer-events-none"
          style={{
            width: '320px',
            height: '320px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute rounded-full border border-teal-500/10 pointer-events-none"
          style={{
            width: '460px',
            height: '460px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Radar beam rotation animation */}
        <div
          className="absolute rounded-full pointer-events-none overflow-hidden"
          style={{
            width: '420px',
            height: '420px',
            left: `${centerCoords.x}%`,
            top: `${centerCoords.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="w-full h-full origin-center animate-spin"
            style={{
              animationDuration: '6s',
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.25) 0deg, rgba(16, 185, 129, 0) 60deg, transparent 360deg)'
            }}
          />
        </div>

        {/* Center / Employer Marker */}
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
          <span className="text-[10px] font-black text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-md mt-6 border border-cyan-500/40 whitespace-nowrap">
            Your Location (Shivaji Nagar)
          </span>
        </div>

        {/* Locality Reference Labels */}
        {[
          { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
          { name: 'Swargate', lat: 18.5018, lng: 73.8580 },
          { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
          { name: 'Hadapsar', lat: 18.5089, lng: 73.9259 },
          { name: 'Katraj', lat: 18.4575, lng: 73.8677 },
          { name: 'Baner', lat: 18.5590, lng: 73.7868 },
          { name: 'Wagholi', lat: 18.5793, lng: 73.9829 },
          { name: 'Bhosari MIDC', lat: 18.6258, lng: 73.8447 }
        ].map((loc, idx) => {
          const coords = projectToMapCoords(loc.lat, loc.lng);
          return (
            <div
              key={idx}
              className="absolute pointer-events-none text-[10px] text-slate-500 font-semibold tracking-wider uppercase"
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
          const coords = projectToMapCoords(worker.lat, worker.lng);
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
                  {worker.matchScore || 90}%
                </span>
              </div>

              {/* Compact Name Tag */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-700 shadow-md">
                {worker.name} • ₹{worker.dailyWage}
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
                <span>Distance from you:</span>
                <span className="font-bold text-white">{selectedMapWorker.distanceKm || 3.2} km</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Locality:</span>
                <span className="font-bold text-white">{selectedMapWorker.locationArea}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>AI Match:</span>
                <span className="font-bold text-emerald-400">{selectedMapWorker.matchScore || 92}% Fit</span>
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
            <span>Employer Center (You)</span>
          </div>
        </div>
        <div>
          <span>Showing {filteredWorkers.length} verified workers within {activeRadiusKm} km</span>
        </div>
      </div>

    </div>
  );
}
