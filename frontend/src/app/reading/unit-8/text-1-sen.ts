import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-8-reading-international-organisations-sen',
  slug: 'unit-8-reading-international-organisations-sen',
  title: 'International Organisations and Their Work',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 8 — International Organisations',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about international organisations in an adapted text.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Countries around the world face many problems, such as poverty, wars, diseases and climate change. These problems often affect people in different countries. International organisations help countries work together to solve these problems and make the world a better place.',
    "The United Nations (UN) is one of the most important international organisations. <u>It</u> was created in 1945 to promote peace and cooperation between countries. It also works to protect human rights. UNICEF is a UN organisation that helps children and protects their rights. The World Health Organization (WHO) helps countries fight diseases and improve people's health.",
    'Other organisations have different responsibilities. The World Bank gives financial support to developing countries to fight poverty. The International Monetary Fund (IMF) helps countries with economic problems. <u>These organisations</u> support development and cooperation around the world.',
    'However, international organisations sometimes face difficulties. Some countries do not respect international agreements, and others do not provide enough money. Political disagreements can also make their work difficult.',
    'Everyone can help create a better world. Governments should cooperate and respect international agreements. People should promote peace, tolerance and respect for human rights. By working together, we can build a safer and better future.',
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
            { value: 'a', label: 'a. International organisations and their activities' },
            { value: 'b', label: 'b. Famous historical places' },
            { value: 'c', label: 'c. The importance of learning foreign languages' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 's-b1', prompt: 'Mention two problems that affect countries around the world.', marks: 1, type: 'short' },
        { id: 's-b2', prompt: 'When was the United Nations created?', marks: 1, type: 'short' },
        { id: 's-b3', prompt: 'What does UNICEF do?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False.',
      questions: [
        { id: 's-c1', prompt: 'The WHO helps countries fight diseases.', marks: 1, type: 'true-false' },
        { id: 's-c2', prompt: 'The World Bank helps developing countries fight poverty.', marks: 1, type: 'true-false' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Find words',
      instructions: 'Find words in the text that mean the following.',
      questions: [
        { id: 's-d1', prompt: 'The ability to work together (paragraph 2).', marks: 1, type: 'short' },
        { id: 's-d2', prompt: 'Difficult situations or problems (paragraph 4).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following expressions refer to?',
      questions: [
        { id: 's-e1', prompt: '“It” (paragraph 2).', marks: 1, type: 'short' },
        { id: 's-e2', prompt: '“These organisations” (paragraph 3).', marks: 1, type: 'short' },
      ],
    },
  ],
};
