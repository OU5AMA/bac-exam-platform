package com.examplatform.function;

import java.util.List;

public record FeedbackResponse(List<String> positives, List<String> negatives, int score) {
}
