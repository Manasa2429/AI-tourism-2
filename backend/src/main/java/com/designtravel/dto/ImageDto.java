package com.designtravel.dto;

import java.io.Serializable;

public record ImageDto(
    String id,
    String urlRegular,
    String urlSmall,
    String urlThumb,
    String altDescription,
    String photographerName,
    String photographerProfileUrl
) implements Serializable {}
