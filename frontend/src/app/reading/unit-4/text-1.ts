import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-4-reading-culture',
  slug: 'unit-4-reading-culture',
  title: 'Understanding and Respecting Different Cultures',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 4 — Cultural Issues and Values',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about cultural diversity, respect, and inclusion.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'Culture is an important part of our identity. It includes our language, traditions, beliefs, food, music, clothes and ways of life. People from different countries and communities may have different customs and values. These differences make the world interesting and diverse. However, they can sometimes lead to misunderstandings and conflicts.',
    "One important cultural value is respect. We should respect other people's traditions and beliefs, even when they are different from ours. For example, some cultures have special ways of greeting people, celebrating weddings or welcoming guests. Instead of making fun of <strong>these customs</strong>, we should try to understand their meaning. Respecting cultural differences helps people live together peacefully.",
    'Unfortunately, cultural stereotypes and discrimination are still common problems in many societies. A stereotype is a general idea about a group of people that is not necessarily true. For example, believing that all people from a particular country behave in the same way is unfair. Discrimination happens when people are treated badly because of their culture, religion, language or background. Such attitudes can create hatred and prevent people from building positive relationships.',
    'Schools and families have an important role in teaching cultural values. <strong>They</strong> can encourage young people to accept diversity, communicate with others and learn about different cultures. International festivals, cultural exchanges and classroom activities can also help students discover new traditions and develop tolerance.',
    'In conclusion, cultural diversity should be seen as a strength rather than a problem. When people respect one another, reject discrimination and appreciate differences, they can build a more peaceful and inclusive society.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The Problems of Modern Education' }, { value: 'b', label: 'b. Understanding and Respecting Cultural Diversity' }, { value: 'c', label: 'c. The Importance of Travelling Abroad' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the following questions using information from the text.', questions: [
      { id: 'n-b1', prompt: 'What does culture include?', marks: 1, type: 'short' },
      { id: 'n-b2', prompt: "Why should we respect other people's customs and traditions?", marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'Mention two activities that can help students discover different cultures.', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
      { id: 'n-c1', prompt: 'Cultural differences can sometimes cause misunderstandings.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: 'Stereotypes are always correct ideas about groups of people.', marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words or expressions in the text that mean the following.', questions: [
      { id: 'n-d1', prompt: 'The unfair treatment of people because of who they are (paragraph 3).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'The ability to accept and respect differences (paragraph 4).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 'n-e1', prompt: '“These customs” (paragraph 2).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“They” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
