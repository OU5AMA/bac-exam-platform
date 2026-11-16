import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-5-reading-citizenship-sen',
  slug: 'unit-5-reading-citizenship-sen',
  title: 'A Good Citizen',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 5 — Citizenship',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about good citizenship in a simpler text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'A citizen is a member of a country or community. Being a good citizen means respecting others, following the law and helping people. Good citizens know their rights and responsibilities.',
    "Citizens should respect public places and protect the environment. <strong>They</strong> should not throw rubbish in the streets, damage public property or waste water. They should also respect traffic rules and other people's rights.",
    'Good citizens help people in their communities. They can give clothes to poor families, help old people or clean their neighbourhoods. Young people can also help at school by joining projects and environmental activities.',
    'Citizens have the right to express their opinions, but they should do <strong>it</strong> peacefully. They should listen to others and respect different ideas.',
    'Everyone can help build a better society. Small actions, such as helping a neighbour or keeping the streets clean, can make a big difference.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is about:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. Being a good citizen' }, { value: 'b', label: 'b. Travelling to other countries' }, { value: 'c', label: 'c. Learning foreign languages' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'Mention two responsibilities of a good citizen.', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'How can people help their communities?', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'How should citizens express their opinions?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False.', questions: [
      { id: 's-c1', prompt: 'Good citizens should protect the environment.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: 'Citizens should damage public property.', marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'The area around our homes.', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'The things a person must do.', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following words refer to?', questions: [
      { id: 's-e1', prompt: '“They” (paragraph 3).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“it” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
