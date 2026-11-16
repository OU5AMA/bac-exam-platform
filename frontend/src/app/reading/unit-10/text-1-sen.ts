import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-10-reading-brain-drain-sen',
  slug: 'unit-10-reading-brain-drain-sen',
  title: 'Brain Drain: Why Do Skilled People Leave?',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 10 — Brain Drain',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about brain drain in an adapted text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Brain drain happens when educated and skilled people leave their countries to work or live abroad. Doctors, teachers, engineers and scientists often move to other countries to find better jobs and improve their lives.',
    'There are many reasons for brain drain. Some people leave because they cannot find jobs or earn good salaries in their countries. Others want better working conditions, modern equipment and more opportunities to develop their skills. <u>These advantages</u> attract many talented people to developed countries.',
    'Brain drain can cause problems for developing countries. When doctors leave, hospitals may not have enough medical staff. When teachers and engineers leave, schools and other important services may also suffer. As a result, development can become slower.',
    'However, brain drain can have some advantages. People working abroad can send money to their families. <u>They</u> can also learn new skills and gain experience. Some may return home and use their knowledge to help their countries.',
    "Governments can reduce brain drain by creating more jobs, offering better salaries and improving working conditions. They should also invest in education and research. When people have good opportunities at home, they may choose to stay and contribute to their country's development.",
  ],
  sections: [
    {
      id: 'a',
      title: 'Section A · Choose the correct answer',
      instructions: 'Choose the correct answer.',
      questions: [
        {
          id: 's-a1',
          prompt: 'The text is about:',
          marks: 1,
          type: 'choice',
          options: [
            { value: 'a', label: 'a. The reasons and effects of brain drain' },
            { value: 'b', label: 'b. The importance of learning foreign languages' },
            { value: 'c', label: 'c. The history of international tourism' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 's-b1', prompt: 'What is brain drain?', marks: 1, type: 'short' },
        { id: 's-b2', prompt: 'Mention two reasons why people leave their countries.', marks: 1, type: 'short' },
        { id: 's-b3', prompt: 'How can people working abroad help their families?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False.',
      questions: [
        { id: 's-c1', prompt: 'Brain drain can create a shortage of doctors in hospitals.', marks: 1, type: 'true-false' },
        { id: 's-c2', prompt: 'Governments can reduce brain drain by creating more job opportunities.', marks: 1, type: 'true-false' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Find words',
      instructions: 'Find words in the text that mean the following.',
      questions: [
        { id: 's-d1', prompt: 'People with special knowledge or abilities (paragraph 1).', marks: 1, type: 'short' },
        { id: 's-d2', prompt: 'To give money to someone (paragraph 4).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following expressions refer to?',
      questions: [
        { id: 's-e1', prompt: '“These advantages” (paragraph 2).', marks: 1, type: 'short' },
        { id: 's-e2', prompt: '“They” (paragraph 4).', marks: 1, type: 'short' },
      ],
    },
  ],
};
