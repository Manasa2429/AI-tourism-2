import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HeroSection from './components/hero/HeroSection';
import LocationBanner from './components/location/LocationBanner';
import DestinationExplorer from './components/explorer/DestinationExplorer';
import DestinationDetailModal from './components/destination/DestinationDetailModal';
import ChatDrawer from './components/ai-chat/ChatDrawer';
import ItineraryPlanner from './components/itinerary/ItineraryPlanner';
import { LocationProvider } from './context/LocationContext';
import { SavedTripsProvider } from './context/SavedTripsContext';
import { Sparkles, MessageSquare } from 'lucide-react';

function TravelApp() {
  const [selectedDestination, setSelectedDestination] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_selected_dest');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isChatOpen, setIsChatOpen] = useState(() => {
    return localStorage.getItem('travel_chat_open') === 'true';
  });
  const [plannerDestination, setPlannerDestination] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_planner_dest');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Persist modal and chat state
  useEffect(() => {
    try {
      if (selectedDestination) {
        localStorage.setItem('travel_selected_dest', JSON.stringify(selectedDestination));
      } else {
        localStorage.removeItem('travel_selected_dest');
      }
      localStorage.setItem('travel_chat_open', isChatOpen ? 'true' : 'false');
    } catch {}
  }, [selectedDestination, isChatOpen]);

  // Maintain active section across browser refreshes
  useEffect(() => {
    const restoreActiveSection = () => {
      const hash = window.location.hash;
      const savedSection = localStorage.getItem('travel_current_section');
      const targetId = (hash && hash.length > 1) ? hash.replace('#', '') : savedSection;

      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    };

    restoreActiveSection();
    window.addEventListener('hashchange', restoreActiveSection);
    return () => window.removeEventListener('hashchange', restoreActiveSection);
  }, []);

  const handleHeroSearch = (query) => {
    setSearchQuery(query);
    window.location.hash = 'destinations';
    localStorage.setItem('travel_current_section', 'destinations');
    const element = document.getElementById('destinations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenPlanner = (dest = null) => {
    if (dest) {
      setPlannerDestination(dest);
      try {
        localStorage.setItem('travel_planner_dest', JSON.stringify(dest));
        if (dest.name) localStorage.setItem('travel_dest_name', dest.name);
      } catch {}
    }
    if (selectedDestination) {
      setSelectedDestination(null);
      localStorage.removeItem('travel_selected_dest');
    }
    window.location.hash = 'itinerary';
    localStorage.setItem('travel_current_section', 'itinerary');
    setTimeout(() => {
      const element = document.getElementById('itinerary');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  return (
    <div className="min-h-screen bg-aetheria-obsidian aurora-radial-bg text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950 font-sans">
      {/* Top Floating Navigation */}
      <Navbar
        onOpenItinerary={() => handleOpenPlanner()}
        onOpenChat={() => setIsChatOpen(true)}
        onSelectDestination={(dest) => {
          setSelectedDestination(dest);
          window.location.hash = 'destinations';
          localStorage.setItem('travel_current_section', 'destinations');
        }}
      />

      {/* Main Flow */}
      <main className="flex-1">
        {/* 01: Hero Cinematic Experience with Alpine Peaks Loop */}
        <HeroSection
          onSearchSubmit={handleHeroSearch}
          onQuickExplore={(city) => handleHeroSearch(city)}
          onOpenAiPlanner={() => handleOpenPlanner()}
        />

        {/* 04: Orbital Geolocation Telemetry Banner */}
        <LocationBanner />

        {/* 02: Destination Explorer with Continent & Vibe Filters */}
        <DestinationExplorer
          externalSearchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
        />

        {/* 08: AI Itinerary Planning Studio */}
        <ItineraryPlanner
          initialDestination={plannerDestination}
        />
      </main>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onOpenPlannerWithDest={(dest) => handleOpenPlanner(dest)}
        />
      )}

      {/* AI Concierge Slide-Out Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        destinationContext={selectedDestination}
        onOpenPlanner={() => handleOpenPlanner(selectedDestination)}
      />

      {/* Floating AI Concierge Action Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 text-slate-950 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2.5 font-display font-bold text-xs uppercase tracking-wider group border border-cyan-300/50 cursor-pointer"
        title="Open Aura AI Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
          <Sparkles className="relative w-3.5 h-3.5 text-slate-950" />
        </span>
        <span className="hidden sm:inline font-extrabold text-slate-950">Aura AI Assistant</span>
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <SavedTripsProvider>
        <TravelApp />
      </SavedTripsProvider>
    </LocationProvider>
  );
}
