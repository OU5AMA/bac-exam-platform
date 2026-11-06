package com.examplatform.progress;

import com.examplatform.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "unit_number", nullable = false)
    private int unitNumber;

    @Column(name = "skill", nullable = false, length = 32)
    private String skill;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "max_score", nullable = false)
    private int maxScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant recordedAt;

    public UserProgress(User user, ProgressSaveRequest request) {
        this.user = user;
        this.unitNumber = request.unitNumber();
        this.skill = request.skill().trim().toUpperCase();
        this.score = request.score();
        this.maxScore = request.maxScore();
    }

    @PrePersist
    void onCreate() {
        if (recordedAt == null) recordedAt = Instant.now();
    }
}
