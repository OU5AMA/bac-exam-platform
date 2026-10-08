package com.examplatform.admin.dto;

import com.examplatform.user.User;

import java.time.Instant;

public record PendingTeacherResponse(Long id, String email, Instant createdAt) {
    public static PendingTeacherResponse from(User user) {
        return new PendingTeacherResponse(user.getId(), user.getEmail(), user.getCreatedAt());
    }
}