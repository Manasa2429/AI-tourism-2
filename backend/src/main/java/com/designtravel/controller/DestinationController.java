package com.designtravel.controller;

import com.designtravel.dto.DestinationDetailDto;
import com.designtravel.model.Destination;
import com.designtravel.service.DestinationAggregatorService;
import com.designtravel.service.DestinationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;
    private final DestinationAggregatorService destinationAggregatorService;

    public DestinationController(
            DestinationService destinationService,
            DestinationAggregatorService destinationAggregatorService
    ) {
        this.destinationService = destinationService;
        this.destinationAggregatorService = destinationAggregatorService;
    }

    @GetMapping
    public ResponseEntity<Page<Destination>> getDestinations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String continent,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Integer maxBudget,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(destinationService.searchAndFilter(keyword, continent, tag, maxBudget, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable String id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    @GetMapping("/{id}/aggregate")
    public CompletableFuture<ResponseEntity<DestinationDetailDto>> getAggregatedDetails(@PathVariable String id) {
        return destinationAggregatorService.getAggregatedDestination(id)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<DestinationService.DestinationWithDistance>> getNearbyDestinations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "6") int limit
    ) {
        return ResponseEntity.ok(destinationService.findNearby(lat, lng, limit));
    }

    /**
     * Search & Discover ANY place in the world on demand
     */
    @GetMapping("/discover")
    public ResponseEntity<Destination> discoverDestination(@RequestParam String query) {
        return ResponseEntity.ok(destinationService.discoverOrGenerateDestination(query));
    }
}
