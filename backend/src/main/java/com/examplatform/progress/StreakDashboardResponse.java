package com.examplatform.progress;

import com.examplatform.user.User;

public record StreakDashboardResponse(int currentStreak, int streakFreezes) {
    public static StreakDashboardResponse from(User user) {
        return new StreakDashboardResponse(user.getCurrentStreak(), user.getStreakFreezes());
    }
}
