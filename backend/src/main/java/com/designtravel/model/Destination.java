package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "destinations")
public class Destination {

    @Id
    private String id;

    @Indexed
    private String name;

    @Indexed
    private String country;

    @Indexed
    private String continent;

    private String tagline;
    private String description;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location; // [longitude, latitude]

    private double latitude;
    private double longitude;

    private String coverImageUrl;
    private String heroVideoUrl;

    private String bestSeason;
    private String currency;
    private String language;
    private int avgDailyBudgetUSD;
    private double rating;
    private int reviewCount;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<Place> places = new ArrayList<>();

    @Builder.Default
    private List<NearbyPlace> nearbyPlaces = new ArrayList<>();

    @Builder.Default
    private List<String> galleryImages = new ArrayList<>();
}
