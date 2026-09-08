import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './FilterBar';
import DestinationCard from './DestinationCard';
import SkeletonCard from '../common/SkeletonCard';
import { destinationService } from '../../services/api';
import { useLocation } from '../../context/LocationContext';
import {
  Compass,
  SearchX,
  RefreshCcw,
  Sparkles,
  Search,
  Loader2,
  Globe2,
  ArrowRight,
  MapPin,
  X,
  Radio
} from 'lucide-react';

export default function DestinationExplorer({ onSelectDestination, externalSearchQuery, onClearSearch }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [discovering, setDiscovering] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState('');
  const { coords, getDistanceTo } = useLocation();

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    if (externalSearchQuery !== undefined && externalSearchQuery !== null) {
      setInternalSearch(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getDestinations({ size: 40 });
      setDestinations(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeQuery = internalSearch.trim();

  // Search & Filter Pipeline
  const filteredDestinations = useMemo(() => {
    let list = [...destinations];

    if (activeQuery !== '') {
      const q = activeQuery.toLowerCase();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedContinent !== 'all') {
      list = list.filter((d) => d.continent.toLowerCase() === selectedContinent.toLowerCase());
    }

    if (selectedTag !== 'all') {
      list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));
    }

    list.sort((a, b) => {
      if (sortBy === 'distance' && coords) {
        const distA = getDistanceTo(a.latitude, a.longitude) ?? 999999;
        const distB = getDistanceTo(b.latitude, b.longitude) ?? 999999;
        return distA - distB;
      }
      if (sortBy === 'budget-low') {
        return (a.avgDailyBudgetUSD || 0) - (b.avgDailyBudgetUSD || 0);
      }
      if (sortBy === 'budget-high') {
        return (b.avgDailyBudgetUSD || 0) - (a.avgDailyBudgetUSD || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    return list;
  }, [destinations, activeQuery, selectedContinent, selectedTag, sortBy, coords, getDistanceTo]);

  const handleDiscoverAnywhere = async (placeNameToSearch = activeQuery) => {
    if (!placeNameToSearch || placeNameToSearch.trim() === '') return;

    const target = placeNameToSearch.trim();
    setDiscovering(true);
    setDiscoveryStatus(`Searching travel details for "${target}"...`);

    try {
      const existing = destinations.find(
        (d) => d.name.toLowerCase() === target.toLowerCase() || d.country.toLowerCase() === target.toLowerCase()
      );

      if (existing) {
        setDiscovering(false);
        onSelectDestination(existing);
        return;
      }

      setDiscoveryStatus(`Finding top attractions, live weather & photos for "${target}"...`);
      const newDest = await destinationService.discoverDestination(target);

      setDestinations((prev) => [newDest, ...prev.filter((d) => d.id !== newDest.id)]);

      setDiscovering(false);
      onSelectDestination(newDest);

    } catch (err) {
      console.error(err);
      setDiscovering(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedContinent('all');
    setSelectedTag('all');
    setSortBy('rating');
    setInternalSearch('');
    if (onClearSearch) onClearSearch();
  };

  const globalPills = [
    "Santorini", "Dubai", "Barcelona", "Prague", "London",
    "Sydney", "Singapore", "Cairo", "Venice", "Hawaii", "Seoul", "Queenstown"
  ];

  return (
    <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-aetheria-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold mb-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>02 / Explore Destinations</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Top Destinations Worldwide
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-md leading-relaxed font-light">
          Browse our travel destinations or search for <strong>any place on Earth</strong>. Click any destination to see real-time weather, famous landmarks, and photo galleries.
        </p>
      </div>

      {/* Global Interactive Search Input Dock */}
      <div className="glass-aetheria p-3.5 sm:p-4 rounded-3xl border border-cyan-500/25 mb-8 shadow-2xl shadow-cyan-950/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeQuery) handleDiscoverAnywhere(activeQuery);
          }}
          className="flex flex-col sm:flex-row items-center gap-2.5"
        >
          <div className="flex items-center pl-3 w-full flex-1 text-slate-300">
            <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search any destination (e.g. Munnar, Paris, Kyoto, Dubai, Iceland)..."
              className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-0 font-sans"
            />
            {internalSearch && (
              <button
                type="button"
                onClick={() => setInternalSearch('')}
                className="p-1 text-slate-400 hover:text-white transition-colors mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!activeQuery}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-cyan-400/30 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-35 cursor-pointer"
          >
            <Globe2 className="w-4 h-4" />
            <span>Search Worldwide</span>
          </button>
        </form>

        {/* Global Quick-Discovery Suggestions */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-3 mt-3 border-t border-aetheria-border scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-mono-telemetry font-bold text-slate-400 shrink-0 pl-1">
            Popular Places:
          </span>
          {globalPills.map((place) => (
            <button
              key={place}
              onClick={() => {
                setInternalSearch(place);
                handleDiscoverAnywhere(place);
              }}
              className="px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 hover:text-cyan-300 text-slate-300 text-[11px] whitespace-nowrap transition-all border border-aetheria-border shrink-0 font-mono-telemetry"
            >
              {place}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedContinent={selectedContinent}
        onSelectContinent={setSelectedContinent}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        sortBy={sortBy}
        onChangeSort={setSortBy}
        hasLocation={!!coords}
      />

      {/* Dynamic AI Discovery Banner for Any Searched Query */}
      {activeQuery && (
        <div className="mb-8 p-6 glass-aetheria rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 via-emerald-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-cyan-500/5">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-white">
                Search Worldwide: "{activeQuery}"
              </h4>
              <p className="text-xs text-slate-300/90 leading-relaxed max-w-xl mt-1 font-light">
                Looking for somewhere not on our list? Generate a complete travel guide for <strong>{activeQuery}</strong> with live weather, top attractions, and photos.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDiscoverAnywhere(activeQuery)}
            disabled={discovering}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-cyan-400/30 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            {discovering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Guide...</span>
              </>
            ) : (
              <>
                <span>View Travel Guide</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Destination Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={onSelectDestination}
            />
          ))}
        </div>
      ) : (
        /* Empty State with Immediate Worldwide Discovery Option */
        <div className="text-center py-16 px-6 glass-aetheria rounded-3xl border border-aetheria-border max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Globe2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            {activeQuery ? `Explore "${activeQuery}" Worldwide` : 'No Destinations Found'}
          </h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed font-light">
            {activeQuery
              ? `"${activeQuery}" isn't in our featured list yet, but we can generate a complete travel guide with map coordinates, live weather, attractions, and photos right now!`
              : 'No destinations match your selected filters. Try resetting your filters or search for another location.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {activeQuery && (
              <button
                onClick={() => handleDiscoverAnywhere(activeQuery)}
                disabled={discovering}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-cyan-400/30 transition-all flex items-center space-x-2"
              >
                {discovering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Travel Guide...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Explore "{activeQuery}"</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors border border-aetheria-border font-mono-telemetry"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Discovery Loading Modal */}
      {discovering && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-aetheria max-w-md w-full p-8 rounded-3xl border border-cyan-400/50 text-center space-y-5 shadow-2xl shadow-cyan-500/15">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-300 animate-bounce">
              <Compass className="w-8 h-8 animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Loading Destination Info
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1 font-light">
                {discoveryStatus}
              </p>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 h-full animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
