package com.examplatform.progress;

import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import com.examplatform.user.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {
    @Mock
    private UserRepository userRepository;

    private StreakService streakService;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        streakService = new StreakService(userRepository);
        today = LocalDate.now(ZoneOffset.UTC);
    }

    @Test
    void firstActivityStartsAStreak() {
        User user = new User();

        streakService.recordActivity(user);

        assertEquals(1, user.getCurrentStreak());
        assertEquals(today, user.getLastActivityDate());
        verify(userRepository).save(user);
    }

    @Test
    void sameDayActivityDoesNotChangeOrSaveTheUser() {
        User user = userWithStreak(4, today, 1);

        streakService.recordActivity(user);

        assertEquals(4, user.getCurrentStreak());
        assertEquals(1, user.getStreakFreezes());
        verify(userRepository, never()).save(user);
    }

    @Test
    void seventhConsecutiveDayAwardsAFreezeUpToTheCap() {
        User user = userWithStreak(6, today.minusDays(1), 0);

        streakService.recordActivity(user);

        assertEquals(7, user.getCurrentStreak());
        assertEquals(1, user.getStreakFreezes());
        assertEquals(today, user.getLastActivityDate());
    }

    @Test
    void missedDayConsumesFreezeAndKeepsStreakGrowing() {
        User user = userWithStreak(7, today.minusDays(3), 1);

        streakService.recordActivity(user);

        assertEquals(8, user.getCurrentStreak());
        assertEquals(0, user.getStreakFreezes());
        assertEquals(today, user.getLastActivityDate());
    }

    @Test
    void missedDayWithoutFreezeResetsStreak() {
        User user = userWithStreak(7, today.minusDays(3), 0);

        streakService.recordActivity(user);

        assertEquals(1, user.getCurrentStreak());
        assertEquals(today, user.getLastActivityDate());
    }

    private User userWithStreak(int streak, LocalDate lastActive, int freezes) {
        User user = new User("student@example.com", "hash", UserRole.STUDENT);
        user.setCurrentStreak(streak);
        user.setLastActivityDate(lastActive);
        user.setStreakFreezes(freezes);
        return user;
    }
}
