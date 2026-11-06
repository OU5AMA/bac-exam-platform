package com.examplatform.progress;

import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
public class StreakService {
    private static final int MAX_STREAK_FREEZES = 2;

    private final UserRepository userRepository;

    public StreakService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void recordActivity(User user) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate lastActive = user.getLastActivityDate();

        if (lastActive == null) {
            user.setCurrentStreak(1);
            user.setLastActivityDate(today);
        } else if (lastActive.isEqual(today)) {
            return;
        } else if (lastActive.isEqual(today.minusDays(1))) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            if (user.getCurrentStreak() % 7 == 0 && user.getStreakFreezes() < MAX_STREAK_FREEZES) {
                user.setStreakFreezes(user.getStreakFreezes() + 1);
            }
            user.setLastActivityDate(today);
        } else if (lastActive.isBefore(today.minusDays(1))) {
            if (user.getStreakFreezes() > 0) {
                user.setStreakFreezes(user.getStreakFreezes() - 1);
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else {
                user.setCurrentStreak(1);
            }
            user.setLastActivityDate(today);
        }

        userRepository.save(user);
    }
}
