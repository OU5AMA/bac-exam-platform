package com.examplatform.auth;

import com.examplatform.auth.dto.AuthResponse;
import com.examplatform.auth.dto.LoginRequest;
import com.examplatform.auth.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final JwtProperties jwtProperties;

    public AuthController(AuthService authService, CurrentUserService currentUserService,
                          JwtProperties jwtProperties) {
        this.authService = authService;
        this.currentUserService = currentUserService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.TokenPair tokens = authService.login(request);
        return withAuthCookies(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = AuthCookies.REFRESH_TOKEN) String refreshToken) {
        AuthService.TokenPair tokens = authService.refresh(refreshToken);
        return withAuthCookies(tokens);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> logout(
            @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken) {
        authService.logout(refreshToken);

        ResponseCookie clearedAccess = ResponseCookie.from(AuthCookies.ACCESS_TOKEN, "")
                .httpOnly(true).secure(jwtProperties.secureCookies()).sameSite("Strict")
                .path("/").maxAge(0).build();
        ResponseCookie clearedRefresh = ResponseCookie.from(AuthCookies.REFRESH_TOKEN, "")
                .httpOnly(true).secure(jwtProperties.secureCookies()).sameSite("Strict")
                .path("/api/auth").maxAge(0).build();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearedAccess.toString())
                .header(HttpHeaders.SET_COOKIE, clearedRefresh.toString())
                .build();
    }

    @GetMapping("/me")
    public AuthResponse me() {
        return AuthResponse.from(currentUserService.getCurrentUser());
    }

    private ResponseEntity<AuthResponse> withAuthCookies(AuthService.TokenPair tokens) {
        ResponseCookie accessCookie = ResponseCookie.from(AuthCookies.ACCESS_TOKEN, tokens.accessToken())
                .httpOnly(true)
                .secure(jwtProperties.secureCookies())
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtProperties.accessTokenTtl())
                .build();

        // Scoped to /api/auth only — the refresh token never needs to be
        // sent on every request, just on refresh/logout. Smaller exposure
        // surface than sending it alongside the access token on every call.
        ResponseCookie refreshCookie = ResponseCookie.from(AuthCookies.REFRESH_TOKEN, tokens.refreshToken())
                .httpOnly(true)
                .secure(jwtProperties.secureCookies())
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofHours(12)) // absolute cap; cookie itself can outlive it, server enforces the real limit
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(tokens.body());
    }
}