package com.examplatform.auth.dto;

import com.examplatform.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Pattern(regexp = "^[a-zA-Z0-9_.]{3,30}$",
                message = "Username must be 3-30 characters: letters, numbers, underscores, dots") String username,
        @NotNull @Email String email,
        @NotNull @Size(min = 8, message = "password must be at least 8 characters") String password,
        @NotNull UserRole role
) {}