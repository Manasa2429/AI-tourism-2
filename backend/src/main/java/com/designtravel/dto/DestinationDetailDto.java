package com.designtravel.dto;

import com.designtravel.model.Destination;
import java.util.List;

public record DestinationDetailDto(
    Destination destination,
    WeatherDto weather,
    List<ImageDto> liveImages
) {}
