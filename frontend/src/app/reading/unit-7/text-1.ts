import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-7-reading-citizenship',
  slug: 'unit-7-reading-citizenship',
  title: 'Being a Responsible Citizen',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 7 — Citizenship',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about responsible citizenship and community participation.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'Citizenship is not only about having a nationality or carrying an identity card. It also means being an active and responsible member of society. Good citizens understand their rights, respect their responsibilities and contribute to making their communities better places to live.',
    'One important responsibility of citizens is respecting the law and the rights of others. People should respect public property, follow traffic rules and protect the environment. For example, throwing rubbish in the streets, damaging public facilities or wasting water can negatively affect the whole community. Responsible citizens understand that their actions have consequences.',
    'Citizenship also involves helping others and participating in community activities. People can volunteer in local organisations, donate clothes to families in need, clean public spaces or support elderly neighbours. Young people can also make a difference by taking part in school projects and environmental campaigns. <strong>These activities</strong> develop solidarity and encourage people to work together.',
    'However, being a good citizen does not mean accepting every situation without question. Citizens should express their opinions peacefully, respect different points of view and take part in decisions that affect their communities. <strong>They</strong> should also be aware of social problems and look for positive ways to solve them.',
    "In conclusion, building a better society is everyone's responsibility. Small actions, such as helping a neighbour, keeping streets clean or respecting others, can create positive changes. A responsible citizen does not simply ask what society can do for them, but also considers what they can do for society.",
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The Importance of Travelling' }, { value: 'b', label: 'b. Being a Responsible Citizen' }, { value: 'c', label: 'c. The Problems of Modern Technology' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 'n-b1', prompt: 'What does being a responsible citizen mean?', marks: 1, type: 'short' },
      { id: 'n-b2', prompt: 'Mention two actions that can negatively affect a community.', marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'How can young people contribute to their communities?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
      { id: 'n-c1', prompt: 'Citizenship is only about having a nationality.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: "Citizens should express their opinions peacefully and respect others' points of view.", marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words or expressions in the text that mean the following.', questions: [
      { id: 'n-d1', prompt: 'People who freely offer to help others without being paid (paragraph 3).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'Working together and supporting one another (paragraph 3).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 'n-e1', prompt: '“These activities” (paragraph 3).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“They” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
