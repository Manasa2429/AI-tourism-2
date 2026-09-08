import React, { useState } from 'react';
import {
  Calendar, Clock, MapPin, DollarSign, Bookmark, Printer, Share2,
  RefreshCw, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Navigation,
  Luggage, CheckSquare, Square, Compass, ExternalLink, ArrowRight, Radio,
  Ticket, Info, Footprints, Car, Train, Zap, ShieldCheck
} from 'lucide-react';
import ItineraryMap from './ItineraryMap';
import { useSavedTrips } from '../../context/SavedTripsContext';

export default function ItineraryTimeline({ itinerary, onReset }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const { saveItinerary } = useSavedTrips();
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div className="p-8 text-center glass-aetheria rounded-3xl border border-aetheria-border">
        <p className="text-sm text-slate-400 font-light">No itinerary days generated.</p>
        <button
          onClick={onReset}
          className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-bold font-display uppercase tracking-wider"
        >
          Try Again
        </button>
      </div>
    );
  }

  const days = itinerary.days;
  const currentDay = days[activeDayIndex] || days[0];
  const stops = currentDay.stops || currentDay.activities || [];

  // Calculate day metrics
  const totalDayKm = currentDay.totalDayDistanceKm || stops.reduce((acc, s) => acc + (s.distanceKm || 0), 0).toFixed(1);
  const totalDayDuration = currentDay.totalDayDurationHours || `${(stops.length * 2.2).toFixed(1)} Hours Total`;
  const transitMode = currentDay.primaryTransitMode || (parseFloat(totalDayKm) > 4 ? "Walking & Metro / Shuttle" : "Scenic Walking");

  const handleSave = () => {
    saveItinerary(itinerary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 01: VOYAGE EXECUTIVE HUD (Whole Trip Summary with Stops, Distance, and Time) */}
      <div className="glass-aetheria p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Radial Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-[10px] uppercase font-mono-telemetry font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>AI Trip Itinerary</span>
              </span>
              <span className="text-xs text-slate-300 font-mono-telemetry font-semibold">
                {itinerary.startDate} → {itinerary.endDate}
              </span>
              {itinerary.budgetLevel && (
                <span className="text-[10px] uppercase font-mono-telemetry px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  {itinerary.budgetLevel} Budget
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {itinerary.tripTitle || `${itinerary.destinationName} Trip`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300/90 mt-2 max-w-3xl leading-relaxed font-light">
              {itinerary.summary || `Complete multi-day travel plan for ${itinerary.destinationName}. Follow the day-by-day stops with real distances, schedules, and map directions.`}
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSave}
              className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-aetheria-border'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Itinerary Saved' : 'Save Plan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-aetheria-border text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Modify Trip</span>
            </button>
          </div>
        </div>

        {/* Global Voyage Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-aetheria-border">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-telemetry">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total Stops</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-display">
              {itinerary.totalTripStops || stops.length * days.length} Places to Visit
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-telemetry">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5 mb-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Distance</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-display">
              ~{itinerary.totalTripDistanceKm || (parseFloat(totalDayKm) * days.length).toFixed(1)} km
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-telemetry">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Pace</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-display">
              {itinerary.travelStyle || 'Balanced'} ({days.length} Days)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] font-mono-telemetry">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Est. Budget</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-300 font-display">
              {itinerary.estimatedBudget || `$${days.length * 150} - $${days.length * 250}`}
            </div>
          </div>
        </div>
      </div>

      {/* 02: DAY SELECTOR TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d, index) => {
          const isActive = index === activeDayIndex;
          const dayStopCount = d.stops?.length || d.activities?.length || 4;
          return (
            <button
              key={index}
              onClick={() => setActiveDayIndex(index)}
              className={`px-5 py-3 rounded-2xl text-xs font-display font-bold tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-aetheria-border'
              }`}
            >
              <span>Day {d.dayNumber || index + 1}</span>
              <span className={`text-[10px] font-mono-telemetry px-2 py-0.5 rounded-full ${
                isActive ? 'bg-slate-950 text-cyan-300' : 'bg-white/10 text-slate-400'
              }`}>
                {dayStopCount} Stops
              </span>
            </button>
          );
        })}
      </div>

      {/* 03: ACTIVE DAY OVERVIEW & GIS MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Day Stops Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl glass-aetheria border border-cyan-500/20">
            {/* Day Title & Stage */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-aetheria-border mb-4 gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold block">
                  {currentDay.dayStage || `Day ${currentDay.dayNumber || activeDayIndex + 1} Itinerary`}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Day {currentDay.dayNumber || activeDayIndex + 1}: {currentDay.theme || currentDay.title || 'Explore Destination'}
                </h3>
                {currentDay.dateFormatted && (
                  <p className="text-xs text-slate-400 font-mono-telemetry mt-0.5">
                    {currentDay.dateFormatted}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0 font-mono-telemetry">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-bold">
                  {stops.length} Stops
                </span>
              </div>
            </div>

            {/* Executive Day Traversal Telemetry HUD */}
            <div className="mb-6 p-4 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-telemetry">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  Day Distance:
                </span>
                <strong className="text-cyan-300 text-sm font-sans flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  ~{totalDayKm} km
                </strong>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  Estimated Time:
                </span>
                <strong className="text-emerald-300 text-sm font-sans flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {totalDayDuration}
                </strong>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  Daily Schedule:
                </span>
                <strong className="text-white text-xs font-sans">
                  {currentDay.dayStartTime || '08:30 AM'} – {currentDay.dayEndTime || '08:30 PM'}
                </strong>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  Transport Mode:
                </span>
                <strong className="text-slate-200 text-xs font-sans truncate block">
                  {transitMode}
                </strong>
              </div>
            </div>

            {currentDay.description && (
              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
                {currentDay.description}
              </p>
            )}

            {/* Vertical Stops Sequence */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-emerald-400 before:to-cyan-400/20">
              {stops.map((stop, stopIdx) => {
                const stopNum = stop.stopNumber || stopIdx + 1;
                const nextStop = stops[stopIdx + 1];

                return (
                  <div key={stopIdx} className="relative group">
                    {/* Glowing Waypoint Marker */}
                    <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono-telemetry font-bold text-cyan-300 group-hover:scale-125 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shadow-md shadow-cyan-400/25">
                      {stopNum}
                    </div>

                    {/* Stop Content Card */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-aetheria-border hover:border-cyan-400/40 transition-all space-y-3.5">
                      {/* Top Bar: Time Slot, Duration, & Stop Number */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono-telemetry uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            STOP {stopNum}
                          </span>
                          <span className="text-xs font-mono-telemetry text-slate-300 font-semibold flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{stop.timeSlot || '08:30 AM - Morning'}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] font-mono-telemetry">
                          {stop.duration && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-emerald-300 font-medium">
                              ⏱️ {stop.duration}
                            </span>
                          )}
                          {(stop.entryFee || stop.cost) && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 font-medium">
                              🎟️ {stop.entryFee || stop.cost}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Landmark Name & District */}
                      <div>
                        <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors">
                          {stop.place || stop.name}
                        </h4>
                        {stop.locationName && (
                          <p className="text-xs text-slate-400 font-mono-telemetry flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{stop.locationName}</span>
                            {stop.latitude && stop.longitude && (
                              <span className="text-slate-600">({stop.latitude.toFixed(2)}°N, {stop.longitude.toFixed(2)}°E)</span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Photo Thumbnail if available */}
                      {stop.imageUrl && (
                        <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                          <img
                            src={stop.imageUrl}
                            alt={stop.place || stop.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-mono-telemetry uppercase font-bold bg-black/80 text-cyan-300 border border-cyan-500/30">
                            {stop.category || 'Architectural Landmark'}
                          </span>
                        </div>
                      )}

                      {/* Activity description */}
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {stop.activity || stop.description}
                      </p>

                      {/* Iconic Claim to Fame ("What it's famous for") */}
                      {stop.famousFor && (
                        <div className="p-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-emerald-200 space-y-0.5">
                          <div className="text-[10px] uppercase font-mono-telemetry tracking-wider font-bold text-emerald-400 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Why Visit / Highlights:</span>
                          </div>
                          <p className="text-xs leading-relaxed font-light text-emerald-100/90">
                            {stop.famousFor}
                          </p>
                        </div>
                      )}

                      {/* Curator Insider Tip */}
                      {stop.tips && (
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-cyan-300/90 font-mono-telemetry flex items-start space-x-1.5">
                          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span><strong>Travel Tip:</strong> {stop.tips}</span>
                        </div>
                      )}

                      {/* Transit & Distance from Previous Stop */}
                      {stop.distanceFromPrev && stopIdx > 0 && (
                        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-telemetry">
                          <div className="flex items-center space-x-1.5 text-cyan-300">
                            <Navigation className="w-3 h-3 text-cyan-400" />
                            <span>Distance from Stop {stopIdx}: <strong>{stop.distanceFromPrev}</strong></span>
                          </div>
                          {stop.transitTime && (
                            <span className="text-slate-300">
                              Transit: <strong>{stop.transitTime}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* INTER-STOP TRANSIT & DISTANCE CONNECTOR RIBBON */}
                    {nextStop && (
                      <div className="my-3 py-2 px-3.5 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 flex flex-wrap items-center justify-between text-[11px] font-mono-telemetry text-cyan-300 gap-2">
                        <div className="flex items-center space-x-2">
                          <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            Next Stop ({stopIdx + 2}): <strong>{nextStop.distanceFromPrev || `${nextStop.distanceKm || 1.8} km`}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-slate-300">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{nextStop.transitTime || `~${nextStop.transitMins || 15} mins`}</span>
                          <span className="px-2 py-0.5 rounded-md bg-black/60 text-[9px] uppercase font-bold text-cyan-300 border border-cyan-500/30">
                            {nextStop.transitMode || 'Pedestrian / Transit'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: GIS Leaflet Map & Interactive Packing Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Leaflet GIS Map */}
          <div className="glass-aetheria rounded-3xl overflow-hidden border border-cyan-500/30 p-2 shadow-2xl">
            <div className="p-3 pb-2 flex items-center justify-between border-b border-aetheria-border mb-2">
              <span className="text-xs font-bold font-display uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Interactive Map &amp; Route</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono-telemetry">
                Day {currentDay.dayNumber || activeDayIndex + 1} • {stops.length} Stops Mapped
              </span>
            </div>

            <ItineraryMap
              stops={stops}
              destinationName={itinerary.destinationName}
            />
          </div>

          {/* Day Route Traversal Summary Card */}
          <div className="glass-aetheria p-5 rounded-3xl border border-aetheria-border space-y-3 font-mono-telemetry text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                Day Route Overview
              </span>
              <span className="text-slate-400 text-[11px] font-bold">
                {stops.length} Total Stops
              </span>
            </div>

            <div className="space-y-2">
              {stops.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center space-x-2 truncate max-w-[210px]">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-white truncate font-medium font-sans">
                      {s.place || s.name}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">
                    {s.distanceFromPrev ? s.distanceFromPrev.split(' from')[0] : `${s.distanceKm || 0} km`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Packing & Essentials Checklist */}
          {itinerary.packingAdvice && itinerary.packingAdvice.length > 0 && (
            <div className="glass-aetheria p-6 rounded-3xl border border-aetheria-border space-y-3">
              <div className="flex items-center space-x-2">
                <Luggage className="w-4 h-4 text-emerald-400" />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Packing Checklist
                </h4>
              </div>

              <div className="space-y-2">
                {itinerary.packingAdvice.map((tip, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 text-xs ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300 line-through opacity-70'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-200 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="mt-0.5 text-cyan-400 shrink-0">
                        {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
                      </span>
                      <span className="leading-snug">{tip}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
