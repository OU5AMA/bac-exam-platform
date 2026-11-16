import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-4-reading-culture-sen',
  slug: 'unit-4-reading-culture-sen',
  title: 'Respecting Different Cultures',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 4 — Cultural Issues and Values',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about respecting cultures in a simpler text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Culture is part of our identity. It includes our language, food, clothes, music and traditions. People around the world have different cultures. They may eat different food, wear different clothes and celebrate different festivals. These differences make our world beautiful.',
    "We should respect other people's cultures. For example, some people have special ways of greeting others or celebrating weddings. We should not laugh at <strong>their</strong> traditions. We should try to understand and accept them.",
    'Sometimes, people have negative ideas about other cultures. These ideas are called stereotypes. Some people also treat others badly because of their language, religion or nationality. <strong>This</strong> is called discrimination. It is unfair and can hurt people.',
    'Schools and families can teach children important values such as respect, tolerance and kindness. Students can learn about other cultures through festivals, classroom activities and cultural exchanges.',
    'Different cultures make our world richer. We should accept differences and treat everyone with respect.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is about:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. Different school subjects' }, { value: 'b', label: 'b. Respecting different cultures' }, { value: 'c', label: 'c. Learning foreign languages only' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'Mention two things that are part of culture.', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'What should we do when we meet people with different traditions?', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'Who can teach children respect and tolerance?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False.', questions: [
      { id: 's-c1', prompt: 'People around the world have different cultures.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: 'Discrimination means treating everyone fairly.', marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'The way people speak.', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'Accepting and respecting differences.', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following words refer to?', questions: [
      { id: 's-e1', prompt: '“Their” (paragraph 2).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“This” (paragraph 3).', marks: 1, type: 'short' },
    ] },
  ],
};
