package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    private String timeSlot;   // e.g. "09:00 AM - Morning"
    private String place;      // e.g. "Fushimi Inari Shrine"
    private String famousFor;  // What this place is famous for
    private String activity;   // Detailed recommendation
    private String cost;       // e.g. "Free" or "$15"
    private String tips;       // Insider tip
    private String category;   // e.g. "Culture", "Dining", "Scenic"
    private String imageUrl;   // High-res photo of the stop
    private Double latitude;   // GPS Latitude for Map Marker
    private Double longitude;  // GPS Longitude for Map Marker
    private String locationName; // Specific neighborhood or district
    private String distanceFromPrev; // e.g. "2.4 km from Stop 1"
    private String transitTime;      // e.g. "~15 min walking / 7 min taxi"

    public Activity(String timeSlot, String place, String activity, String cost, String tips, String category) {
        this.timeSlot = timeSlot;
        this.place = place;
        this.famousFor = place + " is celebrated for its historic significance, unique architecture, and authentic local atmosphere.";
        this.activity = activity;
        this.cost = cost;
        this.tips = tips;
        this.category = category;
    }

    public Activity(String timeSlot, String place, String famousFor, String activity, String cost, String tips, String category) {
        this.timeSlot = timeSlot;
        this.place = place;
        this.famousFor = famousFor;
        this.activity = activity;
        this.cost = cost;
        this.tips = tips;
        this.category = category;
    }
}
