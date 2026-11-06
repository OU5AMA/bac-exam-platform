package com.examplatform.daily;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DailyChallengeIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void authenticatedStudentCanStartAndSubmitTodaysChallengeOnce() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {"username":"challengestudent","email":"challenge@example.com","password":"password123","role":"STUDENT"}
                                """))
                .andExpect(status().isCreated());

        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {"identifier":"challenge@example.com","password":"password123"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        Cookie accessCookie = login.getResponse().getCookie("access_token");

        mockMvc.perform(get("/api/challenges/daily").cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("The CVC Spelling Rule"))
                .andExpect(jsonPath("$.durationSeconds").value(300))
                .andExpect(jsonPath("$.questions.length()").value(3));

        mockMvc.perform(post("/api/challenges/daily/start")
                        .with(csrf())
                        .cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startedAt").isNotEmpty());

        mockMvc.perform(post("/api/challenges/daily/submit")
                        .with(csrf())
                        .cookie(accessCookie)
                        .contentType("application/json")
                        .content("""
                                {"answers":{}}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedAt").isNotEmpty())
                .andExpect(jsonPath("$.score").value(0))
                .andExpect(jsonPath("$.badgeAwarded").value(false));

        mockMvc.perform(get("/api/challenges/daily").cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedAt").isNotEmpty());

        Integer progressRows = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM user_progress up
                JOIN users u ON u.id = up.user_id
                WHERE u.email = 'challenge@example.com' AND up.skill = 'DAILY_CHALLENGE'
                  AND up.score = 20 AND up.max_score = 100
                """, Integer.class);
        org.junit.jupiter.api.Assertions.assertEquals(1, progressRows);
    }
}
