package com.designtravel.service;

import com.designtravel.dto.ChatRequest;
import com.designtravel.dto.ChatResponse;
import com.designtravel.dto.ItineraryRequest;
import com.designtravel.dto.WeatherDto;
import com.designtravel.model.Itinerary;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ServiceFallbackTest {

    private WeatherService weatherService;
    private GeminiAiService geminiAiService;

    @BeforeEach
    void setUp() {
        RestClient restClient = RestClient.builder().build();
        ObjectMapper objectMapper = new ObjectMapper();
        weatherService = new WeatherService(restClient, objectMapper);
        geminiAiService = new GeminiAiService(restClient, objectMapper);
    }

    @Test
    void testWeatherFallbackProvidesRealisticMetrics() {
        WeatherDto weather = weatherService.getWeather(35.0116, 135.7681, "Kyoto");
        assertNotNull(weather);
        assertEquals("Kyoto", weather.city());
        assertTrue(weather.tempC() > -20 && weather.tempC() < 50);
        assertTrue(weather.humidity() >= 0 && weather.humidity() <= 100);
        assertNotNull(weather.condition());
        assertNotNull(weather.iconUrl());
    }

    @Test
    void testGeminiChatFallbackConcierge() {
        ChatRequest req = new ChatRequest("What is the best food to try?", "Kyoto, Japan", List.of());
        ChatResponse response = geminiAiService.chat(req);
        assertNotNull(response);
        assertNotNull(response.reply());
        assertFalse(response.reply().isBlank());
        assertFalse(response.suggestedFollowUps().isEmpty());
    }

    @Test
    void testProceduralItineraryGeneration() {
        ItineraryRequest req = new ItineraryRequest("Rome, Italy", 3, "Culture & History", "Moderate", List.of("Ancient History", "Food"), "Balanced");
        Itinerary itinerary = geminiAiService.generateItinerary(req);
        assertNotNull(itinerary);
        assertEquals(3, itinerary.getDays().size());
        assertEquals("Rome, Italy", itinerary.getDestinationName());
        assertFalse(itinerary.getDays().get(0).getActivities().isEmpty());
        assertNotNull(itinerary.getEstimatedBudget());
    }
}
