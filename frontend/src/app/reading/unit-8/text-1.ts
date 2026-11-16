import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-8-reading-international-organisations',
  slug: 'unit-8-reading-international-organisations',
  title: 'International Organisations: Working Together for a Better World',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 8 — International Organisations',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about how international organisations support peace, cooperation and development.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    "In today's interconnected world, many problems cannot be solved by individual countries alone. Wars, poverty, diseases, climate change and human rights violations affect people across national borders. To address <u>these challenges</u>, countries have established international organisations that bring governments together to promote peace, cooperation and development. These organisations play an important role in creating a safer and fairer world.",
    "One of the most important international organisations is the United Nations (UN), founded in 1945 after the Second World War. <u>Its</u> main objectives are to maintain international peace and security, protect human rights and encourage cooperation between nations. Through its different agencies, the UN also supports education, healthcare and humanitarian assistance. For example, UNICEF works to protect children's rights and improve their living conditions, while the World Health Organization (WHO) helps countries fight diseases and improve public health.",
    'Other international organisations focus on specific areas of development. The International Monetary Fund (IMF) promotes financial stability and supports countries facing economic difficulties. Similarly, the World Bank provides financial assistance and advice to developing countries to reduce poverty and improve living standards. In addition, organisations such as the World Trade Organization (WTO) work to promote fair international trade and encourage economic cooperation among countries.',
    'Despite their important contributions, international organisations face several challenges. Some countries do not always respect international agreements, while others disagree about how resources should be distributed. Financial limitations and political conflicts can also prevent these organisations from achieving their objectives. Nevertheless, their efforts remain essential in responding to global problems and supporting vulnerable communities.',
    'International organisations cannot solve every problem on their own. Their success depends on the commitment of member countries, financial support and public cooperation. Governments must respect international agreements, while individuals can contribute by promoting tolerance, protecting human rights and supporting humanitarian activities. Through collective action, nations can cooperate and build a more peaceful, united and prosperous world.',
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
            { value: 'a', label: 'a. The History of International Trade' },
            { value: 'b', label: 'b. International Organisations and Global Cooperation' },
            { value: 'c', label: 'c. The Importance of Modern Technology' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 'n-b1', prompt: 'Why have countries established international organisations?', marks: 1, type: 'short' },
        { id: 'n-b2', prompt: 'Mention two objectives of the United Nations.', marks: 1, type: 'short' },
        { id: 'n-b3', prompt: 'What is the main difference between the roles of UNICEF and WHO?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False and justify your answer from the text.',
      questions: [
        { id: 'n-c1', prompt: 'The United Nations was founded before the Second World War.', marks: 1, type: 'true-false-justify' },
        { id: 'n-c2', prompt: 'The World Bank helps developing countries reduce poverty and improve living standards.', marks: 1, type: 'true-false-justify' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Find words or expressions',
      instructions: 'Find words or expressions in the text that mean the following.',
      questions: [
        { id: 'n-d1', prompt: 'Connected with money or economic resources (paragraph 3).', marks: 1, type: 'short' },
        { id: 'n-d2', prompt: 'People or groups that need help or protection (paragraph 4).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following expressions refer to?',
      questions: [
        { id: 'n-e1', prompt: '“Its” (paragraph 2).', marks: 1, type: 'short' },
        { id: 'n-e2', prompt: '“these challenges” (paragraph 1).', marks: 1, type: 'short' },
      ],
    },
  ],
};
