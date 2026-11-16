import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-7-reading-science-technology-sen',
  slug: 'unit-7-reading-science-technology-sen',
  title: 'Science and Technology in Our Lives',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 7 — Science and Technology',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about science and technology in a simpler text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Science and technology are important in our daily lives. We use computers, smartphones and the internet to communicate with others. Today, we can send messages and talk to people in different countries in a few seconds.',
    'Technology is also useful in education. Teachers can use computers to explain lessons and show educational videos. Students can use the internet to find information, read digital books and follow online courses. <strong>They</strong> can learn at school or at home.',
    'Science has also improved medicine. Doctors use modern machines to examine patients and discover diseases. New medicines and vaccines help people fight illnesses and stay healthy.',
    'However, technology can also cause problems. Spending too much time on screens is not good for our health. Some people share personal information online without thinking about the risks. Also, not all information on the internet is true.',
    'We should use technology carefully. We should protect our personal information, check information before sharing it and spend time doing other activities. Technology is useful when we use <strong>it</strong> responsibly.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is about:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. Science and technology in our lives' }, { value: 'b', label: 'b. The history of medicine' }, { value: 'c', label: 'c. Different types of sports' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'What do people use smartphones and computers for?', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'How can students use technology to learn?', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'How do new medicines and vaccines help people?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False.', questions: [
      { id: 's-c1', prompt: 'Technology allows students to learn at home.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: 'All information on the internet is true.', marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'Illnesses.', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'To keep something safe.', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following words refer to?', questions: [
      { id: 's-e1', prompt: '“They” (paragraph 2).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“it” (paragraph 5).', marks: 1, type: 'short' },
    ] },
  ],
};
