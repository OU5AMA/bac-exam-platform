import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-4-reading-sustainable-development',
  slug: 'unit-4-reading-sustainable-development',
  title: 'Sustainable Development: Building a Better Future',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 4 — Sustainable Development',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about sustainable development and how people can build a better future.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'The world is facing many environmental, economic and social challenges. Climate change, pollution, poverty and the rapid consumption of natural resources are threatening the quality of life of present and future generations. To address these problems, countries need to adopt sustainable development strategies that balance economic growth, social progress and environmental protection.',
    "Sustainable development means meeting people's needs today without preventing future generations from meeting their own needs. It encourages individuals, businesses and governments to use natural resources responsibly. For example, instead of depending entirely on fossil fuels such as coal and oil, countries can invest in renewable energy sources like solar and wind power. <u>These alternatives</u> produce less pollution and help reduce greenhouse gas emissions.",
    'Another important aspect of sustainable development is reducing waste. Every year, millions of tonnes of plastic and other materials are thrown away, damaging oceans, rivers and wildlife. People can help solve <u>this problem</u> by recycling materials, reusing products and avoiding unnecessary packaging. Governments and companies should also develop better waste-management systems and encourage environmentally friendly production.',
    "However, sustainable development is not only about protecting the environment. It also involves improving people's living conditions. Access to quality education, healthcare, clean water and decent employment is essential for building fairer societies. Governments should support poor communities and create opportunities for everyone, regardless of their social or economic background.",
    'Achieving sustainable development requires cooperation and responsibility. Individuals can save water and electricity, use public transport and make responsible purchasing decisions. Businesses should reduce pollution and use resources efficiently, while governments must introduce effective environmental policies. By working together, we can protect our planet and create a healthier, fairer and more prosperous world for future generations.',
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
            { value: 'a', label: 'The Importance of Modern Technology' },
            { value: 'b', label: 'Sustainable Development: Building a Better Future' },
            { value: 'c', label: 'The Problems of Urban Transportation' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 'n-b1', prompt: 'What are three major challenges threatening present and future generations?', marks: 1, type: 'short' },
        { id: 'n-b2', prompt: 'Mention two examples of renewable energy sources.', marks: 1, type: 'short' },
        { id: 'n-b3', prompt: 'How can individuals help reduce waste?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False and justify your answer from the text.',
      questions: [
        { id: 'n-c1', prompt: 'Sustainable development focuses only on economic growth.', marks: 1, type: 'true-false-justify' },
        { id: 'n-c2', prompt: 'Governments should create opportunities for everyone, regardless of their social or economic background.', marks: 1, type: 'true-false-justify' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Vocabulary',
      instructions: 'Find words or expressions in the text that mean the following.',
      questions: [
        { id: 'n-d1', prompt: 'Plans designed to achieve particular goals (paragraph 1).', marks: 1, type: 'short' },
        { id: 'n-d2', prompt: 'Produced in a way that does not harm the environment (paragraph 3).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following expressions refer to?',
      questions: [
        { id: 'n-e1', prompt: '“These alternatives” (paragraph 2).', marks: 1, type: 'short' },
        { id: 'n-e2', prompt: '“this problem” (paragraph 3).', marks: 1, type: 'short' },
      ],
    },
  ],
};
