package com.examplatform.auth.oauth;

import com.examplatform.auth.AuthCookieWriter;
import com.examplatform.auth.JwtService;
import com.examplatform.auth.RefreshTokenService;
import com.examplatform.user.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthCookieWriter authCookieWriter;
    private final OAuthUserService oauthUserService;
    private final String frontendUrl;

    public OAuth2SuccessHandler(JwtService jwtService, RefreshTokenService refreshTokenService,
                                AuthCookieWriter authCookieWriter, OAuthUserService oauthUserService,
                                @Value("${app.frontend-url}") String frontendUrl) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.authCookieWriter = authCookieWriter;
        this.oauthUserService = oauthUserService;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
                throw new IllegalArgumentException("Expected a Google OAuth2 authentication token");
            }
            var principal = oauthToken.getPrincipal();
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            String subject = principal.getAttribute("sub");

            User user = oauthUserService.findOrCreateFromGoogle(email, name, subject);
            String accessToken = jwtService.createAccessToken(user);
            String refreshToken = refreshTokenService.issueNewSession(user).rawToken();
            authCookieWriter.setAuthCookies(response, accessToken, refreshToken);
            response.sendRedirect(frontendUrl + "/dashboard");
        } catch (RuntimeException exception) {
            response.sendRedirect(frontendUrl + "/sign-in?error=google_auth_failed");
        }
    }
}
