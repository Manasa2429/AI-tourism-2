package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Place {
    private String id;
    private String name;
    private String category; // e.g. "Cultural Landmark", "Natural Wonder", "Culinary Hotspot", "Architectural Gem"
    private String description;
    private String imageUrl;
    private String entryFee;
    private String openingHours;
    private double rating;
    private double latitude;
    private double longitude;
    private String bestTimeToVisit;
}
