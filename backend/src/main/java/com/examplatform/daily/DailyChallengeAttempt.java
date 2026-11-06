package com.examplatform.daily;

import com.examplatform.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_daily_challenge_attempts", uniqueConstraints =
        @UniqueConstraint(name = "uk_daily_challenge_user_date", columnNames = {"user_id", "challenge_date"}))
@Getter
@Setter
@NoArgsConstructor
public class DailyChallengeAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "challenge_date", nullable = false)
    private LocalDate challengeDate;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "score")
    private Integer score;

    @Column(name = "badge_awarded", nullable = false)
    private boolean badgeAwarded;

    public DailyChallengeAttempt(User user, LocalDate challengeDate) {
        this.user = user;
        this.challengeDate = challengeDate;
    }
}
