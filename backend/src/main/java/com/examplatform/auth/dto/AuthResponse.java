package com.examplatform.auth.dto;

import com.examplatform.user.AccountStatus;
import com.examplatform.user.User;

import java.util.List;

public record AuthResponse(
        Long id,
        String username,
        String displayName,
        String email,
        List<String> roles,
        String badges,
        String profilePictureUrl,
        AccountStatus accountStatus,
        int currentStreak,
        int streakFreezes
) {
    public static AuthResponse from(User user) {
        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                List.of(user.getRole().name()),
                user.getBadges() == null ? "" : user.getBadges(),
                user.getProfilePictureUrl(),
                user.getAccountStatus(),
                user.getCurrentStreak(),
                user.getStreakFreezes()
        );
    }
}
