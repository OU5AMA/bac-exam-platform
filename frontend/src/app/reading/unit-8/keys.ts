import { AnswerKey } from '../reading.models';

export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': {
    correctValue: 'b',
    expected: 'B · International Organisations and Global Cooperation.',
    feedback: 'The text explains how international organisations help countries cooperate.',
  },
  'n-b1': {
    accepted: ['to address global problems and promote peace cooperation and development'],
    expected: 'To address global problems and promote peace, cooperation and development.',
    feedback: 'Countries established these organisations to address challenges together and promote peace, cooperation and development.',
  },
  'n-b2': {
    groupsRequired: 2,
    groups: [
      ['maintain international peace and security'],
      ['protect human rights'],
      ['encourage cooperation between nations'],
    ],
    expected: 'Any two of: maintain international peace and security; protect human rights; encourage cooperation between nations.',
    feedback: 'The second paragraph lists these as the United Nations’ main objectives.',
  },
  'n-b3': {
    accepted: ["UNICEF protects children's rights and improves their living conditions WHO helps countries fight diseases and improve public health"],
    expected: "UNICEF protects children's rights and improves their living conditions; WHO helps countries fight diseases and improve public health.",
    feedback: 'UNICEF supports children, while WHO works on diseases and public health.',
  },
  'n-c1': {
    correctValue: 'false',
    justification: ['founded in 1945 after the second world war'],
    expected: 'FALSE. The UN was founded in 1945 after the Second World War.',
    feedback: 'The second paragraph says the UN was founded in 1945 after the Second World War.',
  },
  'n-c2': {
    correctValue: 'true',
    justification: ['provides financial assistance and advice to developing countries to reduce poverty and improve living standards'],
    expected: 'TRUE. The World Bank provides financial assistance and advice to developing countries to reduce poverty and improve living standards.',
    feedback: 'The third paragraph states this about the World Bank.',
  },
  'n-d1': {
    accepted: ['financial'],
    expected: 'Financial.',
    feedback: 'The third paragraph uses “financial” in relation to stability and assistance.',
  },
  'n-d2': {
    accepted: ['vulnerable communities'],
    expected: 'Vulnerable communities.',
    feedback: 'The fourth paragraph refers to supporting vulnerable communities.',
  },
  'n-e1': {
    accepted: ['the united nations un'],
    expected: 'The United Nations (UN).',
    feedback: '“Its” refers to the United Nations.',
  },
  'n-e2': {
    accepted: ['wars poverty diseases climate change and human rights violations'],
    expected: 'Wars, poverty, diseases, climate change and human rights violations.',
    feedback: '“These challenges” refers to the problems listed earlier in paragraph 1.',
  },

  's-a1': {
    correctValue: 'a',
    expected: 'A · International organisations and their activities.',
    feedback: 'The text describes the work of international organisations.',
  },
  's-b1': {
    groupsRequired: 2,
    groups: [['poverty'], ['wars'], ['diseases'], ['climate change']],
    expected: 'Any two of: poverty, wars, diseases, climate change.',
    feedback: 'The first paragraph lists these problems.',
  },
  's-b2': {
    accepted: ['in 1945'],
    expected: 'In 1945.',
    feedback: 'The second paragraph says the UN was created in 1945.',
  },
  's-b3': {
    accepted: ['unicef helps children and protects their rights'],
    expected: 'UNICEF helps children and protects their rights.',
    feedback: 'The second paragraph describes UNICEF’s work with children.',
  },
  's-c1': {
    correctValue: 'true',
    expected: 'TRUE.',
    feedback: 'The second paragraph says the WHO helps countries fight diseases.',
  },
  's-c2': {
    correctValue: 'true',
    expected: 'TRUE.',
    feedback: 'The third paragraph says the World Bank helps developing countries fight poverty.',
  },
  's-d1': {
    accepted: ['cooperation'],
    expected: 'Cooperation.',
    feedback: 'The second paragraph says the UN promotes cooperation between countries.',
  },
  's-d2': {
    accepted: ['difficulties'],
    expected: 'Difficulties.',
    feedback: 'The fourth paragraph uses “difficulties” for problems faced by organisations.',
  },
  's-e1': {
    accepted: ['the united nations un'],
    expected: 'The United Nations (UN).',
    feedback: '“It” refers to the United Nations.',
  },
  's-e2': {
    accepted: ['the world bank and the international monetary fund imf'],
    expected: 'The World Bank and the International Monetary Fund (IMF).',
    feedback: '“These organisations” refers to the World Bank and the International Monetary Fund.',
  },
};
