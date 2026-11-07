package com.examplatform.vocabulary;

public record VocabularyWordResponse(long id, int unitNumber, String cluster, String word, String partOfSpeech,
        String definition, String exampleSentence, String collocation, String nounForm, String adjectiveForm,
        String darijaGloss) {}
