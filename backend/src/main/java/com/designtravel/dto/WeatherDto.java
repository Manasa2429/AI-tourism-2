package com.designtravel.dto;

import java.io.Serializable;

public record WeatherDto(
    String city,
    String country,
    double tempC,
    double tempF,
    double feelsLikeC,
    String condition,
    String description,
    String iconUrl,
    int humidity,
    double windSpeedKmh,
    int clouds,
    long timestamp
) implements Serializable {}
