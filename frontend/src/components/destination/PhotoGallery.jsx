import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { imageService } from '../../services/api';

export default function PhotoGallery({ destination, destinationName, initialImages = [] }) {
  const name = destinationName || destination?.name || 'Destination';
  const [filter, setFilter] = useState('all');
  const [apiImages, setApiImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  useEffect(() => {
    if (name) {
      fetchPhotos();
    }
  }, [name]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const photos = await imageService.searchPhotos(name, 8);
      if (photos && photos.length > 0) {
        setApiImages(photos);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const allPhotos = [];

  if (destination?.coverImageUrl) {
    allPhotos.push({
      id: 'photo-cover',
      url: destination.coverImageUrl,
      title: `${name} Panorama`,
      category: 'Destination Vista',
      tag: 'cover',
      badge: 'Featured View',
      photographer: 'Editorial Curated'
    });
  }

  if (destination?.places && destination.places.length > 0) {
    destination.places.forEach((p, idx) => {
      if (p.imageUrl) {
        allPhotos.push({
          id: `photo-place-${p.id || idx}`,
          url: p.imageUrl,
          title: p.name,
          category: p.category || 'Notable Landmark',
          tag: 'landmark',
          badge: 'Iconic Landmark',
          photographer: 'Curated Collection'
        });
      }
    });
  }

  if (destination?.nearbyPlaces && destination.nearbyPlaces.length > 0) {
    destination.nearbyPlaces.forEach((nb, idx) => {
      if (nb.imageUrl) {
        allPhotos.push({
          id: `photo-nearby-${nb.id || idx}`,
          url: nb.imageUrl,
          title: nb.name,
          category: `${nb.category || 'Excursion'} (${nb.distance || 'Nearby'})`,
          tag: 'nearby',
          badge: `Nearby (${nb.distance || 'Excursion'})`,
          photographer: 'Surrounding Sights'
        });
      }
    });
  }

  if (apiImages && apiImages.length > 0) {
    apiImages.forEach((img, idx) => {
      allPhotos.push({
        id: `photo-api-${img.id || idx}`,
        url: img.urlRegular || img,
        title: img.title || `${name} Scenic Atmosphere`,
        category: 'Scenery & Atmosphere',
        tag: 'scenery',
        badge: 'Atmospheric',
        photographer: img.photographerName || 'Authentic Photography'
      });
    });
  }

  const filteredPhotos = allPhotos.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'landmark') return p.tag === 'landmark' || p.tag === 'cover';
    if (filter === 'nearby') return p.tag === 'nearby';
    if (filter === 'scenery') return p.tag === 'scenery';
    return true;
  });

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    } else {
      setActivePhotoIndex(filteredPhotos.length - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (activePhotoIndex < filteredPhotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    } else {
      setActivePhotoIndex(0);
    }
  };

  return (
    <div id="all-photos" className="space-y-6 pt-8 border-t border-aetheria-border">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono-telemetry tracking-widest text-cyan-400 font-bold mb-1">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>05 / Photo Gallery</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Photos &amp; Scenic Views
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-aetheria-border text-xs backdrop-blur-md font-mono-telemetry">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({allPhotos.length})
          </button>
          <button
            onClick={() => setFilter('landmark')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filter === 'landmark'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Landmarks
          </button>
          <button
            onClick={() => setFilter('nearby')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filter === 'nearby'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nearby Trips
          </button>
          <button
            onClick={() => setFilter('scenery')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filter === 'scenery'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scenery
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
        Explore high-resolution photos of {name}, its top attractions, and nearby scenic landscapes. Click any image to view full screen.
      </p>

      {/* Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-aetheria-border hover:border-cyan-400/50 transition-all shadow-md"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                <div className="flex justify-end">
                  <span className="p-2 rounded-xl bg-black/70 text-white backdrop-blur-md border border-white/10">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono-telemetry font-bold text-cyan-400 tracking-wider">
                    {img.badge}
                  </span>
                  <h5 className="text-xs font-bold text-white line-clamp-1 font-display">
                    {img.title}
                  </h5>
                </div>
              </div>

              <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl text-[9px] font-bold bg-black/75 backdrop-blur-md text-slate-200 border border-white/10 group-hover:opacity-0 transition-opacity line-clamp-1 max-w-[85%] font-mono-telemetry">
                {img.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 font-mono-telemetry">No photos match the selected category.</p>
      )}

      {/* Fullscreen Lightbox */}
      {activePhoto && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-black/70 max-h-[78vh]">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-w-full max-h-[75vh] object-contain mx-auto"
              />

              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/75 hover:bg-cyan-500 hover:text-slate-950 text-white transition-all cursor-pointer border border-white/15 shadow-xl"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/75 hover:bg-cyan-500 hover:text-slate-950 text-white transition-all cursor-pointer border border-white/15 shadow-xl"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-3 right-3 p-2.5 rounded-2xl bg-black/75 text-white hover:bg-coral-500/80 transition-colors border border-white/15 cursor-pointer"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3.5 text-center space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs uppercase font-mono-telemetry tracking-widest font-bold text-cyan-400">
                  {activePhoto.badge}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-sm font-display font-bold text-white">
                  {activePhoto.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-telemetry">
                {activePhoto.category} • Image {activePhotoIndex + 1} of {filteredPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
