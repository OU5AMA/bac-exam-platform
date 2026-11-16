import { AnswerKey } from '../reading.models';

// This key is separate from the student-facing question data and is never rendered in the exam UI.
export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': { correctValue: 'b', expected: 'B · Understanding and Respecting Cultural Diversity.', feedback: 'The passage explains why cultural differences should be understood and respected.' },
  'n-b1': { accepted: ['language', 'traditions', 'beliefs', 'food', 'music', 'clothes', 'ways of life'], expected: 'Language, traditions, beliefs, food, music, clothes and ways of life.', feedback: 'The first paragraph lists these parts of culture; any reasonable subset is acceptable.' },
  'n-b2': { accepted: ['because understanding and respecting them helps people live together peacefully', 'because respecting cultural differences helps people live together peacefully', 'helps people live together peacefully', 'so people can live together peacefully'], expected: 'Because understanding and respecting them helps people live together peacefully.', feedback: 'The passage says respecting cultural differences helps people live together peacefully.' },
  'n-b3': { groupsRequired: 2, groups: [['international festivals'], ['cultural exchanges'], ['classroom activities']], expected: 'Any two: international festivals, cultural exchanges or classroom activities.', feedback: 'These activities are listed in paragraph 4.' },
  'n-c1': { correctValue: 'true', justification: ['can sometimes lead to misunderstandings and conflicts', 'lead to misunderstandings and conflicts'], expected: 'TRUE. They can sometimes lead to misunderstandings and conflicts.', feedback: 'The first paragraph states that cultural differences can lead to misunderstandings and conflicts.' },
  'n-c2': { correctValue: 'false', justification: ['not necessarily true', 'a general idea about a group of people that is not necessarily true'], expected: 'FALSE. A stereotype is a general idea about a group of people that is not necessarily true.', feedback: 'The passage defines a stereotype as an idea that is not necessarily true.' },
  'n-d1': { accepted: ['discrimination'], expected: 'Discrimination.', feedback: 'Discrimination is treating people badly because of their culture or background.' },
  'n-d2': { accepted: ['tolerance'], expected: 'Tolerance.', feedback: 'The passage says students can develop tolerance.' },
  'n-e1': { accepted: ['special ways of greeting people celebrating weddings and welcoming guests', 'ways of greeting people celebrating weddings or welcoming guests', 'greeting people celebrating weddings welcoming guests'], expected: 'Special ways of greeting people, celebrating weddings and welcoming guests.', feedback: '“These customs” refers to the examples of cultural customs in the previous sentence.' },
  'n-e2': { accepted: ['schools and families'], expected: 'Schools and families.', feedback: '“They” refers to schools and families.' },

  's-a1': { correctValue: 'b', expected: 'B · Respecting different cultures.', feedback: 'The text explains how people should respect different cultures.' },
  's-b1': { groupsRequired: 2, groups: [['language'], ['food'], ['clothes'], ['music'], ['traditions']], expected: 'Any two: language, food, clothes, music or traditions.', feedback: 'These are listed as parts of culture in paragraph 1.' },
  's-b2': { accepted: ['we should respect and accept their traditions', 'respect and accept their traditions', 'respect their traditions', 'understand and accept their traditions'], expected: 'We should respect and accept their traditions.', feedback: 'The passage says we should respect traditions and try to understand and accept them.' },
  's-b3': { accepted: ['schools and families', 'schools families'], expected: 'Schools and families.', feedback: 'Paragraph 4 says schools and families can teach children these values.' },
  's-c1': { correctValue: 'true', expected: 'TRUE.', feedback: 'The first paragraph says people around the world have different cultures.' },
  's-c2': { correctValue: 'false', expected: 'FALSE.', feedback: 'Discrimination is treating people badly, which is unfair.' },
  's-d1': { accepted: ['language'], expected: 'Language.', feedback: 'Language is the way people speak.' },
  's-d2': { accepted: ['tolerance'], expected: 'Tolerance.', feedback: 'Tolerance means accepting and respecting differences.' },
  's-e1': { accepted: ['some people', 'other people'], expected: 'Some people / other people.', feedback: '“Their” refers to the people whose traditions are being discussed.' },
  's-e2': { accepted: ['treating others badly because of their language religion or nationality', 'treating others badly because of their language', 'discrimination'], expected: 'Treating others badly because of their language, religion or nationality (discrimination).', feedback: '“This” refers to treating people badly because of their language, religion or nationality.' },
};
