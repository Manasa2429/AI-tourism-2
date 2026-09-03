package com.designtravel.dto;

import java.util.List;

public record ChatResponse(
    String reply,
    List<String> suggestedFollowUps,
    long latencyMs
) {}
