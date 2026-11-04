package com.examplatform.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfilePictureRequest(
        @NotBlank
        @Size(max = 2_800_000)
        String imageBase64
) {
}
