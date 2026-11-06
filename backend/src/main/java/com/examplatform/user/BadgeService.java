package com.examplatform.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

@Service
public class BadgeService {
    private final UserRepository userRepository;

    public BadgeService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Awards a badge from a trusted server-side exercise result. For VOCABULARY,
     * {@code score} is the number of completed crosswords; for other skills it
     * is the awarded score on the scale described by that skill's threshold.
     */
    @Transactional
    public void checkAndAwardBadges(User user, String skill, int score) {
        if (user == null || skill == null || skill.isBlank()) return;

        String badge = switch (skill.trim().toUpperCase(Locale.ROOT)) {
            case "GRAMMAR" -> score == 100 ? "GRAMMAR_GURU" : null;
            case "VOCABULARY" -> score >= 3 ? "VOCAB_MASTER" : null;
            case "FUNCTION" -> score == 10 ? "OPINION_EXPERT" : null;
            case "READING" -> score == 100 ? "READING_PRO" : null;
            case "WRITING" -> score == 100 ? "WRITING_STAR" : null;
            default -> null;
        };
        awardBadge(user, badge);
    }

    @Transactional
    public void awardBadge(User user, String badge) {
        if (user == null || badge == null || badge.isBlank()) return;

        Set<String> earned = new LinkedHashSet<>();
        if (user.getBadges() != null && !user.getBadges().isBlank()) {
            Arrays.stream(user.getBadges().split(","))
                    .map(String::trim)
                    .filter(value -> !value.isEmpty())
                    .forEach(earned::add);
        }

        if (earned.add(badge)) {
            user.setBadges(String.join(",", earned));
            userRepository.save(user);
        }
    }
}
