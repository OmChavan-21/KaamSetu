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
  IndianRupee 
} from 'lucide-react';

const TRADES = [
  { id: 'all', label: 'All Trades', mr: 'सर्व व्यवसाय', hi: 'सभी कार्य' },
  { id: 'Electrician', label: 'Electrician', mr: 'इलेक्ट्रिशियन', hi: 'इलेक्ट्रीशियन' },
  { id: 'Plumber', label: 'Plumber', mr: 'प्लंबर', hi: 'प्लंबर' },
  { id: 'Painter', label: 'Painter', mr: 'पेंटर', hi: 'पेंटर' },
  { id: 'Carpenter', label: 'Carpenter', mr: 'सुतार (कारपेंटर)', hi: 'बढ़ई (कारपेंटर)' },
  { id: 'Mason', label: 'Mason (Mistri)', mr: 'गवंडी (मिस्त्री)', hi: 'राजमिस्त्री' },
  { id: 'Welder', label: 'Welder', mr: 'वेल्डर', hi: 'वेल्डर' }
];

const LOCALITIES = [
  { id: 'all', label: 'All Pune' },
  { id: 'Swargate', label: 'Swargate' },
  { id: 'Kothrud', label: 'Kothrud' },
  { id: 'Pimpri', label: 'Pimpri-Chinchwad' },
  { id: 'Hadapsar', label: 'Hadapsar' },
  { id: 'Katraj', label: 'Katraj' },
  { id: 'Baner', label: 'Baner' },
  { id: 'Wagholi', label: 'Wagholi' },
  { id: 'Bhosari', label: 'Bhosari MIDC' },
  { id: 'Wakad', label: 'Wakad' },
  { id: 'Shivajinagar', label: 'Shivajinagar' }
];

export function SearchFilterBar() {
  const { filters, setFilters, viewMode, setViewMode, language, t } = useApp();

  const handleTradeChange = (trade) => {
    setFilters(prev => ({ ...prev, trade }));
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 mb-8 space-y-5">
      {/* Top Search & Location & View Switcher */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Pune Locality Selector */}
        <div className="relative min-w-[200px]">
          <MapPin className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {LOCALITIES.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.label}</option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher: Cards vs Virtual Chowk Map */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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

      {/* Trade Quick Filter Chips */}
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
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
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

      {/* Secondary Filters Bar: Budget Slider, Available Now toggle, Sort By */}
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

        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold">{t('sortBy')}</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="aiMatch">{t('sortAiMatch')}</option>
            <option value="rating">{t('sortRating')}</option>
            <option value="wageLow">{t('sortWageLow')}</option>
            <option value="distance">{t('sortDistance')}</option>
          </select>
        </div>

      </div>

    </div>
  );
}
