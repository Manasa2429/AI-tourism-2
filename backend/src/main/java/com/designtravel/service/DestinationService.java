package com.designtravel.service;

import com.designtravel.exception.ResourceNotFoundException;
import com.designtravel.model.Destination;
import com.designtravel.repository.DestinationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final GeminiAiService geminiAiService;
    private final ImageService imageService;

    public DestinationService(
            DestinationRepository destinationRepository,
            @org.springframework.context.annotation.Lazy GeminiAiService geminiAiService,
            @org.springframework.context.annotation.Lazy ImageService imageService
    ) {
        this.destinationRepository = destinationRepository;
        this.geminiAiService = geminiAiService;
        this.imageService = imageService;
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    /**
     * Search ANY place in the world: returns from DB or dynamically generates and saves to DB
     */
    public Destination discoverOrGenerateDestination(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query cannot be blank");
        }

        String q = query.trim().toLowerCase();

        // 1. Generate via AI Geographer directly on-the-fly (Stateless real-time discovery)
        Destination generated = geminiAiService != null
                ? geminiAiService.generateDestinationMetadata(query)
                : Destination.builder().name(query).country("Global").continent("Asia").build();

        // 2. Attach Dynamic Unsplash Photos
        if (imageService != null) {
            try {
                List<com.designtravel.dto.ImageDto> photos = imageService.searchPhotos(generated.getName() + " travel landscape architecture", 6);
                if (!photos.isEmpty()) {
                    generated.setCoverImageUrl(photos.get(0).urlRegular());
                    for (int i = 0; i < generated.getPlaces().size(); i++) {
                        if (i + 1 < photos.size()) {
                            generated.getPlaces().get(i).setImageUrl(photos.get(i + 1).urlRegular());
                        }
                    }
                }
            } catch (Exception ex) {
                // Fallback photo preserved
            }
        }

        if (generated.getCoverImageUrl() == null || generated.getCoverImageUrl().isBlank()) {
            generated.setCoverImageUrl("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85");
        }

        // Set GeoJsonPoint location
        generated.setLocation(new org.springframework.data.mongodb.core.geo.GeoJsonPoint(generated.getLongitude(), generated.getLatitude()));

        // 3. Return directly in-memory - DO NOT persist each search into MongoDB
        return generated;
    }

    public Destination getDestinationById(String id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    public Page<Destination> searchAndFilter(
            String keyword,
            String continent,
            String tag,
            Integer maxBudget,
            Pageable pageable
    ) {
        List<Destination> all = destinationRepository.findAll();

        // Advanced Java Streams pipeline with filters
        List<Destination> filtered = all.stream()
                .filter(d -> {
                    if (keyword == null || keyword.isBlank()) return true;
                    String k = keyword.toLowerCase();
                    return d.getName().toLowerCase().contains(k)
                            || d.getCountry().toLowerCase().contains(k)
                            || (d.getDescription() != null && d.getDescription().toLowerCase().contains(k))
                            || (d.getTags() != null && d.getTags().stream().anyMatch(t -> t.toLowerCase().contains(k)));
                })
                .filter(d -> {
                    if (continent == null || continent.isBlank() || continent.equalsIgnoreCase("all")) return true;
                    return d.getContinent().equalsIgnoreCase(continent);
                })
                .filter(d -> {
                    if (tag == null || tag.isBlank() || tag.equalsIgnoreCase("all")) return true;
                    return d.getTags().stream().anyMatch(t -> t.equalsIgnoreCase(tag));
                })
                .filter(d -> {
                    if (maxBudget == null || maxBudget <= 0) return true;
                    return d.getAvgDailyBudgetUSD() <= maxBudget;
                })
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<Destination> pageContent = (start <= end) ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    /**
     * Location-aware: Finds destinations sorted by geographic proximity to user's coordinates
     */
    public List<DestinationWithDistance> findNearby(double userLat, double userLng, int limit) {
        List<Destination> all = destinationRepository.findAll();

        return all.stream()
                .map(d -> {
                    double distKm = calculateHaversineDistance(userLat, userLng, d.getLatitude(), d.getLongitude());
                    return new DestinationWithDistance(d, Math.round(distKm * 10.0) / 10.0);
                })
                .sorted(Comparator.comparingDouble(DestinationWithDistance::distanceKm))
                .limit(limit > 0 ? limit : 6)
                .toList();
    }

    public record DestinationWithDistance(Destination destination, double distanceKm) {}

    /**
     * Haversine formula for exact distance between two coordinates in kilometers
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
