package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearbyPlace {
    private String id;
    private String name;
    private String category;
    private String description;
    private String imageUrl;
    private String distance; // e.g. "20 km away"
    private double distanceKm;
    private String travelTime; // e.g. "30 min by train"
    private String entryFee;
    private double rating;
    private String bestTimeToVisit;
}
