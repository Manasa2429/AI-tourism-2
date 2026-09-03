package com.designtravel.controller;

import com.designtravel.dto.ChatRequest;
import com.designtravel.dto.ChatResponse;
import com.designtravel.dto.ItineraryRequest;
import com.designtravel.exception.ResourceNotFoundException;
import com.designtravel.model.Itinerary;
import com.designtravel.repository.ItineraryRepository;
import com.designtravel.service.GeminiAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AiTravelController {

    private final GeminiAiService geminiAiService;
    private final ItineraryRepository itineraryRepository;

    public AiTravelController(GeminiAiService geminiAiService, ItineraryRepository itineraryRepository) {
        this.geminiAiService = geminiAiService;
        this.itineraryRepository = itineraryRepository;
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(geminiAiService.chat(request));
    }

    @PostMapping("/ai/itinerary")
    public ResponseEntity<Itinerary> generateItinerary(@Valid @RequestBody ItineraryRequest request) {
        Itinerary itinerary = geminiAiService.generateItinerary(request);
        Itinerary saved = itineraryRepository.save(itinerary);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/itineraries")
    public ResponseEntity<List<Itinerary>> getRecentItineraries() {
        return ResponseEntity.ok(itineraryRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/itineraries/{id}")
    public ResponseEntity<Itinerary> getItineraryById(@PathVariable String id) {
        return ResponseEntity.ok(itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id)));
    }
}
