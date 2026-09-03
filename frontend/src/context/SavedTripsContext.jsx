import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedTripsContext = createContext();

export function SavedTripsProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('design_travel_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedItineraries, setSavedItineraries] = useState(() => {
    try {
      const saved = localStorage.getItem('design_travel_itineraries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('design_travel_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('design_travel_itineraries', JSON.stringify(savedItineraries));
    } catch (e) {
      console.error(e);
    }
  }, [savedItineraries]);

  const toggleFavorite = (destination) => {
    setFavorites((prev) => {
      const exists = prev.some((d) => d.id === destination.id);
      if (exists) {
        return prev.filter((d) => d.id !== destination.id);
      } else {
        return [...prev, destination];
      }
    });
  };

  const isFavorite = (id) => favorites.some((d) => d.id === id);

  const saveItinerary = (itinerary) => {
    setSavedItineraries((prev) => [itinerary, ...prev.filter((i) => i.id !== itinerary.id)]);
  };

  return (
    <SavedTripsContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        savedItineraries,
        saveItinerary,
      }}
    >
      {children}
    </SavedTripsContext.Provider>
  );
}

export function useSavedTrips() {
  const context = useContext(SavedTripsContext);
  if (!context) {
    throw new Error('useSavedTrips must be used within a SavedTripsProvider');
  }
  return context;
}
