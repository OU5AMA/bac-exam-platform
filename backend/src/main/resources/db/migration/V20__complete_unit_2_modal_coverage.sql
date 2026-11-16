UPDATE grammar_lessons
SET content_json = jsonb_set(
    jsonb_set(
        jsonb_set(
            content_json,
            '{functions,4,teachingNote}',
            to_jsonb('Can is an informal permission question, could is more polite, and may is the most formal. Use may only when the context is genuinely formal.'::text)
        ),
        '{functions,7,examples}',
        (content_json #> '{functions,7,examples}') || '["Can you pass the microphone, please?"]'::jsonb
    ),
    '{pastModals}',
    (content_json -> 'pastModals') || '[{"form":"shouldn’t have + past participle","meaning":"Regret or criticism of a past action","example":"You shouldn’t have laughed at his mistake.","gloss":"ما كانش خاصك / tu n’aurais pas dû"}]'::jsonb
)
WHERE unit_number = 2;
