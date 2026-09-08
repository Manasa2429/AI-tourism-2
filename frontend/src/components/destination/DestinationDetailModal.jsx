import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, DollarSign, Globe, Star, Sparkles, Bookmark, Share2, Compass, Radio } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import FamousPlacesGrid from './FamousPlacesGrid';
import NearbyFamousPlaces from './NearbyFamousPlaces';
import PhotoGallery from './PhotoGallery';
import { useLocation } from '../../context/LocationContext';
import { useSavedTrips } from '../../context/SavedTripsContext';
import { getNearbyFamousPlaces, fetchRealNearbyPlaces } from '../../services/api';

export default function DestinationDetailModal({ destination, onClose, onOpenPlannerWithDest }) {
  const { getDistanceTo } = useLocation();
  const { isFavorite, toggleFavorite } = useSavedTrips();

  const [activeNearby, setActiveNearby] = useState(() => {
    return destination?.nearbyPlaces && destination.nearbyPlaces.length > 0
      ? destination.nearbyPlaces
      : getNearbyFamousPlaces(destination?.name);
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initial = destination?.nearbyPlaces && destination.nearbyPlaces.length > 0
      ? destination.nearbyPlaces
      : getNearbyFamousPlaces(destination?.name);

    if (initial && initial.length > 0) {
      setActiveNearby(initial);
    } else if (destination?.latitude && destination?.longitude) {
      fetchRealNearbyPlaces(destination.latitude, destination.longitude, destination.name).then(places => {
        if (isMounted && places && places.length > 0) {
          setActiveNearby(places);
        }
      });
    }
    return () => { isMounted = false; };
  }, [destination]);

  if (!destination) return null;

  const distance = getDistanceTo(destination.latitude, destination.longitude);
  const favorited = isFavorite(destination.id);
  const nearbyPlaces = activeNearby;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl overflow-y-auto flex justify-center p-2 sm:p-6 animate-fade-in">
      <div className="glass-aetheria w-full max-w-5xl rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl relative my-auto bg-aetheria-obsidian">
        {/* Floating Top Header Navigation */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-aetheria-obsidian/85 backdrop-blur-2xl border-b border-aetheria-border">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold">
              {destination.country}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-medium font-mono-telemetry">
              {destination.continent}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(destination)}
              className={`p-2.5 rounded-full border transition-all ${
                favorited
                  ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/30'
                  : 'bg-white/[0.04] border-white/10 text-slate-200 hover:text-cyan-400 hover:bg-white/[0.08]'
              }`}
              title={favorited ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white transition-colors border border-white/10"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Panorama with High-Res Photography */}
        <div className="relative h-80 sm:h-[26rem] w-full bg-slate-900 overflow-hidden">
          <img
            src={destination.coverImageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aetheria-obsidian via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/40 shadow-lg font-mono-telemetry">
                  <Star className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>{destination.rating || 4.9}</span>
                  <span className="text-slate-400 font-normal">({destination.reviewCount || 3100} reviews)</span>
                </div>
                {distance !== null && (
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-cyan-300 border border-cyan-500/30 shadow-lg font-mono-telemetry">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{distance.toLocaleString()} km from origin</span>
                  </div>
                )}
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                {destination.name}
              </h1>
              <p className="text-slate-200/90 text-sm sm:text-base italic max-w-xl mt-1.5 font-light">
                "{destination.tagline || destination.description}"
              </p>
            </div>

            {/* Launch AI Voyage Planner CTA */}
            <button
              onClick={() => onOpenPlannerWithDest({ ...destination, nearbyPlaces })}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider hover:shadow-xl hover:shadow-cyan-400/30 hover:scale-[1.02] transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize AI Blueprint</span>
            </button>
          </div>
        </div>

        {/* Detail Content Body */}
        <div className="p-6 sm:p-10 space-y-12">
          {/* Quick Travel Essentials Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-aetheria-border backdrop-blur-md">
              <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-mono-telemetry tracking-wider mb-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Prime Season</span>
              </div>
              <div className="font-bold text-sm text-white font-display">
                {destination.bestSeason || 'Spring & Autumn'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-aetheria-border backdrop-blur-md">
              <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-mono-telemetry tracking-wider mb-1 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Budget</span>
              </div>
              <div className="font-bold text-sm text-white font-display">
                ${destination.avgDailyBudgetUSD || 150} USD / day
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-aetheria-border backdrop-blur-md">
              <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-mono-telemetry tracking-wider mb-1 font-semibold">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dialect & Currency</span>
              </div>
              <div className="font-bold text-sm text-white font-display">
                {destination.language || 'Local'} • {destination.currency || 'USD'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-aetheria-border backdrop-blur-md">
              <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-mono-telemetry tracking-wider mb-1 font-semibold">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Coordinates</span>
              </div>
              <div className="font-bold text-xs text-cyan-300 font-mono-telemetry">
                {destination.latitude?.toFixed(2)}°N, {destination.longitude?.toFixed(2)}°E
              </div>
            </div>
          </div>

          {/* Description & Real-Time Weather Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-display text-2xl font-bold text-white">
                Sanctuary Overview
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-light">
                {destination.description}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono-telemetry">
                {destination.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] text-slate-300 border border-aetheria-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Real-Time Live Weather */}
            <div className="lg:col-span-1">
              <WeatherWidget destination={destination} />
            </div>
          </div>

          {/* Notable Places & Landmarks */}
          <FamousPlacesGrid
            places={destination.places}
            onAddToPlanner={() => onOpenPlannerWithDest({ ...destination, nearbyPlaces })}
          />

          {/* Nearby Famous Places & Day Excursions */}
          <NearbyFamousPlaces
            nearbyPlaces={nearbyPlaces}
            destinationName={destination.name}
            onSelectNearbyPlace={(place) =>
              onOpenPlannerWithDest({
                ...destination,
                nearbyPlaces,
                selectedNearbyPlace: place
              })
            }
          />

          {/* Curated Photography Gallery */}
          <PhotoGallery
            destination={{ ...destination, nearbyPlaces }}
            destinationName={destination.name}
          />
        </div>
      </div>
    </div>
  );
}
