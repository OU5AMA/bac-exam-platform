package com.examplatform.progress;

import java.time.Instant;

public record ProgressSaveResponse(Long id, int unitNumber, String skill, int score, int maxScore, Instant recordedAt) {}
