package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "itineraries")
public class Itinerary {

    @Id
    private String id;
    private String destinationId;
    private String destinationName;
    private String tripTitle;
    private String summary;
    private int durationDays;
    private String travelStyle; // e.g., "Relaxed", "Adventure", "Culture & History", "Gastronomy"
    private String budgetLevel; // "Budget", "Moderate", "Luxury"
    private String estimatedBudget;
    private String startDate;   // e.g. "2026-10-12"
    private String endDate;     // e.g. "2026-10-15"
    
    @Builder.Default
    private List<String> packingAdvice = new ArrayList<>();
    
    @Builder.Default
    private List<DayPlan> days = new ArrayList<>();

    @Builder.Default
    private Instant createdAt = Instant.now();
}
