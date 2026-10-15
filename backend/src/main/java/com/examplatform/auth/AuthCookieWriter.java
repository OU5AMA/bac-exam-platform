package com.examplatform.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class AuthCookieWriter {

    private final JwtProperties jwtProperties;

    public AuthCookieWriter(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from(AuthCookies.ACCESS_TOKEN, accessToken)
                .httpOnly(true)
                .secure(jwtProperties.secureCookies())
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtProperties.accessTokenTtl())
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(AuthCookies.REFRESH_TOKEN, refreshToken)
                .httpOnly(true)
                .secure(jwtProperties.secureCookies())
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofHours(12))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    public void clearAuthCookies(HttpServletResponse response) {
        ResponseCookie clearedAccess = ResponseCookie.from(AuthCookies.ACCESS_TOKEN, "")
                .httpOnly(true).secure(jwtProperties.secureCookies()).sameSite("Strict")
                .path("/").maxAge(0).build();
        ResponseCookie clearedRefresh = ResponseCookie.from(AuthCookies.REFRESH_TOKEN, "")
                .httpOnly(true).secure(jwtProperties.secureCookies()).sameSite("Strict")
                .path("/api/auth").maxAge(0).build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearedAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, clearedRefresh.toString());
    }
}
