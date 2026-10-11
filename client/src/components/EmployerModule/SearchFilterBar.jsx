import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  CheckCircle, 
  Sparkles, 
  LayoutGrid, 
  Radio, 
  IndianRupee,
  Navigation,
  Crosshair,
  Compass,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';

const TRADES = [
  { id: 'all', label: 'All Trades', mr: 'सर्व व्यवसाय', hi: 'सभी कार्य' },
  { id: 'Electrician', label: 'Electrician', mr: 'इलेक्ट्रिशियन', hi: 'इलेक्ट्रीशियन' },
  { id: 'Plumber', label: 'Plumber', mr: 'प्लंबर', hi: 'प्लंबर' },
  { id: 'Painter', label: 'Painter', mr: 'पेंटर', hi: 'पेंटर' },
  { id: 'Carpenter', label: 'Carpenter', mr: 'सुतार (कारपेंटर)', hi: 'बढ़ई (कारपेंटर)' },
  { id: 'Mason', label: 'Mason (Mistri)', mr: 'गवंडी (मिस्त्री)', hi: 'राजमिस्त्री' },
  { id: 'Welder', label: 'Welder', mr: 'वेल्डर', hi: 'वेल्डर' },
  { id: 'Helper', label: 'Helper (Hamal)', mr: 'मदतनीस / हमाल', hi: 'हेल्पर / हम्माल' }
];

