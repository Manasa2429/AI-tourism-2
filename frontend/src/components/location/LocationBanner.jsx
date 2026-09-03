import React, { useState } from 'react';
import { MapPin, AlertCircle, CheckCircle2, Search, X, Navigation, Compass, Globe, Radio } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export default function LocationBanner() {
  const { coords, locationName, permissionStatus, loading, errorMsg, requestLocation, setManualLocation } = useLocation();
  const [showManualInput, setShowManualInput] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const popularCities = [
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  ];

  if (dismissed) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3">
      {/* 1. Denied State */}
      {permissionStatus === 'denied' && (
        <div className="glass-aetheria border border-coral-500/30 bg-coral-500/[0.04] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm shadow-xl shadow-black/40">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-coral-500/10 text-coral-400 shrink-0">
              <AlertCircle className="w-5 h-5 text-aurora-coral" />
            </div>
            <div>
              <p className="font-semibold text-coral-200 text-sm font-display">Orbital Radar Offline</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Select your origin hub manually to compute direct Haversine spherical flight vectors to each sanctuary.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {popularCities.slice(0, 3).map((city) => (
              <button
                key={city.name}
                onClick={() => setManualLocation(city.name, city.lat, city.lng)}
                className="px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-aetheria-border text-slate-200 transition-all font-medium font-mono-telemetry"
              >
                {city.name}
              </button>
            ))}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="px-3.5 py-1.5 text-xs rounded-xl border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 font-bold tracking-wide transition-all"
            >
              Select Station
            </button>
          </div>
        </div>
      )}

      {/* 2. Prompt State */}
      {permissionStatus === 'prompt' && !coords && (
        <div className="glass-aetheria border border-aetheria-border rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm shadow-xl shadow-black/40 animate-fade-in">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs sm:text-sm font-display">
                Enable Geolocation for Spatial Flight Telemetry
              </p>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5 font-light">
                Computes real-time great-circle orbital distances using Haversine spherical mathematics inside your browser.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={requestLocation}
              disabled={loading}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase hover:shadow-lg hover:shadow-cyan-400/20 transition-all shrink-0 font-display"
            >
              {loading ? 'Locating...' : 'Enable Radar'}
            </button>
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="px-3.5 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-aetheria-border text-xs text-slate-300 font-medium transition-colors shrink-0"
            >
              Pick Hub
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-slate-500 hover:text-slate-300 rounded-xl hover:bg-white/[0.05] transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Granted State */}
      {coords && (
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-cyan-500/[0.08] border border-cyan-500/25 text-xs text-cyan-300 max-w-fit mb-1 backdrop-blur-md shadow-lg shadow-cyan-950/20 animate-fade-in font-mono-telemetry">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span>
              Radar Telemetry: <strong className="text-white font-semibold font-sans">{locationName}</strong> ({coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°) • Orbital vectors locked
            </span>
          </div>
        </div>
      )}

      {/* Manual Input Grid */}
      {showManualInput && (
        <div className="mt-3 p-5 glass-aetheria rounded-3xl border border-cyan-500/30 animate-slide-up shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-telemetry flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Select Departure Station Hub</span>
            </span>
            <button
              onClick={() => setShowManualInput(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {popularCities.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setManualLocation(c.name, c.lat, c.lng);
                  setShowManualInput(false);
                }}
                className="p-3 text-left rounded-2xl bg-white/[0.03] hover:bg-cyan-500/15 hover:border-cyan-400/40 border border-aetheria-border transition-all group"
              >
                <div className="font-semibold text-xs text-white truncate group-hover:text-cyan-300 transition-colors">{c.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono-telemetry">Station Select</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
