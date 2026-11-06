package com.examplatform.classes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JoinClassRequest(
        @NotBlank @Size(max = 10) String joinCode
) {}
