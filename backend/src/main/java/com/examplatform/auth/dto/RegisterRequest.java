package com.examplatform.auth.dto;

import com.examplatform.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotNull @Email String email,
        @NotNull @Size(min = 8, message = "password must be at least 8 characters") String password,
        @NotNull UserRole role
) {}