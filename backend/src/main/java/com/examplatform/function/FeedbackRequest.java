package com.examplatform.function;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FeedbackRequest(
        @NotBlank(message = "Write a paragraph before requesting feedback.")
        @Size(max = 4000, message = "Your paragraph must be 4,000 characters or fewer.")
        String text
) {
}
