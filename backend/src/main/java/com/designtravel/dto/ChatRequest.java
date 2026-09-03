package com.designtravel.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ChatRequest(
    @NotBlank(message = "Message must not be blank")
    String message,
    String destinationContext,
    List<ChatMessage> conversationHistory
) {
    public record ChatMessage(String role, String content) {}
}
