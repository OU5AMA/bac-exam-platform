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
class ClassLeaderboardAverageIntegrationTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void ranksByAveragePointsIncludingMembersWithNoScores() throws Exception {
        Cookie classAStudent = registerAndLogin("averageclassa");
        Cookie classBOwner = registerAndLogin("averageclassbowner");
        Cookie classBMember = registerAndLogin("averageclassbmember");

        createClass(classAStudent, "Class A");
        createClass(classBOwner, "Class B");
        String classBCode = mockMvc.perform(get("/api/classes/my-class").cookie(classBOwner))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        String joinCode = com.jayway.jsonpath.JsonPath.read(classBCode, "$.joinCode");
        mockMvc.perform(post("/api/classes/join").with(csrf()).cookie(classBMember)
                        .contentType("application/json").content("{\"joinCode\":\"" + joinCode + "\"}"))
                .andExpect(status().isOk());

        saveProgress(classAStudent, 10, 10);
        saveProgress(classBOwner, 10, 10);
        saveProgress(classBOwner, 5, 10);

        mockMvc.perform(get("/api/classes/leaderboard").cookie(classAStudent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topClasses[0].name").value("Class A"))
                .andExpect(jsonPath("$.topClasses[0].averagePoints").value(100))
                .andExpect(jsonPath("$.topClasses[1].name").value("Class B"))
                .andExpect(jsonPath("$.topClasses[1].totalPoints").value(150))
                .andExpect(jsonPath("$.topClasses[1].averagePoints").value(75));
    }

    private void createClass(Cookie owner, String name) throws Exception {
        mockMvc.perform(post("/api/classes").with(csrf()).cookie(owner).contentType("application/json")
                        .content("{\"name\":\"" + name + "\"}"))
                .andExpect(status().isCreated());
    }

    private void saveProgress(Cookie student, int score, int maxScore) throws Exception {
        mockMvc.perform(post("/api/progress/save").with(csrf()).cookie(student).contentType("application/json")
                        .content("{\"unitNumber\":1,\"skill\":\"GRAMMAR\",\"score\":" + score + ",\"maxScore\":" + maxScore + "}"))
                .andExpect(status().isCreated());
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
