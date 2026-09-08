import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  MapPin,
  Globe,
  CloudSun,
  Compass,
  ArrowDown,
  ArrowRight,
  Flame,
  X,
  Radio,
  Zap
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export default function HeroSection({ onSearchSubmit, onQuickExplore, onOpenAiPlanner }) {
  const [searchInput, setSearchInput] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { coords, requestLocation } = useLocation();

  // Safely autoplay video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch((err) => {
        console.warn('Autoplay waiting for user interaction:', err);
      });
    }
  }, []);

  // Aurora cyan & emerald bioluminescent stardust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      speedY: -(Math.random() * 0.35 + 0.1),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.25,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '0, 242, 254' : '16, 185, 129', // Cyan or Aurora Emerald
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += 0.02;

        if (p.y < 0) p.y = height + 10;
        if (p.x < 0) p.x = width + 10;
        if (p.x > width) p.x = -10;

        const dynamicAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${dynamicAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.6)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput);
      scrollToSection('destinations');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickPills = ["Kyoto", "Paris", "Banff", "Kedarnath", "Santorini", "Reykjavik", "Cape Town"];

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between overflow-hidden pt-28 pb-10">
      {/* 01: AETHERIA EMERALD & CYAN AURORA PLANETARY LOOP VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=85"
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
          }}
          className="w-full h-full object-cover cinematic-loop opacity-75 scale-105 transition-all duration-700"
        >
          {/* 1. Primary: High-Definition Emerald & Cyan Aurora Australis with Planetary Night Lights */}
          <source src="/videos/aurora-loop.mp4" type="video/mp4" />
          {/* 2. Direct Local Fallback */}
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          {/* 3. High-availability NASA SVS Stream */}
          <source src="https://svs.gsfc.nasa.gov/vis/a030000/a031200/a031281/ISS067_20220817_aurora_1080p25.mp4" type="video/mp4" />
          {/* 4. Planetary Earth Night Atmosphere */}
          <source src="https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005570/Earth_wAtmos_spin_02_1080p60.mp4" type="video/mp4" />
        </video>

        {/* Ambient Canvas Aurora Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
        />

        {/* Arctic Aurora Radiant Auras */}
        <div className="absolute -top-40 -left-40 w-[42rem] h-[42rem] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-[4]" />
        <div className="absolute -bottom-40 -right-40 w-[38rem] h-[38rem] bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none z-[4]" />

        {/* Atmospheric Mist & Vignette Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-aetheria-obsidian via-aetheria-obsidian/60 to-aetheria-obsidian/85 z-[2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-aetheria-obsidian/45 to-aetheria-obsidian z-[2]" />
      </div>

      {/* Top Status Capsule HUD */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-aetheria-obsidian/70 backdrop-blur-xl border border-cyan-500/25 text-xs text-slate-200 shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="font-mono-telemetry font-bold tracking-wider text-cyan-300 uppercase text-[10px]">
            Live Travel Planner
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium text-[11px]">AI-Powered</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2.5 text-xs text-slate-300 bg-aetheria-obsidian/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 font-mono-telemetry">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] tracking-wide">Real-Time Travel Guide</span>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto py-8">
        {/* Floating pill badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-6 shadow-2xl animate-fade-in font-mono-telemetry">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:9s]" />
          <span>Smart AI Travel Assistant</span>
        </div>

        {/* Modern Grand Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.06] mb-6 max-w-4xl animate-slide-up drop-shadow-2xl">
          Plan Your Next Adventure <br />
          <span className="aurora-gradient-text">with Intelligent AI.</span>
        </h1>

        <p className="text-slate-200/90 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10 text-balance drop-shadow-md">
          Discover top travel destinations worldwide, check live local weather forecasts, and generate custom day-by-day itineraries in seconds.
        </p>

        {/* Floating Search Dock (Expedition Radar) */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <form
            onSubmit={handleFormSubmit}
            className="glass-aetheria p-2 sm:p-2.5 rounded-2xl sm:rounded-full border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 hover:border-cyan-500/50"
          >
            <div className="flex items-center pl-4 w-full sm:w-auto flex-1 text-slate-300">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Kyoto shrines, Paris bistros, Reykjavik glaciers..."
                className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-0 font-sans"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1 mr-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 text-slate-950 font-display font-bold text-xs tracking-widest uppercase hover:shadow-xl hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Search Places</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Trending Destination Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 mb-8 font-mono-telemetry">
          <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trending:</span>
          </span>
          {quickPills.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSearchInput(city);
                onSearchSubmit(city);
                scrollToSection('destinations');
              }}
              className="px-3.5 py-1 rounded-full bg-white/[0.04] hover:bg-cyan-500/15 border border-aetheria-border text-slate-200 hover:text-cyan-300 hover:border-cyan-400/40 transition-all text-xs backdrop-blur-md"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => {
              onOpenAiPlanner();
              scrollToSection('itinerary');
            }}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-600/30 via-emerald-500/30 to-cyan-600/30 hover:from-cyan-600/40 hover:to-emerald-500/40 backdrop-blur-md border border-cyan-400/40 text-cyan-200 font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/15 hover:border-cyan-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Plan Trip with AI</span>
          </button>

          {!coords && (
            <button
              onClick={requestLocation}
              className="px-5 py-3.5 rounded-full bg-aetheria-surface/80 hover:bg-aetheria-surface text-slate-300 hover:text-white text-xs tracking-wider uppercase transition-all flex items-center space-x-2 border border-white/10 font-mono-telemetry"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Use My Location</span>
            </button>
          )}
        </div>
      </div>

      {/* Irresistible Scroll Teaser Dock */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-6 border-t border-aetheria-border bg-gradient-to-t from-aetheria-obsidian to-transparent">
          {/* Left: Included Modules */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-[10px] uppercase font-mono-telemetry tracking-widest text-slate-400 font-bold hidden lg:inline">
              Quick Explore:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => scrollToSection('destinations')}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-aetheria-border text-slate-200 transition-all hover:border-cyan-400/40 group cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">Top Destinations</span>
              </button>
              <button
                onClick={() => scrollToSection('destinations')}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-aetheria-border text-slate-200 transition-all hover:border-emerald-400/40 group cursor-pointer"
              >
                <CloudSun className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">Live Weather</span>
              </button>
              <button
                onClick={() => scrollToSection('itinerary')}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-aetheria-border text-slate-200 transition-all hover:border-cyan-300/40 group cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">AI Planner</span>
              </button>
            </div>
          </div>

          {/* Right: Scroll Prompter */}
          <button
            onClick={() => scrollToSection('destinations')}
            className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors group cursor-pointer"
          >
            <div className="text-right">
              <span className="text-[11px] tracking-[0.2em] uppercase font-display font-bold text-white block group-hover:text-cyan-300 transition-colors">
                Scroll to Explore
              </span>
              <span className="text-[10px] font-mono-telemetry text-slate-400">
                02 / Places &amp; Attractions
              </span>
            </div>

            <div className="relative w-6 h-10 rounded-full border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors flex items-start justify-center p-1 overflow-hidden shadow-lg shadow-cyan-400/10">
              <div className="w-1 h-2 rounded-full bg-cyan-400 scroll-beam-cyan" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
