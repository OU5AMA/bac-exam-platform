package com.examplatform.daily;

import java.util.List;

public record DailyChallengeQuestion(String id, String prompt, List<String> options) {}
