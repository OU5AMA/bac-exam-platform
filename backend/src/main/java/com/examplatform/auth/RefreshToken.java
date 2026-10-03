package com.examplatform.auth;

import com.examplatform.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "token_family_id", nullable = false)
    private UUID tokenFamilyId;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "absolute_expires_at", nullable = false)
    private Instant absoluteExpiresAt;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** New session: fresh family id, starts sliding + absolute clocks. */
    public RefreshToken(User user, String tokenHash, Instant expiresAt, Instant absoluteExpiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.tokenFamilyId = UUID.randomUUID();
        this.expiresAt = expiresAt;
        this.absoluteExpiresAt = absoluteExpiresAt;
        this.revoked = false;
    }

    /** Rotation: same family, new sliding window, same absolute cap. */
    public RefreshToken(User user,
                        String tokenHash,
                        UUID tokenFamilyId,
                        Instant expiresAt,
                        Instant absoluteExpiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.tokenFamilyId = tokenFamilyId;
        this.expiresAt = expiresAt;
        this.absoluteExpiresAt = absoluteExpiresAt;
        this.revoked = false;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    public boolean isUsable() {
        Instant now = Instant.now();
        return !revoked
                && now.isBefore(expiresAt)
                && now.isBefore(absoluteExpiresAt);
    }
}