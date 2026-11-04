package com.examplatform.auth.dto;

import com.examplatform.user.AccountStatus;
import com.examplatform.user.User;

import java.util.List;

public record AuthResponse(
        Long id,
        String username,
        String email,
        List<String> roles,
        String badges,
        AccountStatus accountStatus
) {
    public static AuthResponse from(User user) {
        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                List.of(user.getRole().name()),
                user.getBadges() == null ? "" : user.getBadges(),
                user.getAccountStatus()
        );
    }
}
