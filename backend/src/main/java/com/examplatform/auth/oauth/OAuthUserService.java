package com.examplatform.auth.oauth;

import com.examplatform.user.User;
import org.springframework.stereotype.Service;

@Service
public class OAuthUserService {
    public User findOrCreateFromGoogle(String email, String name, String googleSubject) {
        throw new UnsupportedOperationException("Implemented in Phase 2");
    }
}