export function SearchFilterBar() {
  const { 
    filters, 
    setFilters, 
    viewMode, 
    setViewMode, 
    userCity, 
    userDistrict,
    userDivision,
    selectDistrict, 
    selectDivision,
    maharashtraDivisions = [],
    maharashtraDistricts = [],
    userCoords, 
    isLocating, 
    locationStatus, 
    detectUserLocation, 
    language, 
    t 
  } = useApp();

  const handleTradeChange = (trade) => {
    setFilters(prev => ({ ...prev, trade }));
  };

  // Find active district object to retrieve its local chowks
  const currentDistrictObj = maharashtraDistricts.find(
    d => d.id === userDistrict || d.name === userDistrict
  );

  // Compute active chowks based on active district
  const activeChowks = [
    { id: 'all', label: userDistrict === 'all' ? 'All Maharashtra Chowks (सर्व नाके)' : `All ${currentDistrictObj?.name || userDistrict} Chowks` },
    ...(currentDistrictObj?.chowks || []).map(c => ({
      id: c.id,
      label: c.name
    }))
  ];

  // Key quick-pick districts for top pill bar
  const quickDistricts = [
    { id: 'Kolhapur', name: 'Kolhapur', mr: 'कोल्हापूर' },
    { id: 'Pune', name: 'Pune', mr: 'पुणे' },
    { id: 'Mumbai', name: 'Mumbai', mr: 'मुंबई' },
    { id: 'Thane', name: 'Thane', mr: 'ठाणे' },
    { id: 'Chhatrapati Sambhajinagar', name: 'Sambhajinagar', mr: 'छ. संभाजीनगर' },
    { id: 'Nagpur', name: 'Nagpur', mr: 'नागपूर' },
    { id: 'Nashik', name: 'Nashik', mr: 'नाशिक' },
    { id: 'Satara', name: 'Satara', mr: 'सातारा' },
    { id: 'Sangli', name: 'Sangli', mr: 'सांगली' },
    { id: 'Solapur', name: 'Solapur', mr: 'सोलापूर' }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 mb-8 space-y-5">
      
      {/* 1. Statewide Banner & Live GPS Snapper Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-4 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-md border border-emerald-500/30">
        
        {/* Current Active Location & Live GPS Coordinates */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0 shadow-inner">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                {language === 'mr' ? 'महाराष्ट्र राज्यव्यापी केंद्र' : 'Maharashtra State Hub'}
              </span>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {locationStatus === 'detected' ? '✓ Live GPS Snapped' : '📍 ' + (currentDistrictObj?.name || userDistrict || 'Kolhapur')}
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5 flex items-center space-x-2">
              <span>{userCoords.name || (currentDistrictObj?.name || 'Kolhapur') + ' Central Hub'}</span>
              <span className="text-xs text-slate-400 font-mono">
                ({userCoords.lat.toFixed(3)}, {userCoords.lng.toFixed(3)})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Auto-Detect GPS & District Dropdown */}
        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto">
          {/* Detect Live GPS Button */}
          <button
            onClick={detectUserLocation}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-teal-500/20 transition cursor-pointer disabled:opacity-50"
            title="Auto-detect closest Maharashtra district hub via device GPS"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : (language === 'mr' ? 'GPS स्थान शोधा' : 'Detect My GPS')}</span>
          </button>

          {/* District Switcher Dropdown (all 15+ Maharashtra districts grouped by division) */}
          <div className="relative">
            <select
              value={userDistrict || 'Kolhapur'}
              onChange={(e) => selectDistrict(e.target.value)}
              className="bg-slate-800/90 text-white text-xs font-black px-3.5 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="all">🚩 All Maharashtra (संपूर्ण महाराष्ट्र)</option>
              {maharashtraDivisions.filter(d => d.id !== 'all').map(div => {
                const distsInDiv = maharashtraDistricts.filter(d => d.division === div.id);
                return (
                  <optgroup key={div.id} label={`${div.name} (${div.nameMr})`}>
                    {distsInDiv.map(dist => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} ({dist.nameMr})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* 2. Quick District Pills (Popular Districts Bar) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          {language === 'mr' ? 'प्रमुख जिल्हे:' : 'Districts:'}
        </span>

        <button
          onClick={() => selectDistrict('all')}
          className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap transition cursor-pointer ${
            userDistrict === 'all'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          🚩 All MH
        </button>

        {quickDistricts.map(qd => {
          const isSelected = userDistrict === qd.id;
          return (
            <button
              key={qd.id}
              onClick={() => selectDistrict(qd.id)}
              className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap transition flex items-center space-x-1 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{language === 'mr' ? qd.mr : qd.name}</span>
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* 3. Top Search & Dynamic Locality Dropdown & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder={
              userDistrict === 'all'
                ? 'Search electrician, plumber, mason across Maharashtra...'
                : `Search verified artisans in ${currentDistrictObj?.name || userDistrict} chowks...`
            }
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Dynamic Locality / Chowk Selector */}
        <div className="relative min-w-[260px]">
          <MapPin className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {activeChowks.map(chowk => (
              <option key={chowk.id} value={chowk.id}>{chowk.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* View Mode Switcher: Cards vs Virtual Chowk Map */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mr' ? 'यादी (Cards)' : 'Grid View'}</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{language === 'mr' ? 'डिजिटल नाका (Radar)' : 'Virtual Chowk'}</span>
          </button>
        </div>

      </div>

      {/* 4. Trade Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TRADES.map(tItem => {
          const isSelected = filters.trade === tItem.id;
          const label = language === 'mr' ? (tItem.mr || tItem.label) : 
                        language === 'hi' ? (tItem.hi || tItem.label) : 
                        tItem.label;
          return (
            <button
              key={tItem.id}
              onClick={() => handleTradeChange(tItem.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 5. Secondary Filters Bar: Budget Slider, Available Now toggle, Sort By */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
        
        {/* Budget Range */}
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-700 flex items-center">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
            {t('filterBudget')} <span className="text-emerald-700 font-extrabold ml-1">₹{filters.maxWage}</span>
          </span>
          <input
            type="range"
            min="400"
            max="1200"
            step="50"
            value={filters.maxWage}
            onChange={(e) => setFilters(prev => ({ ...prev, maxWage: Number(e.target.value) }))}
            className="w-28 sm:w-36 accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Available Now Toggle Switch */}
        <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100/80 transition">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, availableOnly: e.target.checked }))}
            className="sr-only"
          />
          <div className={`w-8 h-4 rounded-full transition-colors relative ${filters.availableOnly ? 'bg-emerald-600' : 'bg-slate-300'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${filters.availableOnly ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="font-bold text-slate-800 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-ping" />
            {t('filterAvailableNow')}
          </span>
        </label>

        {/* Sort By Dropdown (Includes Closest Distance) */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold">{t('sortBy')}</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="distance">📍 Closest Distance (जवळचे अंतर)</option>
            <option value="aiMatch">⚡ {t('sortAiMatch')}</option>
            <option value="rating">★ {t('sortRating')}</option>
            <option value="wageLow">₹ {t('sortWageLow')}</option>
          </select>
        </div>

      </div>

    </div>
  );
}
