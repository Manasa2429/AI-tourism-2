package com.designtravel.service;

import com.designtravel.dto.DestinationDetailDto;
import com.designtravel.dto.ImageDto;
import com.designtravel.dto.WeatherDto;
import com.designtravel.model.Destination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Advanced Java 21 Asynchronous Aggregator Service
 * Uses CompletableFuture to parallelize MongoDB, OpenWeather, and Unsplash operations.
 */
@Service
public class DestinationAggregatorService {

    private static final Logger log = LoggerFactory.getLogger(DestinationAggregatorService.class);

    private final DestinationService destinationService;
    private final WeatherService weatherService;
    private final ImageService imageService;

    public DestinationAggregatorService(
            DestinationService destinationService,
            WeatherService weatherService,
            ImageService imageService
    ) {
        this.destinationService = destinationService;
        this.weatherService = weatherService;
        this.imageService = imageService;
    }

    public CompletableFuture<DestinationDetailDto> getAggregatedDestination(String id) {
        // Step 1: Retrieve Destination document asynchronously
        return CompletableFuture.supplyAsync(() -> destinationService.getDestinationById(id))
                .thenCompose(destination -> {
                    // Step 2: Concurrently query real-time weather and dynamic Unsplash images
                    CompletableFuture<WeatherDto> weatherFuture = CompletableFuture.supplyAsync(() ->
                            weatherService.getWeather(destination.getLatitude(), destination.getLongitude(), destination.getName())
                    ).exceptionally(ex -> {
                        log.warn("Weather fetch failed asynchronously: {}", ex.getMessage());
                        return null;
                    });

                    CompletableFuture<List<ImageDto>> imagesFuture = CompletableFuture.supplyAsync(() ->
                            imageService.searchPhotos(destination.getName() + " " + destination.getCountry() + " architecture", 8)
                    ).exceptionally(ex -> {
                        log.warn("Images fetch failed asynchronously: {}", ex.getMessage());
                        return List.of();
                    });

                    // Step 3: Combine both asynchronous futures into unified DTO
                    return weatherFuture.thenCombine(imagesFuture, (weather, images) ->
                            new DestinationDetailDto(destination, weather, images)
                    );
                });
    }
}
