package com.examplatform.auth.oauth;

import com.examplatform.user.User;
import com.examplatform.user.UserRepository;
import com.examplatform.user.AccountStatus;
import com.examplatform.user.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class OAuthUserService {

    private static final String GOOGLE_PROVIDER = "GOOGLE";
    private static final int USERNAME_MAX_LENGTH = 30;

    private final UserRepository userRepository;

    public OAuthUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User findOrCreateFromGoogle(String email, String name, String googleSubject) {
        return userRepository.findByOauthProviderAndOauthSubject(GOOGLE_PROVIDER, googleSubject)
                .orElseGet(() -> findOrLinkByEmail(email, name, googleSubject));
    }

    private User findOrLinkByEmail(String email, String name, String googleSubject) {
        var existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.getOauthProvider() == null) {
                user.setOauthProvider(GOOGLE_PROVIDER);
                user.setOauthSubject(googleSubject);
                return userRepository.save(user);
            }
            throw new IllegalStateException("Email is already linked to another OAuth identity");
        }

        String username = uniqueUsernameFromEmail(email);
        User user = new User(email, null, UserRole.STUDENT);
        user.setUsername(username);
        user.setDisplayName(name == null || name.isBlank() ? username : name.trim());
        user.setPasswordHash(null);
        user.setRole(UserRole.STUDENT);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setEnabled(true);
        user.setOauthProvider(GOOGLE_PROVIDER);
        user.setOauthSubject(googleSubject);
        return userRepository.save(user);
    }

    private String uniqueUsernameFromEmail(String email) {
        String localPart = email.substring(0, email.indexOf('@')).toLowerCase(Locale.ROOT);
        String base = localPart.replaceAll("[^a-z0-9_.]", "");
        if (base.isBlank()) {
            base = "user";
        }
        base = base.substring(0, Math.min(base.length(), USERNAME_MAX_LENGTH));

        String candidate = base;
        int suffix = 2;
        while (userRepository.existsByUsernameIgnoreCase(candidate)) {
            String suffixText = "_" + suffix++;
            int baseLength = Math.min(base.length(), USERNAME_MAX_LENGTH - suffixText.length());
            candidate = base.substring(0, baseLength) + suffixText;
        }
        return candidate;
    }
}
