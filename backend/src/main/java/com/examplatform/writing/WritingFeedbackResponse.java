package com.examplatform.writing;

import java.util.List;

public record WritingFeedbackResponse(List<String> positives, List<String> negatives, int score, int maxScore) {}
