package com.examplatform.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BadgeServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BadgeService badgeService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("student@example.com", "hash", UserRole.STUDENT);
        user.setUsername("student");
    }

    @Test
    void awardsGrammarBadgeForPerfectScoreAndIsIdempotent() {
        badgeService.checkAndAwardBadges(user, "GRAMMAR", 100);
        badgeService.checkAndAwardBadges(user, "GRAMMAR", 100);

        assertEquals("GRAMMAR_GURU", user.getBadges());
        verify(userRepository).save(user);
    }

    @Test
    void awardsVocabularyBadgeAfterThreeCrosswords() {
        badgeService.checkAndAwardBadges(user, "VOCABULARY", 2);
        assertEquals("", user.getBadges());
        verify(userRepository, never()).save(user);

        badgeService.checkAndAwardBadges(user, "VOCABULARY", 3);

        assertEquals("VOCAB_MASTER", user.getBadges());
        verify(userRepository).save(user);
    }

    @Test
    void awardsFunctionReadingAndWritingBadgesAtTheirThresholds() {
        badgeService.checkAndAwardBadges(user, "FUNCTION", 10);
        badgeService.checkAndAwardBadges(user, "READING", 100);
        badgeService.checkAndAwardBadges(user, "WRITING", 100);

        assertEquals("OPINION_EXPERT,READING_PRO,WRITING_STAR", user.getBadges());
        verify(userRepository, times(3)).save(user);
    }

    @Test
    void doesNotAwardBadgesForUnknownSkillsOrNonPerfectScores() {
        badgeService.checkAndAwardBadges(user, "GRAMMAR", 99);
        badgeService.checkAndAwardBadges(user, "ART", 100);

        assertEquals("", user.getBadges());
        verify(userRepository, never()).save(user);
    }
}
