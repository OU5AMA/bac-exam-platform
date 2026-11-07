package com.examplatform.progress;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProgressSaveRequest(
        @Min(1) int unitNumber,
        @NotBlank @Size(max = 32) String skill,
        @Min(0) int score,
        @Min(1) int maxScore
) {}
