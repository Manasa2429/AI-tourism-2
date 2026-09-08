import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Ticket, Star, Sparkles, Plus, Check, ArrowRight } from 'lucide-react';
import { imageService } from '../../services/api';

function NearbyPlaceCard({ place, destinationName, onSelectNearbyPlace }) {
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
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-800">
        <img
          src={photo || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
          alt={place.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aetheria-obsidian via-transparent to-black/30" />

        {/* Distance & Travel Time Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold font-mono-telemetry bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5 shadow-lg">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{place.distance || `${place.distanceKm || 30} km away`}</span>
          {place.travelTime && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200 font-medium">{place.travelTime}</span>
            </>
          )}
        </div>

        {/* Rating */}
        {place.rating && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/80 backdrop-blur-md text-white flex items-center space-x-1 border border-white/10 font-mono-telemetry">
            <Star className="w-3 h-3 text-emerald-400 fill-current" />
            <span>{place.rating}</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono-telemetry">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
              {place.category || 'Day Trip'}
            </span>
            {place.entryFee && (
              <span className="text-xs font-semibold text-slate-300">
                {place.entryFee}
              </span>
            )}
          </div>

          <h4 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
            {place.name}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light">
            {place.description}
          </p>
        </div>

        {/* Action */}
        <div className="pt-3 border-t border-aetheria-border flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono-telemetry">
            {place.bestTimeToVisit ? `Best: ${place.bestTimeToVisit}` : 'Day trip'}
          </span>

          <button
            onClick={() => onSelectNearbyPlace(place)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-emerald-500/30 hover:from-cyan-500 hover:to-emerald-400 hover:text-slate-950 text-cyan-200 font-display font-bold text-xs transition-all flex items-center space-x-1.5 border border-cyan-400/40 cursor-pointer shadow-md shadow-cyan-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NearbyFamousPlaces({ nearbyPlaces = [], destinationName, onSelectNearbyPlace }) {
  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    return null;
  }

  return (
    <div id="nearby-places" className="space-y-6 pt-8 border-t border-aetheria-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>04 / Nearby Places to Visit</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Popular Places Near {destinationName}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono-telemetry">
          {nearbyPlaces.length} Places Nearby
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
        Popular attractions, scenic viewpoints, and day trips near {destinationName}. Add them directly to your custom itinerary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyPlaces.map((place) => (
          <NearbyPlaceCard
            key={place.id || place.name}
            place={place}
            destinationName={destinationName}
            onSelectNearbyPlace={onSelectNearbyPlace}
          />
        ))}
      </div>
    </div>
  );
}
