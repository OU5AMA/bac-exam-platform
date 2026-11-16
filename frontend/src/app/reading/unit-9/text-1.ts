import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-9-reading-science-technology',
  slug: 'unit-9-reading-science-technology',
  title: 'Science and Technology: Opportunities and Challenges',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 9 — Science and Technology',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about the benefits and challenges of science and technology.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'Science and technology have changed the way people live, work and communicate. In the past, people depended mainly on letters and face-to-face conversations to exchange information. Today, smartphones, computers and the internet allow us to communicate with people around the world in just a few seconds. <strong>These developments</strong> have made communication faster and information more accessible.',
    'Technology has also transformed education. Students can use digital libraries, educational websites and online courses to learn new subjects and improve their skills. Teachers can use digital tools to explain difficult ideas and provide interactive activities. As a result, learning is no longer limited to the classroom, and people can study at their own pace.',
    'In medicine, scientific discoveries have helped doctors diagnose diseases more accurately and treat patients more effectively. Modern medical equipment allows specialists to examine the human body, while new medicines and vaccines help prevent and fight illnesses. These advances have improved healthcare and saved many lives.',
    "Despite its benefits, technology also creates challenges. Spending too much time online can affect people's health and reduce face-to-face communication. Moreover, sharing personal information on the internet can put users' privacy at risk. False information is another serious problem because people may believe and share unreliable content without checking its source.",
    'To benefit from science and technology, people should use digital tools responsibly. <strong>They</strong> need to protect their personal information, check the reliability of online sources and balance screen time with other activities. Science and technology can improve our lives, but their positive impact depends largely on how we use them.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The History of Communication' }, { value: 'b', label: 'b. Science and Technology: Benefits and Challenges' }, { value: 'c', label: 'c. The Problems of Modern Education' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 'n-b1', prompt: 'How has modern technology changed communication?', marks: 1, type: 'short' },
      { id: 'n-b2', prompt: 'Mention two ways technology has improved education.', marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'How have scientific discoveries helped doctors and patients?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
      { id: 'n-c1', prompt: 'Technology has made learning possible outside the classroom.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: 'Sharing personal information online is always safe.', marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words or expressions in the text that mean the following.', questions: [
      { id: 'n-d1', prompt: 'Easy to obtain or use (paragraph 1).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'The ability to keep personal information private (paragraph 4).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 'n-e1', prompt: '“These developments” (paragraph 1).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“They” (paragraph 5).', marks: 1, type: 'short' },
    ] },
  ],
};
