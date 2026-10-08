package com.examplatform.auth;

import com.examplatform.common.exception.AccountNotActiveException;
import com.examplatform.common.exception.ResourceNotFoundException;
import com.examplatform.user.AccountStatus;
import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/**
 * Re-reads the authenticated user from the DB on demand, rather than trusting
 * whatever was baked into the JWT at login time. This matters specifically
 * for accountStatus: a teacher approved or rejected after their token was
 * issued must have that change take effect immediately, not after their
 * 15-minute access token happens to expire.
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = Long.valueOf(jwt.getSubject());
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user no longer exists"));
    }

    /**
     * For future teacher-privileged business endpoints: call this instead of
     * getCurrentUser() wherever a PENDING_APPROVAL or REJECTED account must
     * be blocked even though it holds a valid, unexpired JWT.
     */
    public User requireActiveUser() {
        User user = getCurrentUser();
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AccountNotActiveException(
                    "Account is not active (status: " + user.getAccountStatus() + ")");
        }
        return user;
    }
}