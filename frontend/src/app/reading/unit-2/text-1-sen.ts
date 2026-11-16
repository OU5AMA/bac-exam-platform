import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-2-reading-humour-sen',
  slug: 'unit-2-reading-humour-sen',
  title: 'Why Is Humour Important?',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 2 — Humour',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading with a shorter, simpler text about humour.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Humour is an important part of our lives. It makes people laugh and feel happy. We can find humour in jokes, funny stories, cartoons and comedy films. Sometimes, laughing helps us forget our problems and feel better.',
    'Humour is also good for our health. <strong>It</strong> helps us relax and reduces stress. In some hospitals, clowns visit sick children. <strong>They</strong> tell jokes and make funny performances to make children smile and feel less afraid.',
    'At school, humour can make lessons more enjoyable. A teacher who tells funny stories can make students feel comfortable and interested in learning. Humour can also help people make friends and build good relationships.',
    "However, some jokes can hurt people. Making fun of someone's appearance or weaknesses is not good. We should use humour to make people happy, not to make them feel sad or embarrassed.",
    'In conclusion, humour is important because it brings people together and makes life more enjoyable.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is mainly about:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The history of jokes' }, { value: 'b', label: 'b. The importance of humour' }, { value: 'c', label: 'c. Famous comedy films' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'What does humour make people feel?', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'Why do clowns visit sick children in hospitals?', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'How can humour help students at school?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Write TRUE or FALSE.', questions: [
      { id: 's-c1', prompt: 'Humour can help people relax.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: "Making fun of people's appearance is a good way to make friends.", marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'Not feeling worried or nervous (paragraph 2).', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'To make someone smile or laugh (paragraph 2).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following words refer to?', questions: [
      { id: 's-e1', prompt: '“It” (paragraph 2).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“They” (paragraph 2).', marks: 1, type: 'short' },
    ] },
  ],
};
