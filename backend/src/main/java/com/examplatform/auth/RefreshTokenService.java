package com.examplatform.auth;

import com.examplatform.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtProperties properties;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repository, JwtProperties properties) {
        this.repository = repository;
        this.properties = properties;
    }

    public record IssuedToken(String rawToken, Instant expiresAt) {}

    @Transactional
    public IssuedToken issueNewSession(User user) {
        String raw = generateRawToken();
        Instant now = Instant.now();
        Instant expiresAt = now.plus(properties.refreshTokenSlidingTtl());
        Instant absoluteExpiresAt = now.plus(properties.refreshTokenAbsoluteTtl());

        RefreshToken token = new RefreshToken(user, hash(raw), expiresAt, absoluteExpiresAt);
        repository.save(token);
        return new IssuedToken(raw, expiresAt);
    }

    /**
     * Validates the presented refresh token and rotates it: the old token is
     * revoked, a new one is issued in the same family with a fresh sliding
     * window but the SAME absolute cap. If a token that's already revoked is
     * presented, that's a reuse signal (possible theft) — the whole family
     * is revoked as a precaution.
     */
    @Transactional
    public IssuedToken rotate(String presentedRawToken) {
        String presentedHash = hash(presentedRawToken);
        RefreshToken existing = repository.findByTokenHash(presentedHash)
                .orElseThrow(() -> new InvalidRefreshTokenException("Unknown refresh token"));

        if (existing.isRevoked()) {
            revokeFamily(existing.getTokenFamilyId());
            throw new InvalidRefreshTokenException(
                    "Refresh token reuse detected; session terminated");
        }

        if (!existing.isUsable()) {
            throw new InvalidRefreshTokenException("Refresh token expired");
        }

        existing.setRevoked(true);
        repository.save(existing);

        String newRaw = generateRawToken();
        Instant newExpiresAt = Instant.now().plus(properties.refreshTokenSlidingTtl());
        // Absolute cap is NOT reset — it stays tied to the original login.
        RefreshToken rotated = new RefreshToken(
                existing.getUser(),
                hash(newRaw),
                existing.getTokenFamilyId(),
                newExpiresAt,
                existing.getAbsoluteExpiresAt()
        );
        repository.save(rotated);
        return new IssuedToken(newRaw, newExpiresAt);
    }

    @Transactional
    public void revoke(String presentedRawToken) {
        repository.findByTokenHash(hash(presentedRawToken))
                .ifPresent(t -> {
                    t.setRevoked(true);
                    repository.save(t);
                });
    }

    private void revokeFamily(UUID familyId) {
        List<RefreshToken> family = repository.findByTokenFamilyId(familyId);
        family.forEach(t -> t.setRevoked(true));
        repository.saveAll(family);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes());
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}