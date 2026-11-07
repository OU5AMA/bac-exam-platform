package com.examplatform.classes;

public record ClassSummaryResponse(
        Long id,
        String name,
        String joinCode,
        int memberCount,
        int maxMembers,
        long totalPoints,
        int rank
) {}
