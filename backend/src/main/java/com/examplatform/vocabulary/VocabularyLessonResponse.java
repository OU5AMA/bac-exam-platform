package com.examplatform.vocabulary;

import java.util.List;

public record VocabularyLessonResponse(int unitNumber, String unitTitle, String contextParagraph,
        List<VocabularyWordResponse> words, List<WordGroup> wordGroups, List<Collocation> collocations,
        List<CommonMistake> commonMistakes, List<WordPair> wordPairs) {
    public record WordGroup(String cluster, List<VocabularyWordResponse> words) {}
    public record Collocation(String phrase, String meaning) {}
    public record CommonMistake(String incorrect, String correct, String note) {}
    public record WordPair(String noun, String adjective) {}
}
