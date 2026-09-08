import React from 'react';
import { Star, MapPin, Bookmark, Landmark, ArrowUpRight, Sparkles } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useSavedTrips } from '../../context/SavedTripsContext';

export default function DestinationCard({ destination, onSelect }) {
  const { getDistanceTo } = useLocation();
  const { isFavorite, toggleFavorite } = useSavedTrips();

  const distance = getDistanceTo(destination.latitude, destination.longitude);
  const favorited = isFavorite(destination.id);

  return (
    <article
      onClick={() => onSelect(destination)}
      className="group cursor-pointer rounded-3xl overflow-hidden glass-aetheria-interactive flex flex-col justify-between"
    >
      {/* Visual Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-900">
        <img
          src={destination.coverImageUrl}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-aetheria-obsidian via-aetheria-obsidian/30 to-black/40" />

        {/* Top Badges: Continent & Bookmark */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xl text-slate-200 border border-white/10 shadow-lg font-mono-telemetry">
            {destination.continent}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(destination);
            }}
            className={`p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
              favorited
                ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 border-cyan-400 shadow-cyan-400/30 scale-105'
                : 'bg-black/50 text-white hover:text-cyan-400 border-white/15 hover:bg-black/70'
            }`}
            title={favorited ? 'Remove from saved' : 'Save destination'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Hero Info: Country & Name */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block font-mono-telemetry">
              {destination.country}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              {destination.name}
            </h3>
          </div>

          {distance !== null && (
            <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono-telemetry font-bold text-cyan-300 flex items-center space-x-1 shadow-lg">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{distance.toLocaleString()} km</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-3.5 font-light">
            {destination.tagline || destination.description}
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 font-mono-telemetry">
            {destination.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06] font-medium"
              >
                {tag}
              </span>
            ))}
            {destination.avgDailyBudgetUSD && (
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                ~${destination.avgDailyBudgetUSD}/day
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Rating, Places count, and View Action */}
        <div className="pt-4 border-t border-aetheria-border flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-1 text-emerald-400">
              <Star className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span className="font-bold text-slate-200 font-mono-telemetry">{destination.rating || 4.9}</span>
            </div>
            {destination.places?.length > 0 && (
              <div className="flex items-center space-x-1 text-slate-400">
                <Landmark className="w-3.5 h-3.5 text-cyan-400/80" />
                <span className="text-[11px] font-mono-telemetry">{destination.places.length} Places</span>
              </div>
            )}
          </div>

          <span className="text-cyan-400 font-display font-bold text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
