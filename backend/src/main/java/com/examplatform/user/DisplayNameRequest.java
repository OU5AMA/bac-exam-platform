package com.examplatform.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DisplayNameRequest(
        @NotBlank
        @Size(max = 80)
        String displayName
) {
}
