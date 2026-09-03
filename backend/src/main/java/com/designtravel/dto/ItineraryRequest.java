package com.designtravel.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ItineraryRequest(
    @NotBlank(message = "Destination is required")
    String destinationName,

    @Min(value = 1, message = "Trip must be at least 1 day")
    @Max(value = 14, message = "Trip maximum is 14 days")
    int days,

    String travelStyle,   // e.g., "Relaxed", "Adventure", "Culture & History", "Gastronomy"
    String budgetLevel,   // "Budget", "Moderate", "Luxury"
    List<String> interests,
    String pace,          // "Slow & Immersive", "Balanced", "Fast-Paced"
    String startDate,     // e.g. "2026-10-12"
    String endDate        // e.g. "2026-10-15"
) {
    public ItineraryRequest(String destinationName, int days, String travelStyle, String budgetLevel, List<String> interests, String pace) {
        this(destinationName, days, travelStyle, budgetLevel, interests, pace, null, null);
    }
}
