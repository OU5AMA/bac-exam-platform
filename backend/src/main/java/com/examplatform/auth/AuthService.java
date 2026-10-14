package com.examplatform.auth;

import com.examplatform.auth.dto.AuthResponse;
import com.examplatform.auth.dto.LoginRequest;
import com.examplatform.auth.dto.RegisterRequest;
import com.examplatform.auth.UsernameAlreadyExistsException;
import com.examplatform.common.exception.DuplicateResourceException;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import com.examplatform.user.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public record TokenPair(String accessToken, String refreshToken, AuthResponse body) {}

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == UserRole.ADMIN) {
            throw new IllegalArgumentException("Admin accounts cannot self-register");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new UsernameAlreadyExistsException();
        }

        User user = new User(request.email(), passwordEncoder.encode(request.password()), request.role());
        user.setUsername(request.username());
        userRepository.save(user);
        return AuthResponse.from(user);
    }

    @Transactional
    public TokenPair login(LoginRequest request) {
        String identifier = request.identifier().trim();
        User user = (identifier.contains("@"))
                ? userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"))
                : userRepository.findByUsernameIgnoreCase(identifier)
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Pending-approval teachers DO get a session — they authenticated
        // correctly — they're just blocked from teacher-privileged actions
        // via CurrentUserService.requireActiveUser() once such endpoints
        // exist. The frontend reads accountStatus in the response body to
        // show the right message.
        String accessToken = jwtService.createAccessToken(user);
        RefreshTokenService.IssuedToken refresh = refreshTokenService.issueNewSession(user);

        return new TokenPair(accessToken, refresh.rawToken(), AuthResponse.from(user));
    }

    @Transactional
    public TokenPair refresh(String presentedRefreshToken) {
        RefreshTokenService.IssuedToken rotated = refreshTokenService.rotate(presentedRefreshToken);
        String accessToken = jwtService.createAccessToken(rotated.user());
        return new TokenPair(accessToken, rotated.rawToken(), AuthResponse.from(rotated.user()));
    }

    @Transactional
    public void logout(String presentedRefreshToken) {
        if (presentedRefreshToken != null) {
            refreshTokenService.revoke(presentedRefreshToken);
        }
    }
}