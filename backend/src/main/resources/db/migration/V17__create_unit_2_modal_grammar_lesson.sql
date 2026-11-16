CREATE TABLE grammar_lessons (
    unit_number INT PRIMARY KEY CHECK (unit_number > 0),
    unit_title VARCHAR(120) NOT NULL,
    content_json JSONB NOT NULL
);

INSERT INTO grammar_lessons (unit_number, unit_title, content_json) VALUES
(2, 'Humour', $$
{
  "objective": "Learn what each modal does in a sentence — not just what it means.",
  "intro": "A modal is a helping verb that shows the speaker’s attitude: possibility, certainty, obligation, ability, permission, advice, or regret.",
  "formRules": [
    "Use modal + base verb: She can swim.",
    "Do not add -s for he, she, or it: He can swim, not He cans swim.",
    "Do not add to after a modal: must go, not must to go. Exceptions include ought to, have to, and used to.",
    "Do not use do, does, or did to make modal questions or negatives: Must I go? Can you help?"
  ],
  "formChecks": [
    {"incorrect":"He cans swim.","correct":"He can swim."},
    {"incorrect":"Do I must go?","correct":"Must I go?"}
  ],
  "functions": [
    {"name":"Probability / Possibility","modals":["may","might","could"],"meaning":"Something is possible, but you are not certain.","examples":["It’s cloudy — it may rain later.","She might be at home; I’m not sure.","This could be the answer, but I need to check."],"formNote":"modal + base verb: may / might / could + infinitive.","teachingNote":"Might is a little less certain than may. Could is common in spoken English for possibility.","featured":true},
    {"name":"Certainty / Deduction","modals":["must have","must be","can’t be","can’t have"],"meaning":"You feel almost sure because the evidence points that way.","examples":["You’re so excited — you must have answered all the questions.","He must be tired; he’s been working all day.","She can’t be serious — that’s a joke!","They can’t have left already; their bags are still here."],"formNote":"Present deduction: must / can’t + be + adjective or noun. Past deduction: must / can’t have + past participle.","teachingNote":"Deduction must means ‘I’m almost sure’; obligation must means ‘it is required’. They are different functions.","featured":true},
    {"name":"Obligation / Necessity","modals":["must","have to","need to"],"meaning":"Something is required or necessary.","examples":["You must wear a seatbelt.","I have to finish this project tonight.","We need to book the tickets early."],"formNote":"must + base verb; have to / need to + infinitive.","teachingNote":"Must often expresses the speaker’s strong authority or personal obligation. Have to often comes from an outside rule or circumstance. Mustn’t means prohibited; don’t have to means unnecessary.","featured":true},
    {"name":"Prohibition","modals":["mustn’t","can’t"],"meaning":"Something is not allowed.","examples":["You mustn’t smoke here.","You can’t park in this area.","You don’t have to come — it’s optional."],"formNote":"mustn’t / can’t + base verb. Don’t have to means ‘not necessary’, not ‘not allowed’. ","teachingNote":"You don’t have to come = you may come, but it isn’t necessary. You mustn’t come = you are not allowed.","featured":false},
    {"name":"Permission","modals":["can","may","could"],"meaning":"You ask for or give permission to do something.","examples":["Can I borrow your pen?","May I leave early?","Could I use your phone, please?"],"formNote":"Can / may / could + subject + base verb for a question.","teachingNote":"Could is more polite than can; may is the most formal.","featured":false},
    {"name":"Ability","modals":["can","could","be able to"],"meaning":"Someone is capable of doing something.","examples":["She can speak three languages.","He could swim when he was five.","I was able to finish the exam on time."],"formNote":"Can for present ability; could for general past ability; was / were able to for one specific past success.","teachingNote":"For a specific successful action in the past, use was / were able to, not could.","featured":false},
    {"name":"Advice / Recommendation","modals":["should","ought to","had better"],"meaning":"You suggest what is right or best to do.","examples":["You should revise every day.","You ought to apologize.","You had better leave now, or you’ll be late."],"formNote":"should + base verb; ought to / had better + base verb.","teachingNote":"Had better is stronger and often warns that there may be a consequence.","featured":false},
    {"name":"Regret / Criticism of the Past","modals":["should have","could have","might have"],"meaning":"You look back at the past with regret, criticism, or a guess about what happened.","examples":["I should have studied harder.","You shouldn’t have told him.","She could have won, but she got injured.","He might have forgotten the meeting."],"formNote":"modal + have + past participle. Use the same form after a negative modal: shouldn’t have told.","teachingNote":"A very common Bac exam distinction: should have often expresses regret about something that did not happen.","featured":true},
    {"name":"Requests / Offers / Invitations","modals":["can","could","will","would","shall"],"meaning":"You ask someone to do something, offer help, or invite people to act together.","examples":["Could you help me?","Would you like some tea?","Shall we start?","I’ll carry that for you."],"formNote":"Use a modal + base verb. Would you like + noun / to + verb is a polite offer.","teachingNote":"Could and would often make requests and offers more polite.","featured":false},
    {"name":"Past Habits","modals":["used to","would"],"meaning":"You describe something that happened regularly in the past.","examples":["I used to play football every weekend.","We would spend summers at my grandmother’s.","I used to live near the school."],"formNote":"used to + base verb; would + base verb for repeated past actions.","teachingNote":"Used to describes past habits and states. Would describes repeated past actions, not states.","featured":false}
  ],
  "contrasts": [
    {"modal":"must","uses":[{"function":"Obligation","example":"You must wear a seatbelt."},{"function":"Deduction","example":"He must be tired; he’s been working all day."}]},
    {"modal":"can","uses":[{"function":"Ability","example":"She can swim."},{"function":"Permission","example":"Can I go now?"}]},
    {"modal":"can’t","uses":[{"function":"Prohibition","example":"You can’t park here."},{"function":"Deduction","example":"That can’t be true."}]},
    {"modal":"could","uses":[{"function":"Past ability","example":"He could swim when he was five."},{"function":"Possibility","example":"It could rain later."},{"function":"Polite request","example":"Could you help me?"}]}
  ],
  "pastModals": [
    {"form":"must have + past participle","meaning":"Deduction about the past","example":"She must have missed the bus.","gloss":"أكيد أنها / elle a sûrement"},
    {"form":"can’t have + past participle","meaning":"Negative deduction about the past","example":"They can’t have left; their bags are here.","gloss":"من المستحيل أنهم / ils n’ont sûrement pas"},
    {"form":"should have + past participle","meaning":"Regret or criticism","example":"I should have studied harder.","gloss":"كان خاصني / j’aurais dû"},
    {"form":"could have + past participle","meaning":"An unrealized possibility","example":"She could have won.","gloss":"كان ممكن / elle aurait pu"},
    {"form":"might have + past participle","meaning":"Possibility in the past","example":"He might have forgotten.","gloss":"ربما نسى / il a peut-être oublié"}
  ],
  "contextParagraph":"The class is preparing a comedy show for Friday. Sara might write a short sketch, and Youssef could help with the sound. They must practise after school, but nobody has to stay late. They should keep the jokes kind, because students mustn’t make fun of anyone. Their teacher says the show may boost everyone’s mood, and the class could have finished sooner if they had planned earlier.",
  "mistakes":[
    {"incorrect":"He cans swim.","correct":"He can swim.","explanation":"Modal verbs do not take -s in the third person."},
    {"incorrect":"I must to go.","correct":"I must go.","explanation":"Use the base verb directly after must."},
    {"incorrect":"Do you can help me?","correct":"Can you help me?","explanation":"Form modal questions by putting the modal before the subject; don’t add do."},
    {"incorrect":"I should studied.","correct":"I should have studied.","explanation":"Past regret uses modal + have + past participle."},
    {"incorrect":"You mustn’t come. (meaning: it isn’t necessary)","correct":"You don’t have to come.","explanation":"Mustn’t means prohibited; don’t have to means there is no obligation."},
    {"incorrect":"I could finish the exam yesterday. (specific success)","correct":"I was able to finish the exam yesterday.","explanation":"Use was / were able to for one specific successful action in the past."}
  ],
  "selfCheck":[
    {"prompt":"Which modal form often expresses regret about the past?","answer":"should have + past participle"},
    {"prompt":"What is the difference between mustn’t and don’t have to?","answer":"Mustn’t = not allowed. Don’t have to = not necessary."},
    {"prompt":"Complete: You’re soaked — you ___ have forgotten your umbrella.","answer":"might (or must)"},
    {"prompt":"Which form describes one specific past success?","answer":"was / were able to"},
    {"prompt":"Can would describe a past state, such as ‘I would live there’?","answer":"No. Use used to for past states; would is for repeated actions."}
  ]
}
$$::jsonb)
ON CONFLICT (unit_number) DO UPDATE SET unit_title=EXCLUDED.unit_title, content_json=EXCLUDED.content_json;
