package com.examplatform.classes;

public record ClassLeaderboardEntry(
        Long id,
        String name,
        int memberCount,
        long totalPoints,
        int rank,
        boolean currentClass
) {}
