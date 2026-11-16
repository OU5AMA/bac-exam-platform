import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-2-reading-humour',
  slug: 'unit-2-reading-humour',
  title: 'Humour: More Than Just Making People Laugh',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 2 — Humour',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about the benefits and responsible use of humour.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'Have you ever laughed so much that you forgot about your problems for a few minutes? Humour is an important part of human life. <strong>It</strong> makes people laugh, brings them together and helps them deal with difficult situations. Whether it comes from a funny story, a joke, a comedy film or a cartoon, humour can make an ordinary day more enjoyable.',
    'Scientists have found that laughter can have positive effects on our health. It helps people relax, reduces stress and improves their mood. For this reason, some hospitals use clowns to entertain young patients and make their hospital experience less frightening. A simple joke or a funny performance can help children feel more comfortable.',
    'Humour also plays an important role in social relationships. People often use jokes to start conversations, make friends and create a friendly atmosphere. At school, for example, a teacher with a good sense of humour may make lessons more enjoyable and encourage students to participate.',
    "However, not all jokes are harmless. Some people make fun of others because of their appearance, background or weaknesses. <strong>This type of humour</strong> can hurt people's feelings and damage relationships. Good humour should make everyone laugh, not make someone feel embarrassed or excluded.",
    'In the end, humour is a powerful way to bring happiness into our lives. The important thing is to know when and how to use it. A good sense of humour is not simply about telling jokes; it is also about making people feel good.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The History of Comedy' }, { value: 'b', label: 'b. The Importance of Humour in Our Lives' }, { value: 'c', label: 'c. How to Become a Famous Comedian' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the following questions using information from the text.', questions: [
      { id: 'n-b1', prompt: "Mention two positive effects of laughter on people's health.", marks: 1, type: 'short' },
      { id: 'n-b2', prompt: 'Why do some hospitals use clowns?', marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'How can humour help students at school?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Are these sentences TRUE or FALSE? Justify your answers.', questions: [
      { id: 'n-c1', prompt: 'Humour can help people deal with stressful situations.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: "Making jokes about someone's weaknesses is always harmless.", marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the same as the following.', questions: [
      { id: 'n-d1', prompt: 'Happy and pleasant (paragraph 1).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'To amuse or entertain (paragraph 2).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the underlined words refer to?', questions: [
      { id: 'n-e1', prompt: '“It” (paragraph 1).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“This type of humour” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
