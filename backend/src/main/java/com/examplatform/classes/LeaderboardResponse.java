package com.examplatform.classes;

import java.util.List;

public record LeaderboardResponse(List<ClassLeaderboardEntry> topClasses, ClassLeaderboardEntry myClass) {}
