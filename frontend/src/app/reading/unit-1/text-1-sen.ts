import { ReadingExam } from '../reading.models';

const senMeanings = [
  { value: 'a', label: 'A · To work together' },
  { value: 'b', label: 'B · The ability to do something well' },
  { value: 'c', label: 'C · To stop trying' },
  { value: 'd', label: 'D · Believing in yourself' },
];

export const readingExam: ReadingExam = {
    id: 'reading-sen', slug: '2bac-be-the-best-version-of-yourself-sen', title: 'Be the Best Version of Yourself',
    level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen',
    versionLabel: 'SEN Version', description: 'An adapted exam with shorter text, clear instructions, and flexible reading support.',
    duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace',
    passage: [
      'Everyone wants to be successful in life. Young people have many gifts, such as talent, creativity, and energy. However, they also need important life skills.',
      'My friend Adam is a good example. In the past, he was shy and had difficulty speaking in front of others. He sometimes got bad marks because he did not organize his time well.',
      'One day, Adam decided to change. He started making a study timetable and setting goals. He also began working with his classmates. He learned to communicate, cooperate, and respect other people’s opinions.',
      'Adam is now more confident and responsible. He knows that success is not only about getting good marks. It is also about helping others, working hard, and never giving up. Adam believes that every young person can improve and become the best version of themselves.',
    ],
    sections: [
      { id: 'a', title: 'Section A · Answer the questions', instructions: 'Read the text. Answer with a word or a short phrase.', questions: [
        { id: 's-a1', prompt: 'What is the name of the boy in the text?', marks: 1, type: 'short' },
        { id: 's-a2', prompt: 'Was Adam shy in the past?', marks: 1, type: 'true-false' },
        { id: 's-a3', prompt: 'What did Adam use to organize his study time?', marks: 1, type: 'short' },
        { id: 's-a4', prompt: 'Mention one thing that helps people succeed in life.', marks: 1, type: 'short' },
      ] },
      { id: 'b', title: 'Section B · True or False', instructions: 'Choose True or False.', questions: [
        { id: 's-b1', prompt: 'Adam was confident in the past.', marks: 1, type: 'true-false' },
        { id: 's-b2', prompt: 'Adam learned to cooperate with his classmates.', marks: 1, type: 'true-false' },
      ] },
      { id: 'c', title: 'Section C · Multiple choice', instructions: 'Choose one answer for each question.', questions: [
        { id: 's-c1', prompt: 'Adam was shy and had difficulty:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'Cooking' }, { value: 'b', label: 'Speaking in front of others' }, { value: 'c', label: 'Playing football' }] },
        { id: 's-c2', prompt: 'Adam is now more:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'Confident and responsible' }, { value: 'b', label: 'Lazy and careless' }, { value: 'c', label: 'Angry and rude' }] },
      ] },
      { id: 'd', title: 'Section D · Match the words', instructions: 'Choose the meaning that matches each word.', questions: [
        { id: 's-d1', prompt: 'Talent', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d2', prompt: 'Cooperate', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d3', prompt: 'Confident', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d4', prompt: 'Give up', marks: 0.5, type: 'matching', options: senMeanings },
      ] },
    ],
  };
