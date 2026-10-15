package com.examplatform.auth;

import com.examplatform.auth.dto.AuthResponse;
import com.examplatform.auth.dto.LoginRequest;
import com.examplatform.auth.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final AuthCookieWriter authCookieWriter;

    public AuthController(AuthService authService, CurrentUserService currentUserService,
                          AuthCookieWriter authCookieWriter) {
        this.authService = authService;
        this.currentUserService = currentUserService;
        this.authCookieWriter = authCookieWriter;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletResponse response) {
        AuthService.TokenPair tokens = authService.login(request);
        authCookieWriter.setAuthCookies(response, tokens.accessToken(), tokens.refreshToken());
        return ResponseEntity.ok(tokens.body());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = AuthCookies.REFRESH_TOKEN) String refreshToken,
            HttpServletResponse response) {
        AuthService.TokenPair tokens = authService.refresh(refreshToken);
        authCookieWriter.setAuthCookies(response, tokens.accessToken(), tokens.refreshToken());
        return ResponseEntity.ok(tokens.body());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> logout(
            @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken,
            HttpServletResponse response) {
        authService.logout(refreshToken);
        authCookieWriter.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public AuthResponse me() {
        return AuthResponse.from(currentUserService.getCurrentUser());
    }
}
