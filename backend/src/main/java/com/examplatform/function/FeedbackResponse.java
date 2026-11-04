package com.examplatform.function;

import java.util.List;

public record FeedbackResponse(String annotatedText, List<String> positives, List<String> negatives, int score) {
}
