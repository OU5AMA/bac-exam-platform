import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-3-reading-education-sen',
  slug: 'unit-3-reading-education-sen',
  title: 'Three Ways of Learning',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 3 — Education',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about three types of education in a simpler text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Education is important in our lives. It helps us learn new things and develop useful skills. However, we do not learn only at school. There are three types of education: formal, non-formal and informal education.',
    'Formal education takes place at schools, colleges and universities. Students learn different subjects such as English, mathematics and science. Teachers explain lessons and give students tests and examinations. At the end, students can get certificates or diplomas.',
    'Non-formal education takes place outside traditional schools. It includes language courses, computer classes, workshops and sports activities. People join these activities to learn new skills. For example, someone can take a computer course to learn how to use a computer.',
    'Informal education happens in everyday life. People learn from their parents, friends and personal experiences. For example, children can learn how to cook by watching their parents. People can also learn new words by talking to others or watching television.',
    'All three types of education are useful. Formal education gives us knowledge, non-formal education helps us develop skills, and informal education teaches us through daily experiences.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the correct answer', instructions: 'Choose the correct answer.', questions: [
      { id: 's-a1', prompt: 'The text is about:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. Different school subjects' }, { value: 'b', label: 'b. Three types of education' }, { value: 'c', label: 'c. The importance of computers' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 's-b1', prompt: 'Where does formal education take place?', marks: 1, type: 'short' },
      { id: 's-b2', prompt: 'Mention two examples of non-formal education.', marks: 1, type: 'short' },
      { id: 's-b3', prompt: 'Who can we learn from in informal education?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False.', questions: [
      { id: 's-c1', prompt: 'Students usually take examinations in formal education.', marks: 1, type: 'true-false' },
      { id: 's-c2', prompt: 'Informal education happens only at school.', marks: 1, type: 'true-false' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words in the text that mean the following.', questions: [
      { id: 's-d1', prompt: 'A person who teaches students.', marks: 1, type: 'short' },
      { id: 's-d2', prompt: 'Things we know or can do well.', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following words refer to?', questions: [
      { id: 's-e1', prompt: '“These activities” (paragraph 3).', marks: 1, type: 'short' },
      { id: 's-e2', prompt: '“People” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
