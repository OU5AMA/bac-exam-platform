UPDATE grammar_lessons
SET content_json = jsonb_set(
    content_json,
    '{formRules,3}',
    to_jsonb('Core modals do not use do, does, or did in questions or negatives: Must I go? Can you help? Semi-modals use do-support: Do I have to go? Did she use to play?'::text)
)
WHERE unit_number = 2;
