package com.examplatform.auth;

import com.examplatform.user.AccountStatus;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import com.examplatform.user.UserRole;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String REFRESH_COOKIE = "refresh_token";
    private static final String ACCESS_COOKIE = CookieBearerTokenResolver.ACCESS_TOKEN_COOKIE;

    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final JwtService jwt;
    private final RefreshTokenService refreshTokens;
    private final JwtProperties properties;

    public AuthController(UserRepository users, PasswordEncoder passwords, JwtService jwt,
                          RefreshTokenService refreshTokens, JwtProperties properties) {
        this.users = users;
        this.passwords = passwords;
        this.jwt = jwt;
        this.refreshTokens = refreshTokens;
        this.properties = properties;
    }

    public record Credentials(@NotBlank @Email @Size(max = 255) String email,
                              @NotBlank @Size(min = 12, max = 72) String password) {}

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("token", token.getToken());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, String> register(@Valid @RequestBody Credentials credentials) {
        String email = normalize(credentials.email());
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        // Public registration never accepts a caller-selected role.
        users.save(new User(email, passwords.encode(credentials.password()), UserRole.STUDENT));
        return Map.of("message", "Account created. You can now sign in.");
    }

    @PostMapping("/login")
    @Transactional
    public Map<String, String> login(@Valid @RequestBody Credentials credentials,
                                     HttpServletResponse response) {
        User user = users.findByEmail(normalize(credentials.email()))
                .orElseThrow(AuthController::invalidCredentials);
        if (!passwords.matches(credentials.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }
        if (!user.isEnabled() || user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account is not active");
        }
        RefreshTokenService.IssuedToken refresh = refreshTokens.issueNewSession(user);
        setCookie(response, ACCESS_COOKIE, jwt.createAccessToken(user), jwt.accessTokenTtl());
        setCookie(response, REFRESH_COOKIE, refresh.rawToken(), Duration.between(java.time.Instant.now(), refresh.expiresAt()));
        return Map.of("message", "Signed in");
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(@CookieValue(name = REFRESH_COOKIE, required = false) String raw,
                                       HttpServletResponse response) {
        if (raw == null || raw.isBlank()) throw invalidCredentials();
        try {
            RefreshTokenService.IssuedToken rotated = refreshTokens.rotate(raw);
            // Resolve the user through a short-lived helper on the service to avoid trusting client claims.
            User user = refreshTokens.userFor(rotated.rawToken());
            setCookie(response, ACCESS_COOKIE, jwt.createAccessToken(user), jwt.accessTokenTtl());
            setCookie(response, REFRESH_COOKIE, rotated.rawToken(), Duration.between(java.time.Instant.now(), rotated.expiresAt()));
            return Map.of("message", "Session refreshed");
        } catch (InvalidRefreshTokenException ex) {
            clearCookies(response);
            throw invalidCredentials();
        }
    }

    @PostMapping("/logout")
    public Map<String, String> logout(@CookieValue(name = REFRESH_COOKIE, required = false) String raw,
                                      HttpServletResponse response) {
        if (raw != null && !raw.isBlank()) refreshTokens.revoke(raw);
        clearCookies(response);
        return Map.of("message", "Signed out");
    }

    private void setCookie(HttpServletResponse response, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value).httpOnly(true).secure(properties.cookieSecure())
                .sameSite("Lax").path("/").maxAge(maxAge.isNegative() ? Duration.ZERO : maxAge).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearCookies(HttpServletResponse response) {
        setCookie(response, ACCESS_COOKIE, "", Duration.ZERO);
        setCookie(response, REFRESH_COOKIE, "", Duration.ZERO);
    }

    private static String normalize(String email) { return email.trim().toLowerCase(Locale.ROOT); }
    private static ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
}
