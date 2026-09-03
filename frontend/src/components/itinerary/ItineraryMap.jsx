import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Maximize2, Minimize2, Radio, Compass, ExternalLink, Clock, Footprints } from 'lucide-react';

export default function ItineraryMap({ stops = [], destinationName = '' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  const validStops = stops.filter(
    (s) => s.latitude != null && s.longitude != null && !isNaN(s.latitude) && !isNaN(s.longitude)
  );

  useEffect(() => {
    if (!mapContainerRef.current || typeof window.L === 'undefined') return;

    if (!mapInstanceRef.current) {
      const initialLat = validStops.length > 0 ? validStops[0].latitude : 35.0116;
      const initialLng = validStops.length > 0 ? validStops[0].longitude : 135.7681;

      const map = window.L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      window.L.control.zoom({ position: 'topright' }).addTo(map);

      // High-contrast Dark GIS Tiles
      window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          subdomains: ['server', 'services'],
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers & lines
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (validStops.length > 0) {
      const latlngs = [];

      validStops.forEach((stop, idx) => {
        const latlng = [stop.latitude, stop.longitude];
        latlngs.push(latlng);

        const stopNum = stop.stopNumber || idx + 1;
        const distStr = stop.distanceFromPrev || (idx === 0 ? "Departure Origin" : `${stop.distanceKm || 1.5} km`);
        const transitStr = stop.transitTime || (idx === 0 ? "Start" : `~${stop.transitMins || 15} min`);

        // Custom Glowing Cyan Numbered Marker
        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: #030712;
            border: 2px solid #00f2fe;
            box-shadow: 0 0 16px rgba(0, 242, 254, 0.7);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span>${stopNum}</span>
          </div>
        `;

        const customIcon = window.L.divIcon({
          html: iconHtml,
          className: 'custom-aetheria-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const popupContent = `
          <div style="
            background: #060e1a;
            color: #f1f5f9;
            padding: 12px;
            border-radius: 14px;
            font-family: 'Outfit', sans-serif;
            border: 1px solid rgba(0, 242, 254, 0.3);
            max-width: 240px;
          ">
            <div style="color: #00f2fe; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace;">
              Stop ${stopNum} • ${stop.timeSlot || 'Day Stop'}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #ffffff; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">
              ${stop.place || stop.name}
            </div>
            <div style="font-size: 11px; color: #34d399; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace;">
              ⏱️ ${stop.duration || '2 Hours'} • 📍 ${distStr}
            </div>
            <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
              ${stop.famousFor ? stop.famousFor.substring(0, 90) + '...' : (stop.description || stop.activity || '')}
            </div>
          </div>
        `;

        const marker = window.L.marker(latlng, { icon: customIcon })
          .bindPopup(popupContent, {
            className: 'aetheria-leaflet-popup',
            closeButton: false,
          })
          .addTo(map);

        marker.on('click', () => {
          setSelectedStop({ ...stop, stopNumber: stopNum });
        });

        markersRef.current.push(marker);
      });

      // Connecting Polyline in Cyan & Emerald glow
      if (latlngs.length > 1) {
        polylineRef.current = window.L.polyline(latlngs, {
          color: '#00f2fe',
          weight: 3,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round',
        }).addTo(map);
      }

      // Auto-fit bounds
      if (latlngs.length > 0) {
        const bounds = window.L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  }, [validStops.length, stops]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 rounded-3xl overflow-hidden shadow-2xl border border-cyan-400/50 bg-black/95 backdrop-blur-2xl'
          : 'h-96 w-full rounded-2xl overflow-hidden'
      }`}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Controls Floating Island */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center space-x-2">
        <div className="px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono-telemetry font-bold text-cyan-300 flex items-center space-x-1.5 shadow-lg">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>{validStops.length} Waypoints Mapped</span>
        </div>
      </div>

      <div className="absolute top-3 right-12 z-[1000]">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-black/85 hover:bg-cyan-500 hover:text-slate-950 text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Selected Stop Preview Floating Card with Full Distance & Time */}
      {selectedStop && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] p-4 rounded-2xl bg-aetheria-obsidian/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl animate-slide-up max-w-md mx-auto space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 text-xs font-mono-telemetry font-bold flex items-center justify-center shrink-0">
                {selectedStop.stopNumber}
              </span>
              <div>
                <h5 className="font-display font-bold text-sm text-white">
                  {selectedStop.place || selectedStop.name}
                </h5>
                <p className="text-[10px] text-cyan-400 font-mono-telemetry uppercase">
                  {selectedStop.locationName || destinationName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStop(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Time, Distance, and Duration Chips */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono-telemetry pt-1">
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-slate-200">
              ⏰ {selectedStop.timeSlot || 'Day Stop'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
              ⏱️ {selectedStop.duration || '2 Hours'}
            </span>
            {selectedStop.distanceFromPrev && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                📍 {selectedStop.distanceFromPrev}
              </span>
            )}
            {selectedStop.transitTime && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-slate-300">
                🚶 {selectedStop.transitTime}
              </span>
            )}
          </div>

          {selectedStop.famousFor && (
            <p className="text-xs text-emerald-200/90 font-light line-clamp-2 pt-1">
              <strong className="text-emerald-300 font-medium">Famous For: </strong>
              {selectedStop.famousFor}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
