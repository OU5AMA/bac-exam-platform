package com.examplatform.auth;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void studentCanRegisterLoginAndAccessProtectedEndpoint() throws Exception {
        String email = "student1@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123","role":"STUDENT"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountStatus").value("ACTIVE"));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
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

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andReturn();
        Cookie rotatedRefreshCookie = refreshResult.getResponse().getCookie("refresh_token");
        assertThat(rotatedRefreshCookie.getValue()).isNotEqualTo(refreshCookie.getValue());

        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())
                        .cookie(refreshCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void teacherIsPendingUntilAdminApprovesThem() throws Exception {
        String email = "teacher1@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123","role":"TEACHER"}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountStatus").value("PENDING_APPROVAL"));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"password123"}
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountStatus").value("PENDING_APPROVAL"));

        mockMvc.perform(get("/api/admin/teachers/pending"))
                .andExpect(status().isUnauthorized());
    }
}