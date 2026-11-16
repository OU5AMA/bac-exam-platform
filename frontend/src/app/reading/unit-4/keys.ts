import { AnswerKey } from '../reading.models';

export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': {
    correctValue: 'b',
    expected: 'B · Sustainable Development: Building a Better Future.',
    feedback: 'The text explains how sustainable development can help create a better future.',
  },
  'n-b1': {
    groupsRequired: 3,
    groups: [
      ['climate change'],
      ['pollution'],
      ['poverty'],
      ['rapid consumption of natural resources', 'consumption of natural resources'],
    ],
    expected: 'Any three: climate change, pollution, poverty, or the rapid consumption of natural resources.',
    feedback: 'The first paragraph names these challenges as threats to present and future generations.',
  },
  'n-b2': {
    groupsRequired: 2,
    groups: [['solar energy', 'solar power', 'solar'], ['wind energy', 'wind power', 'wind']],
    expected: 'Solar energy and wind energy.',
    feedback: 'The second paragraph gives solar and wind power as renewable energy sources.',
  },
  'n-b3': {
    groupsRequired: 3,
    groups: [
      ['recycling materials', 'recycle materials', 'recycling'],
      ['reusing products', 'reuse products', 'reusing'],
      ['avoiding unnecessary packaging', 'avoid unnecessary packaging'],
    ],
    expected: 'Recycle materials, reuse products, and avoid unnecessary packaging.',
    feedback: 'The third paragraph gives these actions as ways people can reduce waste.',
  },
  'n-c1': {
    correctValue: 'false',
    justification: ['balances economic growth social progress and environmental protection', 'social progress and environmental protection'],
    expected: 'False. Sustainable development balances economic growth, social progress, and environmental protection.',
    feedback: 'The first paragraph names three areas that sustainable development balances.',
  },
  'n-c2': {
    correctValue: 'true',
    justification: ['create opportunities for everyone', 'regardless of their social or economic background'],
    expected: 'True. Governments should create opportunities for everyone, regardless of their social or economic background.',
    feedback: 'The fourth paragraph states this directly.',
  },
  'n-d1': {
    accepted: ['strategies'],
    expected: 'Strategies.',
    feedback: 'The first paragraph says countries need to adopt sustainable development strategies.',
  },
  'n-d2': {
    accepted: ['environmentally friendly'],
    expected: 'Environmentally friendly.',
    feedback: 'The third paragraph uses “environmentally friendly” to describe production that avoids harming the environment.',
  },
  'n-e1': {
    accepted: ['solar and wind power', 'solar power and wind power', 'solar and wind energy', 'solar energy and wind energy'],
    expected: 'Solar and wind power.',
    feedback: '“These alternatives” refers to renewable energy sources such as solar and wind power.',
  },
  'n-e2': {
    accepted: [
      'the problem of plastic and other waste damaging oceans rivers and wildlife',
      'plastic and other materials damaging oceans rivers and wildlife',
      'plastic and other waste damaging oceans rivers and wildlife',
    ],
    expected: 'The problem of plastic and other waste damaging oceans, rivers, and wildlife.',
    feedback: '“This problem” refers to waste damaging oceans, rivers, and wildlife.',
  },
  's-a1': {
    correctValue: 'a',
    expected: 'A · The importance of sustainable development.',
    feedback: 'The passage describes why sustainable development matters and how people can support it.',
  },
  's-b1': {
    groupsRequired: 2,
    groups: [['pollution'], ['climate change'], ['poverty']],
    expected: 'Pollution and climate change (poverty is also acceptable).',
    feedback: 'The first paragraph lists pollution, poverty, and climate change as problems.',
  },
  's-b2': {
    groupsRequired: 2,
    groups: [['solar energy', 'solar power', 'solar'], ['wind energy', 'wind power', 'wind']],
    expected: 'Solar energy and wind energy.',
    feedback: 'The second paragraph names solar and wind energy as clean energy examples.',
  },
  's-b3': {
    groupsRequired: 3,
    groups: [
      ['recycling plastic', 'recycle plastic', 'recycling'],
      ['reusing bags', 'reuse bags', 'reusing'],
      ['avoiding unnecessary packaging', 'avoid unnecessary packaging'],
    ],
    expected: 'Recycle plastic, reuse bags, and avoid unnecessary packaging.',
    feedback: 'The third paragraph gives these actions as ways to reduce waste.',
  },
  's-c1': {
    correctValue: 'true',
    expected: 'True.',
    feedback: 'The second paragraph says solar and wind energy produce less pollution than coal and oil.',
  },
  's-c2': {
    correctValue: 'false',
    expected: 'False. Sustainable development also involves improving people’s lives and protecting the environment.',
    feedback: 'The passage describes environmental protection and better living conditions for people.',
  },
  's-d1': {
    accepted: ['environment'],
    expected: 'Environment.',
    feedback: 'The first paragraph says sustainable development means protecting the environment.',
  },
  's-d2': {
    accepted: ['reusing'],
    expected: 'Reusing.',
    feedback: 'The third paragraph says people can reuse bags and other products.',
  },
  's-e1': {
    accepted: ['solar and wind energy', 'solar energy and wind energy', 'solar and wind power'],
    expected: 'Solar and wind energy.',
    feedback: '“They” refers to solar and wind energy.',
  },
  's-e2': {
    accepted: [
      'throwing away plastic bottles bags and other materials',
      'throwing away plastic bottles and bags',
      'throwing away plastic and other materials',
    ],
    expected: 'Throwing away plastic bottles, bags, and other materials.',
    feedback: '“These actions” refers to throwing away plastic bottles, bags, and other materials.',
  },
};
