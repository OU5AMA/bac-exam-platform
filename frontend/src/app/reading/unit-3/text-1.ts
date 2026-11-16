import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-3-reading-education',
  slug: 'unit-3-reading-education',
  title: 'Education Beyond the Classroom',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 3 — Education',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Explore formal, non-formal and informal education.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    "Education plays an important role in people's lives. It helps individuals develop knowledge, skills and positive attitudes. However, learning does not only take place at school. There are three main types of education: formal, non-formal and informal education. Each type contributes to personal development in a different way.",
    'Formal education takes place in schools, colleges and universities. It follows an organised programme with specific subjects, lessons and examinations. Students learn mathematics, languages, science, history and other subjects. Teachers guide learners, evaluate their progress and help them achieve educational goals. At the end of their studies, students usually receive certificates or diplomas.',
    "Non-formal education refers to organised learning activities that take place outside the traditional school system. Examples include language courses, computer training, workshops, sports programmes and vocational training. <strong>These activities</strong> are often designed to develop practical skills or improve people's knowledge in a particular area. Unlike formal education, non-formal education is usually more flexible in terms of schedules, content and learning methods.",
    'Informal education, on the other hand, happens naturally in everyday life. People learn from their families, friends, personal experiences, hobbies and the media. For example, a young person may learn how to cook by watching a parent, improve communication skills by interacting with others, or develop problem-solving skills through daily experiences. <strong>This type of learning</strong> is not usually planned and does not normally lead to an official certificate.',
    'Although these three types of education are different, they are all important. Formal education provides academic knowledge, non-formal education develops specific skills, and informal education helps people learn from everyday experiences. Combining the three can help individuals become more knowledgeable, skilled and independent.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The Problems of Modern Schools' }, { value: 'b', label: 'b. The Three Types of Education' }, { value: 'c', label: 'c. The Importance of University Degrees' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the following questions using information from the text.', questions: [
      { id: 'n-b1', prompt: 'Where does formal education usually take place?', marks: 1, type: 'short' },
      { id: 'n-b2', prompt: 'Give two examples of non-formal education.', marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'How can people acquire informal education?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
      { id: 'n-c1', prompt: 'Formal education usually follows an organised programme.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: 'Informal education always provides learners with official certificates.', marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words or expressions in the text that mean the following.', questions: [
      { id: 'n-d1', prompt: 'People who study or receive knowledge (paragraph 2).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'The ability to change or adapt easily (paragraph 3).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 'n-e1', prompt: '“These activities” (paragraph 3).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“This type of learning” (paragraph 4).', marks: 1, type: 'short' },
    ] },
  ],
};
