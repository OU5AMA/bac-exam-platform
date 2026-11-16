package com.examplatform.grammar;

import com.examplatform.auth.CurrentUserService;
import com.examplatform.user.BadgeService;
import com.examplatform.user.User;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/grammar")
public class GrammarExercisesController {
    private static final List<String> FUNCTION_CHOICES = List.of(
        "ability", "disability", "probability/possibility", "certainty/deduction", "obligation",
        "prohibition", "permission", "advice", "past regret", "request", "habit", "no obligation"
    );

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;
    private final CurrentUserService currentUserService;
    private final BadgeService badgeService;

    public GrammarExercisesController(JdbcTemplate jdbc, ObjectMapper objectMapper,
            CurrentUserService currentUserService, BadgeService badgeService) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
        this.currentUserService = currentUserService;
        this.badgeService = badgeService;
    }

    @GetMapping("/unit/{unitNumber}/exercises")
    public List<Map<String, Object>> list(@PathVariable int unitNumber) {
        if (unitNumber < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unit number must be positive");
        User user = currentUserOrNull();
        return jdbc.query("""
            SELECT e.id, e.title, e.description, e.exercise_type, e.sentence_count, e.gap_count,
                   e.difficulty, e.max_score, e.display_order, best.score AS best_score, best.max_score AS best_max_score
            FROM grammar_exercises e
            LEFT JOIN LATERAL (
                SELECT a.score, a.max_score FROM grammar_exercise_attempts a
                WHERE a.user_id = ? AND a.exercise_id = e.id
                ORDER BY a.score / NULLIF(a.max_score, 0) DESC, a.completed_at DESC LIMIT 1
            ) best ON TRUE
            WHERE e.unit_number = ? AND e.skill = 'GRAMMAR'
            ORDER BY e.display_order
            """, (rs, row) -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", rs.getString("id"));
                item.put("title", rs.getString("title"));
                item.put("description", rs.getString("description"));
                item.put("type", rs.getString("exercise_type"));
                item.put("sentenceCount", rs.getInt("sentence_count"));
                item.put("gapCount", rs.getInt("gap_count"));
                item.put("difficulty", rs.getString("difficulty"));
                item.put("maxScore", rs.getInt("max_score"));
                BigDecimal bestScore = rs.getBigDecimal("best_score");
                item.put("bestScore", bestScore == null ? null : Map.of("score", bestScore, "maxScore", rs.getBigDecimal("best_max_score")));
                return item;
            }, user == null ? null : user.getId(), unitNumber);
    }

    @GetMapping("/unit/{unitNumber}/exercises/{exerciseId}")
    public Map<String, Object> detail(@PathVariable int unitNumber, @PathVariable String exerciseId) {
        Map<String, Object> exercise = getExercise(exerciseId);
        if (((Number) exercise.get("unit_number")).intValue() != unitNumber) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found");
        }
        Map<String, Object> result = metadata(exercise);
        result.put("functionChoices", FUNCTION_CHOICES);
        result.put("wordBank", exercise.get("word_bank"));
        result.put("questions", sanitizedQuestions(exercise));
        return result;
    }

    @PostMapping("/exercises/{exerciseId}/grade")
    public Map<String, Object> grade(@PathVariable String exerciseId, @RequestBody Map<String, Object> request) {
        User user = currentUserOrNull();
        Map<String, Object> exercise = getExercise(exerciseId);
        Map<String, Object> answers = stringKeyMap(request.get("answers"));
        List<Map<String, Object>> questions = questionList(exercise);
        boolean finalize = !Boolean.FALSE.equals(request.get("finalize"));
        List<Map<String, Object>> questionsToGrade = finalize ? questions : questions.stream()
            .filter(question -> answers.containsKey(String.valueOf(question.get("id")))).toList();
        if (questionsToGrade.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide an answer to check");
        boolean hideWordBank = Boolean.TRUE.equals(request.get("hideWordBank")) && exercise.get("word_bank") != null;
        List<Map<String, Object>> feedback = new ArrayList<>();
        int baseScore = 0;
        int questionBaseMax = "mixed".equals(exercise.get("exercise_type")) ? 2 : 1;

        for (Map<String, Object> question : questionsToGrade) {
            String id = String.valueOf(question.get("id"));
            Object supplied = answers.get(id);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", id);
            if ("identify_function".equals(exercise.get("exercise_type"))) {
                String answer = supplied == null ? "" : String.valueOf(supplied);
                boolean correct = matches(answer, stringList(question.get("acceptedFunctions")));
                if (correct) baseScore++;
                item.put("correct", correct);
                item.put("canonicalAnswer", question.get("canonicalFunction"));
                item.put("acceptedAnswers", question.get("acceptedFunctions"));
                item.put("function", question.get("canonicalFunction"));
                item.put("explanation", question.get("explanation"));
                item.put("pointsEarned", correct ? 1 : 0);
            } else if ("mixed".equals(exercise.get("exercise_type"))) {
                Map<String, Object> response = stringKeyMap(supplied);
                String modalAnswer = response.get("modal") == null ? "" : String.valueOf(response.get("modal"));
                String functionAnswer = response.get("function") == null ? "" : String.valueOf(response.get("function"));
                boolean modalCorrect = matches(modalAnswer, stringList(question.get("acceptedAnswers")));
                boolean functionCorrect = matches(functionAnswer, stringList(question.get("acceptedFunctions")));
                int points = (modalCorrect ? 1 : 0) + (functionCorrect ? 1 : 0);
                baseScore += points;
                item.put("modalCorrect", modalCorrect);
                item.put("functionCorrect", functionCorrect);
                item.put("correct", modalCorrect && functionCorrect);
                item.put("canonicalAnswer", question.get("canonicalAnswer"));
                item.put("acceptedAnswers", question.get("acceptedAnswers"));
                item.put("canonicalFunction", question.get("canonicalFunction"));
                item.put("explanation", question.get("explanation"));
                item.put("pointsEarned", points);
            } else {
                String answer = supplied == null ? "" : String.valueOf(supplied);
                boolean correct = matches(answer, stringList(question.get("acceptedAnswers")));
                if (correct) baseScore++;
                item.put("correct", correct);
                item.put("canonicalAnswer", question.get("canonicalAnswer"));
                item.put("acceptedAnswers", question.get("acceptedAnswers"));
                item.put("function", question.get("function"));
                item.put("explanation", question.get("explanation"));
                item.put("pointsEarned", correct ? 1 : 0);
            }
            feedback.add(item);
        }

        if (!finalize) {
            Map<String, Object> check = new LinkedHashMap<>();
            check.put("checked", true);
            check.put("feedback", feedback);
            return check;
        }

        int baseMax = ((Number) exercise.get("max_score")).intValue();
        int attemptNumber = user == null ? 1 : jdbc.queryForObject("SELECT COUNT(*) + 1 FROM grammar_exercise_attempts WHERE user_id = ? AND exercise_id = ?", Integer.class, user.getId(), exerciseId);
        int awardedBaseScore = user == null || attemptNumber == 1 ? baseScore : Math.min(baseScore, (int) Math.floor(baseMax * .70));
        BigDecimal multiplier = hideWordBank ? new BigDecimal("1.5") : BigDecimal.ONE;
        BigDecimal score = BigDecimal.valueOf(awardedBaseScore).multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
        BigDecimal maxScore = BigDecimal.valueOf(baseMax).multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
        if (user != null) {
            jdbc.update("INSERT INTO grammar_exercise_attempts (user_id, exercise_id, score, max_score, attempt_number) VALUES (?, ?, ?, ?, ?)",
                user.getId(), exerciseId, score, maxScore, attemptNumber);
        }

        int percent = maxScore.signum() == 0 ? 0 : score.multiply(BigDecimal.valueOf(100)).divide(maxScore, 0, RoundingMode.HALF_UP).intValue();
        boolean alreadyHasGrammarBadge = user == null || (user.getBadges() != null && List.of(user.getBadges().split(",")).contains("GRAMMAR_GURU"));
        if (user != null) badgeService.checkAndAwardBadges(user, "GRAMMAR", percent);
        int progressScale = hideWordBank ? 3 : 2;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("exerciseId", exerciseId);
        result.put("score", score);
        result.put("maxScore", maxScore);
        result.put("baseScore", awardedBaseScore);
        result.put("baseMaxScore", baseMax);
        result.put("attemptNumber", attemptNumber);
        result.put("retryCapApplied", attemptNumber > 1);
        result.put("percent", percent);
        result.put("progressScore", score.multiply(BigDecimal.valueOf(progressScale)).intValue());
        result.put("progressMaxScore", maxScore.multiply(BigDecimal.valueOf(progressScale)).intValue());
        result.put("feedback", feedback);
        result.put("reviewFunctions", questions.stream().map(q -> q.get("function") != null ? q.get("function") : q.get("canonicalFunction"))
            .filter(value -> value != null).distinct().toList());
        result.put("badgeAwarded", percent == 100 && !alreadyHasGrammarBadge ? "GRAMMAR_GURU" : null);
        return result;
    }

    private User currentUserOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) return null;
        return currentUserService.getCurrentUser();
    }

    private Map<String, Object> getExercise(String id) {
        List<Map<String, Object>> rows = jdbc.query("SELECT id, unit_number, skill, title, description, exercise_type, sentence_count, gap_count, difficulty, max_score, display_order, word_bank::text AS word_bank, questions_json::text AS questions_json FROM grammar_exercises WHERE id = ?",
            (rs, row) -> {
                try {
                    Map<String, Object> exercise = new LinkedHashMap<>();
                    exercise.put("id", rs.getString("id"));
                    exercise.put("unit_number", rs.getInt("unit_number"));
                    exercise.put("skill", rs.getString("skill"));
                    exercise.put("title", rs.getString("title"));
                    exercise.put("description", rs.getString("description"));
                    exercise.put("exercise_type", rs.getString("exercise_type"));
                    exercise.put("sentence_count", rs.getInt("sentence_count"));
                    exercise.put("gap_count", rs.getInt("gap_count"));
                    exercise.put("difficulty", rs.getString("difficulty"));
                    exercise.put("max_score", rs.getInt("max_score"));
                    exercise.put("display_order", rs.getInt("display_order"));
                    exercise.put("word_bank", rs.getString("word_bank") == null ? null : objectMapper.readValue(rs.getString("word_bank"), Object.class));
                    exercise.put("questions", objectMapper.readValue(rs.getString("questions_json"), objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class)));
                    return exercise;
                } catch (Exception exception) {
                    throw new IllegalStateException("Could not read grammar exercise content", exception);
                }
            }, id);
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found");
        return rows.getFirst();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> questionList(Map<String, Object> exercise) {
        return (List<Map<String, Object>>) exercise.get("questions");
    }

    private Map<String, Object> metadata(Map<String, Object> exercise) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", exercise.get("id"));
        result.put("unitNumber", exercise.get("unit_number"));
        result.put("title", exercise.get("title"));
        result.put("description", exercise.get("description"));
        result.put("type", exercise.get("exercise_type"));
        result.put("sentenceCount", exercise.get("sentence_count"));
        result.put("gapCount", exercise.get("gap_count"));
        result.put("difficulty", exercise.get("difficulty"));
        result.put("maxScore", exercise.get("max_score"));
        return result;
    }

    private List<Map<String, Object>> sanitizedQuestions(Map<String, Object> exercise) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> question : questionList(exercise)) {
            Map<String, Object> safe = new LinkedHashMap<>(question);
            safe.remove("canonicalAnswer");
            safe.remove("acceptedAnswers");
            safe.remove("canonicalFunction");
            safe.remove("acceptedFunctions");
            safe.remove("explanation");
            safe.remove("function");
            result.add(safe);
        }
        return result;
    }

    private Map<String, Object> stringKeyMap(Object value) {
        if (!(value instanceof Map<?, ?> map)) return Map.of();
        Map<String, Object> result = new HashMap<>();
        map.forEach((key, item) -> result.put(String.valueOf(key), item));
        return result;
    }

    private List<String> stringList(Object value) {
        if (!(value instanceof List<?> list)) return List.of();
        return list.stream().map(String::valueOf).toList();
    }

    private boolean matches(String actual, List<String> accepted) {
        String normalized = normalize(actual);
        return accepted.stream().anyMatch(answer -> normalize(answer).equals(normalized));
    }

    private String normalize(String value) {
        return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFKC)
            .replace('’', '\'').replace('‘', '\'').trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }
}
