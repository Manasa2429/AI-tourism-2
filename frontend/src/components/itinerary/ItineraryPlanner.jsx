import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Compass, DollarSign, Sliders, CheckCircle, ArrowRight, Loader2, RefreshCw, MapPin, Check, Plus, Radio, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { aiService, getNearbyFamousPlaces } from '../../services/api';
import ItineraryTimeline from './ItineraryTimeline';

export default function ItineraryPlanner({ initialDestination, initialItinerary }) {
  const [destinationName, setDestinationName] = useState(() => {
    return initialDestination?.name || localStorage.getItem('travel_dest_name') || 'Kyoto, Japan';
  });
  const [days, setDays] = useState(() => {
    return parseInt(localStorage.getItem('travel_trip_days') || '3', 10);
  });
  const [travelStyle, setTravelStyle] = useState('Culture & Heritage');
  const [budgetLevel, setBudgetLevel] = useState('Moderate');
  const [pace, setPace] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState(['Architecture', 'Local Markets', 'Photography']);
  const [generatedItinerary, setGeneratedItinerary] = useState(() => {
    if (initialItinerary) return initialItinerary;
    try {
      const saved = localStorage.getItem('travel_saved_itinerary');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNearbyPlaces, setSelectedNearbyPlaces] = useState(
    initialDestination?.selectedNearbyPlace ? [initialDestination.selectedNearbyPlace.name] : []
  );

  useEffect(() => {
    if (initialDestination?.name) {
      setDestinationName(initialDestination.name);
      try { localStorage.setItem('travel_dest_name', initialDestination.name); } catch {}
      if (initialDestination.selectedNearbyPlace) {
        setSelectedNearbyPlaces([initialDestination.selectedNearbyPlace.name]);
      } else {
        setSelectedNearbyPlaces([]);
      }
      setGeneratedItinerary(null);
      setError(null);
    }
  }, [initialDestination]);

  useEffect(() => {
    try {
      localStorage.setItem('travel_dest_name', destinationName);
      localStorage.setItem('travel_trip_days', String(days));
      if (generatedItinerary) {
        localStorage.setItem('travel_saved_itinerary', JSON.stringify(generatedItinerary));
      } else {
        localStorage.removeItem('travel_saved_itinerary');
      }
    } catch {}
  }, [destinationName, days, generatedItinerary]);

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTomorrowStr());

  const computeEndDateStr = (start, dayCount) => {
    if (!start) return '';
    const d = new Date(start);
    d.setDate(d.getDate() + (parseInt(dayCount, 10) - 1));
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const availableNearby = initialDestination?.nearbyPlaces && initialDestination.nearbyPlaces.length > 0
    ? initialDestination.nearbyPlaces
    : getNearbyFamousPlaces(destinationName);

  const toggleNearbyPlace = (placeName) => {
    setSelectedNearbyPlaces((prev) =>
      prev.includes(placeName) ? prev.filter((p) => p !== placeName) : [...prev, placeName]
    );
  };

  const styleOptions = [
    { label: 'Culture & Heritage', desc: 'Sacred shrines, ancient palaces & living traditions' },
    { label: 'Gastronomy & Wine', desc: 'Artisan food alleys, Michelin tasting & regional markets' },
    { label: 'Nature & Wilderness', desc: 'Glacial lakes, alpine ridges & sacred old-growth groves' },
    { label: 'Relaxed Luxury', desc: 'Boutique sanctuaries, scenic terraces & thermal spas' },
  ];

  const interestPills = [
    'Architecture', 'Temples & Shrines', 'Local Markets', 'Fine Dining',
    'Photography', 'Scenic Viewpoints', 'Art & Museums', 'Nature Walks'
  ];

  const toggleInterest = (pill) => {
    setSelectedInterests((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 8-second safety fallback ensures the button never remains stuck
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    try {
      const chosenNearbyObjs = selectedNearbyPlaces.map(name =>
        availableNearby.find(p => p.name === name) || { name }
      );

      const result = await aiService.generateItinerary({
        destinationName,
        days: parseInt(days, 10),
        travelStyle,
        budgetLevel,
        pace,
        startDate,
        interests: selectedInterests,
        selectedNearbyPlaces: chosenNearbyObjs
      });

      clearTimeout(safetyTimer);
      if (result && Array.isArray(result.days) && result.days.length > 0) {
        setGeneratedItinerary(result);
        setTimeout(() => {
          const el = document.getElementById('itinerary');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);

        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#10b981', '#38bdf8', '#ffffff']
          });
        } catch {}
      } else {
        throw new Error("No itinerary days returned from generator");
      }

    } catch (err) {
      clearTimeout(safetyTimer);
      console.error("[AI Itinerary] Primary generation error:", err);
      setError("Unable to generate itinerary at this moment. Please check parameters and try again.");
    } finally {
      clearTimeout(safetyTimer);
      setLoading(false);
    }
  };

  return (
    <div id="itinerary" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24 space-y-12">
      {/* Studio Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold uppercase font-mono-telemetry tracking-widest shadow-lg shadow-cyan-500/5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Trip Planner</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Create Your Custom Travel Plan
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
          Choose your destination, trip duration, travel style, and pace. Our smart AI generates a complete day-by-day itinerary with real locations, popular attractions, and estimated travel times.
        </p>
      </div>

      {/* Main Studio Interactive Configuration Panel */}
      {!generatedItinerary ? (
        <div className="glass-aetheria p-6 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Destination Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Where do you want to go?</span>
              </label>
              <input
                type="text"
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Munnar, Kerala or Kyoto, Japan or Paris, France"
                className="w-full glass-aetheria-input rounded-2xl px-5 py-4 text-white font-medium text-sm placeholder-slate-500 focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Days Slider & Calendar Range */}
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono-telemetry">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Trip Duration</span>
                  </label>
                  <span className="text-xs font-bold text-cyan-300 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                    {days} {days === 1 ? 'Day' : 'Days'} Itinerary
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 px-1 font-mono-telemetry font-bold">
                  <span>1 Day</span>
                  <span>2 Days</span>
                  <span>3 Days</span>
                  <span>4 Days</span>
                  <span>5 Days</span>
                  <span>6 Days</span>
                  <span>7 Days</span>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-aetheria-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-aetheria-surface border border-aetheria-border rounded-xl px-4 py-2.5 text-white font-medium text-xs focus:outline-none focus:border-cyan-400 cursor-pointer font-mono-telemetry"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end font-mono-telemetry">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Trip End ({days} Days)
                  </span>
                  <div className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between">
                    <span>{computeEndDateStr(startDate, days)}</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      End Date
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Style Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Travel Style</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {styleOptions.map((opt) => {
                  const isSelected = travelStyle === opt.label;
                  return (
                    <div
                      key={opt.label}
                      onClick={() => setTravelStyle(opt.label)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-cyan-500/30 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="font-display font-bold text-sm text-white mb-1 flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-snug font-light">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby Places Selector */}
            {availableNearby && availableNearby.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between font-mono-telemetry">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Include Nearby Places &amp; Day Trips</span>
                  </label>
                  <span className="text-[11px] font-bold text-cyan-400 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">
                    {selectedNearbyPlaces.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableNearby.map((place) => {
                    const isSelected = selectedNearbyPlaces.includes(place.name);
                    return (
                      <div
                        key={place.id || place.name}
                        onClick={() => toggleNearbyPlace(place.name)}
                        className={`group rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                            : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-cyan-500/30'
                        }`}
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-slate-800">
                          <img
                            src={place.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"}
                            alt={place.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono-telemetry bg-black/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/30">
                            {place.distance || 'Nearby'}
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/60 text-white/60 border border-white/20'
                            }`}>
                              {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono-telemetry">
                            {place.category || 'Day Trip'}
                          </div>
                          <h5 className="font-display text-sm font-bold text-white line-clamp-1">
                            {place.name}
                          </h5>
                          <p className="text-[11px] text-slate-400 line-clamp-2 font-light">
                            {place.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Budget & Pace Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 font-display">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Budget</span>
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono-telemetry">
                  {['Budget', 'Moderate', 'Luxury'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudgetLevel(b)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        budgetLevel === b
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/[0.08]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                  Trip Pace
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono-telemetry">
                  {['Slow & Immersive', 'Balanced', 'High-Energy'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPace(p)}
                      className={`py-2.5 rounded-xl text-xs font-bold tracking-wider border transition-all ${
                        pace === p
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Interests */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                Key Interests to Prioritize
              </label>
              <div className="flex flex-wrap gap-2 font-mono-telemetry">
                {interestPills.map((pill) => {
                  const isSelected = selectedInterests.includes(pill);
                  return (
                    <button
                      type="button"
                      key={pill}
                      onClick={() => toggleInterest(pill)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs transition-all font-medium ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-semibold'
                          : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {pill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-2xl bg-coral-500/10 border border-coral-500/30 text-coral-300 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-coral-400 hover:text-white ml-2 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase hover:shadow-xl hover:shadow-cyan-400/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Day-by-Day Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Itinerary</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <ItineraryTimeline
          itinerary={generatedItinerary}
          onReset={() => setGeneratedItinerary(null)}
        />
      )}
    </div>
  );
}
