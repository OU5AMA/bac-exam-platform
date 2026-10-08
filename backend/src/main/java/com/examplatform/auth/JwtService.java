package com.examplatform.auth;

import com.examplatform.user.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;

/**
 * Issues access-token JWTs. Validation/parsing of incoming tokens is handled
 * separately by Spring's NimbusJwtDecoder bean (see SecurityConfig) — this
 * class only creates them, since this app is not an authorization server.
 */
@Service
public class JwtService {

    private final MACSigner signer;
    private final JwtProperties properties;

    public JwtService(JwtProperties properties) throws JOSEException {
        this.properties = properties;
        byte[] secretBytes = properties.secret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret must be at least 32 bytes (256 bits) for HS256");
        }
        this.signer = new MACSigner(secretBytes);
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now();
        try {
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(user.getId().toString())
                    .claim("email", user.getEmail())
                    .claim("roles", List.of(user.getRole().name()))
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plus(properties.accessTokenTtl())))
                    .build();

            SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
            jwt.sign(signer);
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new IllegalStateException("Failed to sign access token", e);
        }
    }

    public Duration accessTokenTtl() {
        return properties.accessTokenTtl();
    }
}