UPDATE grammar_lessons
SET content_json = jsonb_set(
    jsonb_set(
        content_json,
        '{functions,5,name}',
        to_jsonb('Ability / Inability'::text)
    ),
    '{functions,5}',
    (content_json #> '{functions,5}') || '{
      "name":"Ability / Inability",
      "modals":["can","can’t","could","couldn’t","be able to"],
      "meaning":"Someone is capable of doing something, or unable to do it.",
      "examples":["She can speak three languages.","He could swim when he was five.","I was able to finish the exam on time.","I couldn’t stop laughing at the comedian’s joke.","The audience can’t stop laughing."],
      "formNote":"Can / can’t for present ability or inability; could / couldn’t for general past ability or inability; was / were able to for one specific past success.",
      "teachingNote":"For a specific successful action in the past, use was / were able to, not could. Can’t stop laughing means being unable to stop."
    }'::jsonb
)
WHERE unit_number = 2;
