import React from 'react';
import { Compass, Sparkles, Heart, Globe, ArrowUp, Radio } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-aetheria-border bg-aetheria-void text-slate-400 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45rem] h-[15rem] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-4 h-4 text-slate-950 stroke-[2.4]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="12" />
                <polyline points="2 8.5 12 12 22 8.5" />
              </svg>
            </div>
            <span className="font-display tracking-[0.25em] text-xl font-extrabold text-white">
              AETHERIA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed max-w-md font-light">
            Autonomous planetary expedition intelligence. Synthesizing spatial geocoding, real-time microclimate streams, and Google Gemini reasoning into verified day-by-day itineraries.
          </p>
          <div className="flex flex-wrap gap-2 pt-2 font-mono-telemetry">
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold">
              React 18 + Vite
            </span>
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold">
              Tailwind CSS
            </span>
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-semibold">
              Google Gemini 3.5
            </span>
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold">
              Leaflet Dark GIS
            </span>
          </div>
        </div>

        {/* Curated Navigation */}
        <div>
          <h4 className="text-xs uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#destinations" className="text-slate-300 hover:text-white transition-colors">Sanctuaries Archive</a></li>
            <li><a href="#places" className="text-slate-300 hover:text-white transition-colors">Notable Landmarks</a></li>
            <li><a href="#itinerary" className="text-slate-300 hover:text-white transition-colors">AI Expedition Studio</a></li>
            <li><a href="#" onClick={scrollToTop} className="text-slate-300 hover:text-white transition-colors">Return to Top</a></li>
          </ul>
        </div>

        {/* Architecture & Verification */}
        <div>
          <h4 className="text-xs uppercase font-mono-telemetry tracking-widest text-emerald-400 font-bold mb-4">
            System Pillars
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-light">
            <li>• Strict Anti-Hallucination Guardrails</li>
            <li>• Verified Real-World Coordinates</li>
            <li>• Looping Aurora & Planetary Cinematics</li>
            <li>• Haversine Distance Spherical Vectors</li>
            <li>• Resilient Fallbacks for Standalone Mode</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-aetheria-border flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 relative z-10 font-mono-telemetry">
        <p>© 2026 AETHERIA Planetary Intelligence. All Rights Reserved.</p>
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-1.5 mt-3 sm:mt-0 text-slate-400 hover:text-cyan-400 transition-colors text-xs font-medium cursor-pointer"
        >
          <span>Return to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
