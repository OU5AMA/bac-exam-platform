package com.examplatform.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void studentCanRegisterLoginAndAccessProtectedEndpoint() throws Exception {
        String email = "student1@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123","role":"STUDENT"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountStatus").value("ACTIVE"));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123"}
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", containsString("access_token=")))
                .andExpect(header().string("Set-Cookie", containsString("HttpOnly")))
                .andReturn();

        Cookie accessCookie = loginResult.getResponse().getCookie("access_token");
        Cookie refreshCookie = loginResult.getResponse().getCookie("refresh_token");
        assertThat(accessCookie).isNotNull();
        assertThat(refreshCookie).isNotNull();

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/auth/me").cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh").cookie(refreshCookie))
                .andExpect(status().isOk())
                .andReturn();
        Cookie rotatedRefreshCookie = refreshResult.getResponse().getCookie("refresh_token");
        assertThat(rotatedRefreshCookie.getValue()).isNotEqualTo(refreshCookie.getValue());

        // Old refresh token must now be rejected (rotation worked)
        mockMvc.perform(post("/api/auth/refresh").cookie(refreshCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void teacherIsPendingUntilAdminApprovesThem() throws Exception {
        String email = "teacher1@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123","role":"TEACHER"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountStatus").value("PENDING_APPROVAL"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123"}
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountStatus").value("PENDING_APPROVAL"));

        // Admin-only endpoint rejects anyone without ADMIN role — exercised
        // indirectly here by confirming it requires auth at all; a full
        // admin-token test needs an ADMIN test fixture, which this chat's
        // scope doesn't create a seeding mechanism for yet (flagged below).
        mockMvc.perform(get("/api/admin/teachers/pending"))
                .andExpect(status().isUnauthorized());
    }
}