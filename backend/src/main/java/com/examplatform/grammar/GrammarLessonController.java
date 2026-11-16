package com.examplatform.grammar;

import tools.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grammar")
public class GrammarLessonController {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public GrammarLessonController(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/unit/{unitNumber}")
    public Map<String, Object> lesson(@PathVariable int unitNumber) {
        if (unitNumber < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unit number must be positive");
        }
        List<Map<String, Object>> rows = jdbc.query(
            "SELECT unit_title, content_json::text AS content_json FROM grammar_lessons WHERE unit_number = ?",
            (rs, row) -> {
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = objectMapper.readValue(rs.getString("content_json"), Map.class);
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("unitNumber", unitNumber);
                    result.put("unitTitle", rs.getString("unit_title"));
                    result.putAll(content);
                    return result;
                } catch (Exception exception) {
                    throw new IllegalStateException("Could not read grammar lesson content", exception);
                }
            }, unitNumber
        );
        if (rows.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Grammar lesson not found");
        }
        return rows.getFirst();
    }
}
