import React, { useState, useEffect } from 'react';
import { Clock, Ticket, Star, Sparkles, Plus, Check } from 'lucide-react';
import { imageService } from '../../services/api';

function LandmarkCard({ place, destinationName, onAddToPlanner }) {
  const [photo, setPhoto] = useState(place.imageUrl);

  useEffect(() => {
    if (!place.imageUrl || place.imageUrl.includes('photo-1488646953014-85cb44e25828')) {
      imageService.fetchPlacePhoto(place.name, destinationName).then((realUrl) => {
        if (realUrl) setPhoto(realUrl);
      });
    }
  }, [place.name, destinationName, place.imageUrl]);

  const handleImageError = () => {
    imageService.fetchPlacePhoto(place.name, destinationName).then((realUrl) => {
      if (realUrl) setPhoto(realUrl);
      else setPhoto("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80");
    });
  };

  return (
    <div
      className="rounded-3xl overflow-hidden glass-aetheria border border-aetheria-border hover:border-cyan-400/40 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/10"
    >
      {/* Landmark Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-800">
        <img
          src={photo || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
          alt={place.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aetheria-obsidian via-transparent to-black/30" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase font-mono-telemetry tracking-wider font-bold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
          {place.category || 'Landmark'}
        </span>

        {/* Rating */}
        {place.rating && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white flex items-center space-x-1 border border-white/10 font-mono-telemetry">
            <Star className="w-3 h-3 text-emerald-400 fill-current" />
            <span>{place.rating}</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="font-display text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            {place.name}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3.5 font-light">
            {place.description}
          </p>

          {/* Practical Information Pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono-telemetry">
            {place.entryFee && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] truncate">
                <Ticket className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate font-medium">{place.entryFee}</span>
              </div>
            )}
            {place.openingHours && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] truncate">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-medium">{place.openingHours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Insider Tip & Action */}
        <div className="pt-3 border-t border-aetheria-border flex items-center justify-between">
          {place.bestTimeToVisit ? (
            <span className="text-[10px] text-cyan-300/90 italic truncate max-w-[210px] font-medium font-mono-telemetry">
              Tip: {place.bestTimeToVisit}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-mono-telemetry">Attraction</span>
          )}

          {onAddToPlanner && (
            <button
              onClick={() => onAddToPlanner(place)}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs transition-all flex items-center space-x-1 border border-cyan-500/30 font-display font-bold cursor-pointer"
              title="Include in custom itinerary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[10px]">Add to Trip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FamousPlacesGrid({ places = [], destinationName = '', onAddToPlanner }) {
  if (!places || places.length === 0) {
    return (
      <div className="p-8 text-center glass-aetheria rounded-3xl border border-aetheria-border text-slate-400 text-sm font-light">
        No specific landmarks cataloged for this destination yet.
      </div>
    );
  }

  return (
    <div id="places" className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-aetheria-border">
        <div>
          <span className="text-[10px] uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold block mb-1">
            03 / Top Attractions
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Famous Places &amp; Landmarks
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono-telemetry">
          {places.length} Attractions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <LandmarkCard
            key={place.id || place.name}
            place={place}
            destinationName={destinationName}
            onAddToPlanner={onAddToPlanner}
          />
        ))}
      </div>
    </div>
  );
}
