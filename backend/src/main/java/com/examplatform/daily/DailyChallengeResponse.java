package com.examplatform.daily;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record DailyChallengeResponse(
        LocalDate date,
        String title,
        String description,
        int durationSeconds,
        List<DailyChallengeQuestion> questions,
        Instant startedAt,
        Instant completedAt,
        Integer score,
        boolean badgeAwarded
) {}
