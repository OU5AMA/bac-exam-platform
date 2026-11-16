INSERT INTO vocabulary_words (unit_number, cluster, word, part_of_speech, definition, example_sentence, collocation, noun_form, adjective_form, darija_gloss) VALUES
(2, 'Laughter & Comedy', 'humour', 'noun', 'The quality of being funny.', 'A good sense of humour helps you make friends.', 'sense of humour', 'humour', 'humorous', 'الفكاهة / humour'),
(2, 'Laughter & Comedy', 'joke', 'noun', 'Something said to make people laugh.', 'He told a joke to break the ice.', 'tell a joke', NULL, NULL, 'نكتة / blague'),
(2, 'Laughter & Comedy', 'comedian', 'noun', 'A person who makes people laugh.', 'The comedian had the whole audience laughing.', 'stand-up comedian', NULL, NULL, 'كوميدي / humoriste'),
(2, 'Laughter & Comedy', 'amusing', 'adjective', 'Funny and entertaining.', 'The film was amusing from start to finish.', 'highly amusing', 'amusement', 'amusing', 'مضحك / amusant'),
(2, 'Laughter & Comedy', 'laugh', 'verb / noun', 'To make sounds showing you find something funny.', 'We laughed until we cried.', 'burst out laughing', NULL, NULL, 'يضحك / rire'),
(2, 'Feelings & Reactions', 'amused', 'adjective', 'Finding something funny.', 'She was amused by his silly mistake.', 'be amused by', 'amusement', 'amused', 'مستمتع / amusé'),
(2, 'Feelings & Reactions', 'embarrassed', 'adjective', 'Feeling ashamed or awkward.', 'He felt embarrassed when he forgot his lines.', 'feel embarrassed', 'embarrassment', 'embarrassed / embarrassing', 'محرج / gêné'),
(2, 'Feelings & Reactions', 'embarrassing', 'adjective', 'Causing someone to feel embarrassed.', 'It was an embarrassing moment for everyone.', 'deeply embarrassing', 'embarrassment', 'embarrassed / embarrassing', 'محرج / embarrassant'),
(2, 'Feelings & Reactions', 'stress', 'noun', 'Worry caused by a difficult situation.', 'Laughter is a great way to reduce stress.', 'reduce stress', 'stress', 'stressed / stressful', 'توتر / stress'),
(2, 'Feelings & Reactions', 'relaxed', 'adjective', 'Calm and not worried.', 'A funny film helps you feel relaxed.', 'feel relaxed', 'relaxation', 'relaxed', 'مرتاح / détendu'),
(2, 'Humour in Society', 'boost', 'verb', 'To increase or improve something.', 'A good joke can boost your mood.', 'boost morale', NULL, NULL, 'يعزز / renforcer'),
(2, 'Humour in Society', 'atmosphere', 'noun', 'The feeling in a place.', 'Humour creates a friendly atmosphere in class.', 'a relaxed atmosphere', NULL, NULL, 'جو / atmosphère'),
(2, 'Humour in Society', 'remedy', 'noun', 'A way to fix a problem.', 'Laughter is a natural remedy for stress.', 'a natural remedy', NULL, NULL, 'علاج / remède'),
(2, 'Humour in Society', 'conflict', 'noun', 'A serious disagreement.', 'Humour can help solve conflicts between people.', 'solve a conflict', NULL, NULL, 'خلاف / conflit'),
(2, 'Humour in Society', 'hurtful', 'adjective', 'Causing emotional pain.', 'Some jokes can be hurtful, even if you do not mean them.', 'hurtful words', 'hurt', 'hurtful', 'جارح / blessant'),
(2, 'Humour in Society', 'make fun of', 'phrasal verb', 'To laugh at someone in an unkind way.', 'It is wrong to make fun of people.', 'make fun of someone', NULL, NULL, 'يسخر من / se moquer de')
ON CONFLICT (unit_number, word) DO UPDATE SET cluster=EXCLUDED.cluster, part_of_speech=EXCLUDED.part_of_speech, definition=EXCLUDED.definition, example_sentence=EXCLUDED.example_sentence, collocation=EXCLUDED.collocation, noun_form=EXCLUDED.noun_form, adjective_form=EXCLUDED.adjective_form, darija_gloss=EXCLUDED.darija_gloss;
