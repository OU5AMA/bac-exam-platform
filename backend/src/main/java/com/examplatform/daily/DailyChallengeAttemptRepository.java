package com.examplatform.daily;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyChallengeAttemptRepository extends JpaRepository<DailyChallengeAttempt, Long> {
    Optional<DailyChallengeAttempt> findByUser_IdAndChallengeDate(Long userId, LocalDate challengeDate);
}
