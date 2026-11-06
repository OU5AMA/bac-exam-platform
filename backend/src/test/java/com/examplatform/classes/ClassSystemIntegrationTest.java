package com.examplatform.classes;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ClassSystemIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void studentsCanCreateJoinEarnPointsAndSeeTheirClassStanding() throws Exception {
        Cookie owner = registerAndLogin("classowner");
        Cookie member = registerAndLogin("classmember");

        MvcResult created = mockMvc.perform(post("/api/classes")
                        .with(csrf()).cookie(owner).contentType("application/json")
                        .content("{\"name\":\"2Bac SM-A\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.memberCount").value(1))
                .andExpect(jsonPath("$.maxMembers").value(20))
                .andReturn();
        String joinCode = com.jayway.jsonpath.JsonPath.read(created.getResponse().getContentAsString(), "$.joinCode");

        mockMvc.perform(post("/api/classes/join")
                        .with(csrf()).cookie(member).contentType("application/json")
                        .content("{\"joinCode\":\"" + joinCode + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberCount").value(2));

        mockMvc.perform(post("/api/progress/save")
                        .with(csrf()).cookie(member).contentType("application/json")
                        .content("{\"unitNumber\":1,\"skill\":\"VOCABULARY\",\"score\":8,\"maxScore\":10}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.score").value(8));

        mockMvc.perform(get("/api/classes/leaderboard").cookie(owner))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topClasses[0].name").value("2Bac SM-A"))
                .andExpect(jsonPath("$.topClasses[0].memberCount").value(2))
                .andExpect(jsonPath("$.topClasses[0].totalPoints").value(8))
                .andExpect(jsonPath("$.myClass.currentClass").value(true));

        mockMvc.perform(get("/api/classes/my-class").cookie(member))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("2Bac SM-A"));
    }

    private Cookie registerAndLogin(String username) throws Exception {
        String email = username + "@example.com";
        mockMvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json")
                        .content("{\"username\":\"" + username + "\",\"email\":\"" + email + "\",\"password\":\"password123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isCreated());
        MvcResult login = mockMvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json")
                        .content("{\"identifier\":\"" + email + "\",\"password\":\"password123\"}"))
                .andExpect(status().isOk()).andReturn();
        return login.getResponse().getCookie("access_token");
    }
}
