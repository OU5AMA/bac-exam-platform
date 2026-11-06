package com.examplatform.classes;

public record ClassLeaderboardEntry(
        Long id,
        String name,
        int memberCount,
        double totalPoints,
        double averagePoints,
        int rank,
        boolean currentClass
) {}
