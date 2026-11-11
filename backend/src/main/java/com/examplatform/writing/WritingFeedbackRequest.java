package com.examplatform.writing;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WritingFeedbackRequest(
        @NotBlank(message = "Write your story before requesting feedback.")
        @Size(max = 10000, message = "Your story must be 10,000 characters or fewer.")
        String text,
        @Min(value = 1, message = "Unit number must be positive.")
        @Max(value = 10, message = "Unknown course unit.")
        int unitNumber
) {}
