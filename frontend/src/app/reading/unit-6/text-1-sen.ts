import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-6-reading-women-power-sen',
  slug: 'unit-6-reading-women-power-sen',
  title: 'Women and Equal Opportunities',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 6 — Women and Power',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about women and equal opportunities in a simpler text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Women are important members of society. They work in schools, hospitals, companies and governments. In the past, many women did not have the same opportunities as men. Some girls could not go to school, and some women could not choose their jobs.',
    'Today, many women are successful in different fields. <strong>They</strong> become teachers, doctors, scientists and business leaders. They also take part in politics and help make important decisions. Women can achieve great things when they have equal opportunities.',
    "However, gender inequality still exists. In some places, women earn less money than men for similar work. Some people also believe that certain jobs are only for men or only for women. <strong>These ideas</strong> are unfair and limit people's choices.",
    "Everyone can help promote equality. Governments should protect women's rights. Schools should teach boys and girls to respect each other. Families should encourage both boys and girls to follow their dreams.",
    'Women and men should have equal opportunities in education, work and society. When everyone is treated fairly, society becomes stronger.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is about:', marks: 1, type: 'choice', options: [{ value: 'a', label: "a. Women's rights and equal opportunities" }, { value: 'b', label: 'b. The importance of travelling' }, { value: 'c', label: 'c. Different school subjects' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'Mention two jobs women do.', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'Give one example of gender inequality from the text.', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'What should schools teach boys and girls?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False.', questions: [
      { id: 's-c1', prompt: 'In the past, all women had the same opportunities as men.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: 'Families should encourage both boys and girls to follow their dreams.', marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'The chance to do something.', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'To protect or support something.', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 's-e1', prompt: '“They” (paragraph 2).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“These ideas” (paragraph 3).', marks: 1, type: 'short' },
    ] },
  ],
};
