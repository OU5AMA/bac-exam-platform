import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-10-reading-brain-drain',
  slug: 'unit-10-reading-brain-drain',
  title: 'Brain Drain: When Talented People Leave Their Countries',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 10 — Brain Drain',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about the causes, effects and possible responses to brain drain.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'In many developing countries, thousands of educated and highly skilled people leave their homelands every year to find better opportunities abroad. This phenomenon is known as brain drain. It happens when professionals such as doctors, engineers, scientists and university professors move to other countries in search of higher salaries, better working conditions and opportunities for professional development. Although migration can benefit individuals, it may create serious problems for the countries they leave behind.',
    'There are several reasons why skilled workers decide to move abroad. In some countries, unemployment, low salaries and poor working conditions make it difficult for qualified professionals to build successful careers. Others leave because they cannot find suitable research facilities or opportunities to continue their studies. In contrast, developed countries often offer attractive salaries, modern equipment and better career prospects. <u>These advantages</u> encourage talented individuals to look for a brighter future outside their home countries.',
    'Brain drain can have negative consequences for developing nations. When experienced doctors leave, hospitals may suffer from a shortage of medical staff, making healthcare services less accessible. Similarly, the departure of engineers, teachers and scientists can slow down technological progress and weaken educational institutions. Moreover, governments lose valuable human resources, especially after investing money and time in educating and training these professionals.',
    "However, brain drain can also bring some benefits. People who work abroad may send money to their families, helping improve their living conditions. They can also acquire new knowledge, professional experience and advanced skills. If they eventually return home, they may use <u>their new skills</u> to contribute to their countries' development. In addition, professionals living abroad can establish business partnerships and share knowledge with institutions in their homelands.",
    'To reduce brain drain, governments should improve working conditions, offer competitive salaries and invest in education, research and professional development. They should also create an environment where talented people feel valued and have opportunities to succeed. Encouraging skilled migrants to return or cooperate with local institutions can also be beneficial. Ultimately, countries should develop policies that allow their citizens to build successful careers without feeling forced to leave their homelands.',
  ],
  sections: [
    {
      id: 'a',
      title: 'Section A · Choose the best title',
      instructions: 'Choose the best title for the text.',
      questions: [
        {
          id: 'n-a1',
          prompt: 'Choose the best title for the text.',
          marks: 1,
          type: 'choice',
          options: [
            { value: 'a', label: 'a. The Advantages of Studying Abroad' },
            { value: 'b', label: 'b. Brain Drain and Its Impact on Developing Countries' },
            { value: 'c', label: 'c. The Development of Modern Technology' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 'n-b1', prompt: 'What is brain drain?', marks: 1, type: 'short' },
        { id: 'n-b2', prompt: 'Mention two reasons why skilled professionals leave their countries.', marks: 1, type: 'short' },
        { id: 'n-b3', prompt: 'How can brain drain negatively affect healthcare services in developing countries?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False and justify your answer from the text.',
      questions: [
        { id: 'n-c1', prompt: 'Brain drain only has negative effects on the countries where skilled professionals settle.', marks: 1, type: 'true-false-justify' },
        { id: 'n-c2', prompt: 'Governments can reduce brain drain by improving working conditions and investing in research.', marks: 1, type: 'true-false-justify' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Find words or expressions',
      instructions: 'Find words or expressions in the text that mean the following.',
      questions: [
        { id: 'n-d1', prompt: 'The lack of something that is needed (paragraph 3).', marks: 1, type: 'short' },
        { id: 'n-d2', prompt: 'Attractive or interesting enough to make someone want something (paragraph 2).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following expressions refer to?',
      questions: [
        { id: 'n-e1', prompt: '“These advantages” (paragraph 2).', marks: 1, type: 'short' },
        { id: 'n-e2', prompt: '“their new skills” (paragraph 4).', marks: 1, type: 'short' },
      ],
    },
  ],
};
