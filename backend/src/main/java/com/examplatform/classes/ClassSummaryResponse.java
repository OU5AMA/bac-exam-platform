package com.examplatform.classes;

public record ClassSummaryResponse(
        Long id,
        String name,
        String joinCode,
        int memberCount,
        int maxMembers,
        double totalPoints,
        double averagePoints,
        int rank
) {}
