import React from 'react';
import { SlidersHorizontal, Sparkles, Compass, Radio } from 'lucide-react';

export default function FilterBar({
  selectedContinent,
  onSelectContinent,
  selectedTag,
  onSelectTag,
  sortBy,
  onChangeSort,
  hasLocation
}) {
  const continents = [
    { id: 'all', label: 'All Continents' },
    { id: 'Asia', label: 'Asia' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Americas', label: 'Americas' },
    { id: 'Africa', label: 'Africa' },
  ];

  const vibeTags = [
    'All', 'Culture', 'Temples', 'Gastronomy', 'Nature', 'Architecture', 'Mountains', 'Beaches', 'Luxury'
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Top Filter Row: Continent Segmented Tabs & Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Continent Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none p-1 rounded-2xl bg-white/[0.03] border border-aetheria-border backdrop-blur-md">
          {continents.map((continent) => {
            const isActive = selectedContinent.toLowerCase() === continent.id.toLowerCase();
            return (
              <button
                key={continent.id}
                onClick={() => onSelectContinent(continent.id)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {continent.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono-telemetry">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value)}
              className="bg-aetheria-card border border-aetheria-border text-slate-200 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-lg shadow-black/50 hover:border-cyan-500/40 transition-all font-sans"
            >
              <option value="rating">Highest Rated</option>
              {hasLocation && <option value="distance">Nearest to Origin (GPS)</option>}
              <option value="budget-low">Budget: Low to High</option>
              <option value="budget-high">Budget: Luxury First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vibe / Theme Tags Row */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest shrink-0 flex items-center space-x-1.5 pl-1 font-mono-telemetry">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vibe:</span>
        </span>
        {vibeTags.map((tag) => {
          const isActive = selectedTag.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(tag === 'All' ? 'all' : tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs transition-all shrink-0 font-medium ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
