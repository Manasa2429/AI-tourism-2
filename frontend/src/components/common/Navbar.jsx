import React, { useState, useEffect } from 'react';
import { Sparkles, Bookmark, X, ChevronRight, Navigation, Globe, Compass, Radio } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useSavedTrips } from '../../context/SavedTripsContext';

export default function Navbar({ onOpenItinerary, onOpenChat, onSelectDestination }) {
  const { coords, locationName, requestLocation, setManualLocation, loading: locationLoading } = useLocation();
  const { favorites, savedItineraries } = useSavedTrips();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const popularLocations = [
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ];

  const handleManualSelect = (loc) => {
    setManualLocation(loc.name, loc.lat, loc.lng);
    setShowLocationSearch(false);
  };

  const totalSavedCount = favorites.length + savedItineraries.length;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-aetheria-obsidian/85 backdrop-blur-2xl border-b border-aetheria-border shadow-2xl shadow-black/80'
            : 'py-5 bg-gradient-to-b from-aetheria-void via-aetheria-void/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* AETHERIA Brand Logo & Monogram */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Glowing Lumina Prism Emblem */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-200 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all duration-300">
                <svg className="w-5 h-5 text-slate-950 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <polyline points="2 8.5 12 12 22 8.5" />
                </svg>
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col">
              <span className="font-display tracking-[0.22em] text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                AETHERIA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-cyan-400/90 font-medium font-mono-telemetry flex items-center gap-1.5">
                <span>AI Travel Planner</span>
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-emerald-400">Aura AI</span>
              </span>
            </div>
          </a>

          {/* Center Navigation Capsule */}
          <nav className="hidden lg:flex items-center space-x-1 p-1.5 rounded-full bg-white/[0.03] border border-aetheria-border backdrop-blur-2xl">
            <a
              href="#destinations"
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Destinations
            </a>
            <a
              href="#places"
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Attractions
            </a>
            <button
              onClick={() => onOpenItinerary()}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center space-x-1.5 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>AI Planner</span>
            </button>
            <button
              onClick={onOpenChat}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center space-x-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Right Tools: Orbital Location & Saved Trips */}
          <div className="flex items-center space-x-2.5">
            {/* Origin Telemetry Pill */}
            <div className="relative">
              <button
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                className={`flex items-center space-x-2 text-xs font-medium py-2 px-3.5 rounded-full border transition-all duration-300 ${
                  coords
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
                title="Configure departure origin"
              >
                <div className="relative flex items-center justify-center">
                  <Radio className={`w-3.5 h-3.5 ${coords ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {coords && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <span className="max-w-[120px] sm:max-w-[150px] truncate text-[11px] font-mono-telemetry tracking-wide">
                  {locationLoading ? 'Locating...' : coords ? (locationName || 'Location Set') : 'Set Location'}
                </span>
              </button>

              {/* Location Picker Popover */}
              {showLocationSearch && (
                <div className="absolute right-0 mt-3 w-80 glass-aetheria rounded-3xl p-5 shadow-2xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-aetheria-border mb-4">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs uppercase tracking-wider font-display font-bold text-white">
                        Choose Starting Location
                      </span>
                    </div>
                    <button
                      onClick={() => setShowLocationSearch(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      requestLocation();
                      setShowLocationSearch(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-cyan-600/30 via-emerald-500/30 to-cyan-600/30 hover:from-cyan-600/40 hover:to-emerald-500/40 border border-cyan-500/40 text-cyan-200 rounded-2xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-cyan-500/10 mb-4 group"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <span>Use My Current Location</span>
                  </button>

                  <div className="text-[10px] uppercase font-mono-telemetry tracking-widest text-slate-400 mb-2.5 font-semibold px-1">
                    Or select a popular city:
                  </div>

                  <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                    {popularLocations.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleManualSelect(loc)}
                        className="w-full text-left px-3.5 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-cyan-300 transition-colors">{loc.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Saved Trips Pill */}
            <button
              onClick={() => setShowFavoritesModal(true)}
              className="relative p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-aetheria-border text-slate-300 hover:text-cyan-400 transition-all duration-300"
              title="Saved Trips"
            >
              <Bookmark className="w-4 h-4" />
              {totalSavedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md shadow-cyan-400/40">
                  {totalSavedCount}
                </span>
              )}
            </button>

            {/* Mobile AI Concierge Trigger */}
            <button
              onClick={onOpenChat}
              className="lg:hidden p-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all"
              title="Open Aura AI Concierge"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Saved Expeditions Modal */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-aetheria w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-aetheria-border mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white font-bold">Saved Trips</h3>
                  <p className="text-xs text-slate-400">Your saved destinations and personalized travel plans</p>
                </div>
              </div>
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Bookmarked Sanctuaries */}
              <div>
                <h4 className="text-xs uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold mb-3">
                  Saved Destinations ({favorites.length})
                </h4>

                {favorites.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No destinations saved yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Tap the bookmark icon on any destination card to save it.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favorites.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => {
                          onSelectDestination(dest);
                          setShowFavoritesModal(false);
                        }}
                        className="group cursor-pointer rounded-2xl overflow-hidden border border-aetheria-border bg-aetheria-surface/80 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 transition-all flex items-center p-2.5 space-x-3"
                      >
                        <img
                          src={dest.coverImageUrl}
                          alt={dest.name}
                          className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                            {dest.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{dest.country}</p>
                          <span className="text-[10px] text-emerald-400 font-semibold font-mono-telemetry">★ {dest.rating || 4.9}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved AI Expeditions */}
              <div>
                <h4 className="text-xs uppercase font-mono-telemetry tracking-widest text-emerald-400 font-bold mb-3">
                  Saved AI Itineraries ({savedItineraries.length})
                </h4>

                {savedItineraries.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
                    <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No itineraries created yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Create an itinerary with the AI Planner to save and view your day-by-day travel plans here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedItineraries.map((itin) => (
                      <div
                        key={itin.id}
                        className="p-4 rounded-2xl border border-aetheria-border bg-aetheria-surface/60 hover:bg-aetheria-surface transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm text-white">{itin.tripTitle || itin.destinationName}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono-telemetry">
                            {itin.durationDays} Days • {itin.travelStyle} • {itin.budgetLevel}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            onOpenItinerary(itin);
                            setShowFavoritesModal(false);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide transition-all"
                        >
                          View Plan
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
