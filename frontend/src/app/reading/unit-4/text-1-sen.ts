import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-4-reading-sustainable-development-sen',
  slug: 'unit-4-reading-sustainable-development-sen',
  title: 'Sustainable Development for a Better World',
  level: '2BAC English · Adapted practice',
  unit: 'Unit 4 — Sustainable Development',
  version: 'sen',
  versionLabel: 'SEN Version',
  description: 'Practise reading about sustainable development with a shorter text and clear questions.',
  duration: '25–30 minutes · extra time may be used',
  supportLevel: 'Adapted text · flexible pace',
  passage: [
    'Sustainable development means protecting the environment and improving people\'s lives. Today, the world faces many problems, such as pollution, poverty and climate change. We must protect natural resources for future generations.',
    'One way to support sustainable development is to use clean energy. Solar and wind energy are good examples. <u>They</u> produce less pollution than coal and oil. People should also save water and electricity.',
    'Another important step is reducing waste. Every day, people throw away plastic bottles, bags and other materials. <u>These actions</u> can harm animals and pollute the environment. We can help by recycling plastic, reusing bags and avoiding unnecessary packaging.',
    'Sustainable development also means helping people live better lives. Everyone needs clean water, good education, healthcare and decent jobs. Governments should support poor families and provide equal opportunities.',
    'Everyone has a role to play. People can use public transport, save energy and keep their surroundings clean. Businesses should reduce pollution, and governments should protect the environment. Together, we can build a better future.',
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
            { value: 'a', label: 'The importance of sustainable development' },
            { value: 'b', label: 'The history of transportation' },
            { value: 'c', label: 'The advantages of shopping' },
          ],
        },
      ],
    },
    {
      id: 'b',
      title: 'Section B · Answer the questions',
      instructions: 'Answer the questions using information from the text.',
      questions: [
        { id: 's-b1', prompt: 'Mention two environmental problems facing the world.', marks: 1, type: 'short' },
        { id: 's-b2', prompt: 'Give two examples of clean energy.', marks: 1, type: 'short' },
        { id: 's-b3', prompt: 'How can people help reduce waste?', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'c',
      title: 'Section C · True or False',
      instructions: 'Choose True or False.',
      questions: [
        { id: 's-c1', prompt: 'Solar and wind energy produce less pollution than coal and oil.', marks: 1, type: 'true-false' },
        { id: 's-c2', prompt: 'Sustainable development is only about protecting animals.', marks: 1, type: 'true-false' },
      ],
    },
    {
      id: 'd',
      title: 'Section D · Vocabulary',
      instructions: 'Find words in the text that mean the following.',
      questions: [
        { id: 's-d1', prompt: 'The natural world around us (paragraph 1).', marks: 1, type: 'short' },
        { id: 's-d2', prompt: 'To use something again (paragraph 3).', marks: 1, type: 'short' },
      ],
    },
    {
      id: 'e',
      title: 'Section E · References',
      instructions: 'What do the following words or expressions refer to?',
      questions: [
        { id: 's-e1', prompt: '“They” (paragraph 2).', marks: 1, type: 'short' },
        { id: 's-e2', prompt: '“These actions” (paragraph 3).', marks: 1, type: 'short' },
      ],
    },
  ],
};
