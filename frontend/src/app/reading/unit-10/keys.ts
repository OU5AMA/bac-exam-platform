import { AnswerKey } from '../reading.models';

export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': {
    correctValue: 'b',
    expected: 'B · Brain Drain and Its Impact on Developing Countries.',
    feedback: 'The passage explains brain drain and its effects on developing countries.',
  },
  'n-b1': {
    accepted: ['the movement of educated and highly skilled people from their countries to other countries in search of better opportunities'],
    expected: 'The movement of educated and highly skilled people from their countries to other countries in search of better opportunities.',
    feedback: 'The first paragraph defines brain drain as skilled people leaving for better opportunities abroad.',
  },
  'n-b2': {
    groupsRequired: 2,
    groups: [
      ['unemployment'],
      ['low salaries'],
      ['poor working conditions'],
      ['research facilities', 'suitable research facilities'],
      ['opportunities to continue their studies', 'professional development'],
    ],
    expected: 'Any two of: unemployment, low salaries, poor working conditions, limited research facilities, lack of professional development opportunities.',
    feedback: 'The second paragraph lists these reasons for leaving.',
  },
  'n-b3': {
    accepted: ['when experienced doctors leave hospitals may suffer from a shortage of medical staff making healthcare services less accessible'],
    expected: 'When experienced doctors leave, hospitals may suffer from a shortage of medical staff, making healthcare services less accessible.',
    feedback: 'The third paragraph explains that a shortage of medical staff makes healthcare less accessible.',
  },
  'n-c1': {
    correctValue: 'false',
    justification: ['brain drain can also bring some benefits', 'send money to their families', 'acquire new knowledge professional experience and advanced skills'],
    expected: 'FALSE. Brain drain can also bring benefits to the countries of origin, such as remittances, acquired skills and knowledge transfer.',
    feedback: 'The fourth paragraph describes benefits, including money sent home, new skills and shared knowledge.',
  },
  'n-c2': {
    correctValue: 'true',
    justification: ['improve working conditions offer competitive salaries and invest in education research and professional development'],
    expected: 'TRUE. Paragraph 5 explains that governments should improve working conditions and invest in research and professional development.',
    feedback: 'The final paragraph recommends these actions to reduce brain drain.',
  },
  'n-d1': {
    accepted: ['shortage'],
    expected: 'Shortage.',
    feedback: 'The third paragraph says hospitals may suffer from a shortage of medical staff.',
  },
  'n-d2': {
    accepted: ['attractive'],
    expected: 'Attractive.',
    feedback: 'The second paragraph describes salaries and opportunities abroad as attractive.',
  },
  'n-e1': {
    accepted: ['attractive salaries modern equipment and better career prospects'],
    expected: 'Attractive salaries, modern equipment and better career prospects.',
    feedback: '“These advantages” refers to the opportunities offered by developed countries.',
  },
  'n-e2': {
    accepted: ['the new knowledge professional experience and advanced skills acquired abroad'],
    expected: 'The new knowledge, professional experience and advanced skills acquired abroad.',
    feedback: '“Their new skills” refers to what professionals may gain while working abroad.',
  },

  's-a1': {
    correctValue: 'a',
    expected: 'A · The reasons and effects of brain drain.',
    feedback: 'The text describes why people leave and what brain drain can cause.',
  },
  's-b1': {
    accepted: ['brain drain happens when educated and skilled people leave their countries to work or live abroad'],
    expected: 'Brain drain happens when educated and skilled people leave their countries to work or live abroad.',
    feedback: 'The first paragraph defines brain drain.',
  },
  's-b2': {
    groupsRequired: 2,
    groups: [['unemployment'], ['low salaries'], ['poor working conditions']],
    expected: 'Any two of: unemployment, low salaries, poor working conditions.',
    feedback: 'The second paragraph lists these reasons for leaving.',
  },
  's-b3': {
    accepted: ['send money to their families'],
    expected: 'They can send money to their families.',
    feedback: 'The fourth paragraph says people working abroad can send money to their families.',
  },
  's-c1': {
    correctValue: 'true',
    expected: 'TRUE.',
    feedback: 'The third paragraph says hospitals may not have enough medical staff when doctors leave.',
  },
  's-c2': {
    correctValue: 'true',
    expected: 'TRUE.',
    feedback: 'The final paragraph says governments can reduce brain drain by creating more jobs.',
  },
  's-d1': {
    accepted: ['skilled people'],
    expected: 'Skilled people.',
    feedback: 'The first paragraph describes people with professional skills as skilled people.',
  },
  's-d2': {
    accepted: ['send'],
    expected: 'Send.',
    feedback: 'The fourth paragraph says people working abroad can send money to their families.',
  },
  's-e1': {
    accepted: ['better working conditions modern equipment and more opportunities to develop their skills'],
    expected: 'Better working conditions, modern equipment and more opportunities to develop their skills.',
    feedback: '“These advantages” refers to the benefits that attract talented people to developed countries.',
  },
  's-e2': {
    accepted: ['people working abroad'],
    expected: 'People working abroad.',
    feedback: '“They” refers to people working abroad.',
  },
};
