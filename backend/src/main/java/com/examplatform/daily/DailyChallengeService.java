package com.examplatform.daily;

import com.examplatform.progress.ProgressSaveRequest;
import com.examplatform.progress.ProgressService;
import com.examplatform.user.BadgeService;
import com.examplatform.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

@Service
public class DailyChallengeService {
    private static final int DURATION_SECONDS = 5 * 60;
    private static final String BADGE_CODE = "DAILY_CHALLENGE";
    private static final List<ChallengeItem> QUESTION_BANK = List.of(
            new ChallengeItem("cvc-1", "Add -ing to 'run'.", List.of("runing", "running", "runeing"), "running"),
            new ChallengeItem("cvc-2", "Add -ed to 'plan'.", List.of("planed", "planned", "planing"), "planned"),
            new ChallengeItem("cvc-3", "Add -ing to 'swim'.", List.of("swiming", "swimming", "swimmming"), "swimming"),
            new ChallengeItem("cvc-4", "Add -ed to 'stop'.", List.of("stoped", "stopped", "stopping"), "stopped"),
            new ChallengeItem("cvc-5", "Add -ing to 'sit'.", List.of("siting", "sitting", "siteing"), "sitting"),
            new ChallengeItem("cvc-6", "Add -ed to 'drop'.", List.of("droped", "dropped", "droping"), "dropped"),
            new ChallengeItem("cvc-7", "Add -ing to 'hop'.", List.of("hoping", "hopping", "hoppeing"), "hopping"),
            new ChallengeItem("cvc-8", "Add -ed to 'rob'.", List.of("robed", "robbed", "robbing"), "robbed"),
            new ChallengeItem("cvc-9", "Add -ing to 'cut'.", List.of("cuting", "cutting", "cuteing"), "cutting")
    );

    private final DailyChallengeAttemptRepository attemptRepository;
    private final BadgeService badgeService;
    private final ProgressService progressService;

    public DailyChallengeService(DailyChallengeAttemptRepository attemptRepository,
                                 BadgeService badgeService,
                                 ProgressService progressService) {
        this.attemptRepository = attemptRepository;
        this.badgeService = badgeService;
        this.progressService = progressService;
    }

    @Transactional(readOnly = true)
    public DailyChallengeResponse getToday(User user) {
        LocalDate today = todayUtc();
        DailyChallengeAttempt attempt = attemptRepository.findByUser_IdAndChallengeDate(user.getId(), today).orElse(null);
        return response(today, attempt);
    }

    @Transactional
    public DailyChallengeResponse start(User user) {
        LocalDate today = todayUtc();
        DailyChallengeAttempt attempt = attemptRepository.findByUser_IdAndChallengeDate(user.getId(), today)
                .orElseGet(() -> new DailyChallengeAttempt(user, today));
        if (attempt.getStartedAt() == null && attempt.getCompletedAt() == null) {
            attempt.setStartedAt(Instant.now());
            attempt = attemptRepository.save(attempt);
        }
        return response(today, attempt);
    }

    @Transactional
    public DailyChallengeResponse submit(User user, Map<String, String> answers) {
        LocalDate today = todayUtc();
        DailyChallengeAttempt attempt = attemptRepository.findByUser_IdAndChallengeDate(user.getId(), today)
                .orElseThrow(() -> new IllegalStateException("Start today's challenge before submitting answers."));
        if (attempt.getStartedAt() == null) {
            throw new IllegalStateException("Start today's challenge before submitting answers.");
        }
        if (attempt.getCompletedAt() != null) return response(today, attempt);

        List<ChallengeItem> questions = questionsFor(today);
        int score = (int) questions.stream().filter(question ->
                question.answer().equalsIgnoreCase(answers == null ? null : answers.get(question.id()))).count();
        Instant now = Instant.now();
        Duration elapsed = Duration.between(attempt.getStartedAt(), now);
        boolean beatTheClock = !elapsed.isNegative() && elapsed.compareTo(Duration.ofSeconds(DURATION_SECONDS)) <= 0;
        boolean earnedBadge = score == questions.size() && beatTheClock;

        attempt.setScore(score);
        attempt.setCompletedAt(now);
        attempt.setBadgeAwarded(earnedBadge);
        attemptRepository.save(attempt);
        int challengePoints = 20 + Math.round((float) score / questions.size() * 80);
        progressService.saveProgress(user, new ProgressSaveRequest(1, "DAILY_CHALLENGE", challengePoints, 100));
        if (earnedBadge) badgeService.awardBadge(user, BADGE_CODE);

        return response(today, attempt);
    }

    private DailyChallengeResponse response(LocalDate date, DailyChallengeAttempt attempt) {
        return new DailyChallengeResponse(
                date,
                "The CVC Spelling Rule",
                "Answer three quick questions before the five-minute timer runs out.",
                DURATION_SECONDS,
                questionsFor(date).stream().map(item -> new DailyChallengeQuestion(item.id(), item.prompt(), item.options())).toList(),
                attempt == null ? null : attempt.getStartedAt(),
                attempt == null ? null : attempt.getCompletedAt(),
                attempt == null ? null : attempt.getScore(),
                attempt != null && attempt.isBadgeAwarded()
        );
    }

    private List<ChallengeItem> questionsFor(LocalDate date) {
        int start = (int) Math.floorMod(date.toEpochDay(), QUESTION_BANK.size());
        return List.of(
                QUESTION_BANK.get(start),
                QUESTION_BANK.get((start + 1) % QUESTION_BANK.size()),
                QUESTION_BANK.get((start + 2) % QUESTION_BANK.size())
        );
    }

    private LocalDate todayUtc() {
        return LocalDate.now(ZoneOffset.UTC);
    }

    private record ChallengeItem(String id, String prompt, List<String> options, String answer) {}
}
