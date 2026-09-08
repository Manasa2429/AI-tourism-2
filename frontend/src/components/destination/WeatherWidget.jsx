import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, RefreshCw, Sun, CloudRain } from 'lucide-react';
import { weatherService } from '../../services/api';

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('C');

  useEffect(() => {
    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await weatherService.getWeather({
        city: destination.name,
        lat: destination.latitude,
        lon: destination.longitude,
      });
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-aetheria p-6 rounded-3xl border border-aetheria-border animate-pulse flex items-center justify-between">
        <div className="space-y-2.5">
          <div className="w-28 h-4 bg-slate-700/50 rounded" />
          <div className="w-16 h-8 bg-slate-700/50 rounded" />
        </div>
        <div className="w-12 h-12 bg-slate-700/50 rounded-full" />
      </div>
    );
  }

  if (!weather) return null;

  const tempC = weather.tempC ?? weather.temperatureCelsius ?? 22;
  const tempF = weather.tempF ?? weather.temperatureFahrenheit ?? Math.round((tempC * 9) / 5 + 32);
  const feelsLikeC = weather.feelsLikeC ?? weather.feelsLikeCelsius ?? tempC;
  const displayTemp = unit === 'C' ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`;

  return (
    <div className="glass-aetheria p-6 rounded-3xl border border-cyan-500/30 relative overflow-hidden group shadow-xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-mono-telemetry font-bold px-3 py-1 rounded-full bg-emerald-500/[0.12] text-emerald-300 border border-emerald-500/25 flex items-center space-x-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Weather • {weather.sourceTimestamp ? `Updated ${weather.sourceTimestamp}` : 'Real-time Telemetry'}</span>
          </span>
          <button
            onClick={fetchWeather}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Refresh live weather"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* C/F Unit Toggle */}
        <div className="flex items-center bg-black/60 rounded-full p-0.5 border border-white/10 text-xs font-mono-telemetry">
          <button
            onClick={() => setUnit('C')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
              unit === 'C' ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
              unit === 'F' ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-3">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {displayTemp}
            </span>
            <span className="text-xs text-slate-400 font-mono-telemetry">
              Feels {unit === 'C' ? `${Math.round(feelsLikeC)}°C` : `${Math.round((feelsLikeC * 9) / 5 + 32)}°F`}
            </span>
          </div>
          <p className="text-sm font-semibold text-cyan-300 mt-1 capitalize flex items-center space-x-1.5">
            <span>{weather.description || weather.condition}</span>
          </p>
        </div>

        {/* Weather Icon */}
        <div className="relative">
          {weather.iconUrl ? (
            <img
              src={weather.iconUrl}
              alt={weather.condition}
              className="w-16 h-16 object-contain drop-shadow-xl"
            />
          ) : (
            <Cloud className="w-12 h-12 text-cyan-400" />
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mt-5 pt-4 border-t border-aetheria-border grid grid-cols-2 gap-4 text-xs text-slate-300 font-mono-telemetry">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <span>Humidity: <strong className="text-white font-sans">{weather.humidity}%</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>Wind: <strong className="text-white font-sans">{weather.windSpeedKmh} km/h</strong></span>
        </div>
      </div>
    </div>
  );
}
