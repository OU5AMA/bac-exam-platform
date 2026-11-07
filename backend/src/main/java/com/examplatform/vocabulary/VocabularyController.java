package com.examplatform.vocabulary;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {
    private final JdbcTemplate jdbc;
    public VocabularyController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping("/unit/{unitNumber}")
    public VocabularyLessonResponse lesson(@PathVariable("unitNumber") int unitNumber) {
        if (unitNumber < 1) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Unit number must be positive");
        List<VocabularyWordResponse> words = jdbc.query("SELECT id, unit_number, cluster, word, part_of_speech, definition, example_sentence, collocation, noun_form, adjective_form, darija_gloss FROM vocabulary_words WHERE unit_number = ? ORDER BY CASE cluster WHEN 'Energy & Initiative' THEN 1 WHEN 'Mind & Creativity' THEN 2 ELSE 3 END, word", (rs, row) -> new VocabularyWordResponse(rs.getLong("id"), rs.getInt("unit_number"), rs.getString("cluster"), rs.getString("word"), rs.getString("part_of_speech"), rs.getString("definition"), rs.getString("example_sentence"), rs.getString("collocation"), rs.getString("noun_form"), rs.getString("adjective_form"), rs.getString("darija_gloss")), unitNumber);
        if (words.isEmpty()) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Vocabulary lesson not found");
        List<VocabularyLessonResponse.Collocation> collocations = words.stream().map(w -> new VocabularyLessonResponse.Collocation(w.collocation(), w.definition())).toList();
        List<VocabularyLessonResponse.WordPair> pairs = words.stream().filter(w -> w.nounForm() != null && w.adjectiveForm() != null && w.nounForm().equalsIgnoreCase(w.word())).map(w -> new VocabularyLessonResponse.WordPair(w.nounForm(), w.adjectiveForm())).toList();
        java.util.Map<String, List<VocabularyWordResponse>> grouped = words.stream().collect(java.util.stream.Collectors.groupingBy(VocabularyWordResponse::cluster, java.util.LinkedHashMap::new, java.util.stream.Collectors.toList()));
        List<VocabularyLessonResponse.WordGroup> wordGroups = grouped.entrySet().stream().map(entry -> new VocabularyLessonResponse.WordGroup(entry.getKey(), entry.getValue())).toList();
        return new VocabularyLessonResponse(unitNumber, unitNumber == 1 ? "Gift of Youth" : "Unit " + unitNumber, CONTEXT, words, wordGroups, collocations, MISTAKES, pairs);
    }

    private static final String CONTEXT = "Amina, an 18-year-old student from Casablanca, has the energy and determination to achieve her ambition of helping young people. Her creativity and curiosity led her to design an innovative reading club, and her enthusiasm soon inspired classmates to join. She is punctual, reliable, and patient when the group faces a challenge. By volunteering, they show maturity, cooperation, and tolerance while building useful skills. Amina believes that youth can bring vitality to a community and overcome obstacles together.";
    private static final List<VocabularyLessonResponse.CommonMistake> MISTAKES = List.of(
        new VocabularyLessonResponse.CommonMistake("She is very energy.", "She has a lot of energy.", "Energy is a noun. Say someone is energetic, or use have energy."),
        new VocabularyLessonResponse.CommonMistake("He has tolerance to differences.", "He shows tolerance toward differences.", "Tolerance is a noun; show tolerance toward is a useful pattern."),
        new VocabularyLessonResponse.CommonMistake("He is responsible of the project.", "He is responsible for the project.", "Use responsible for.")
    );
}
