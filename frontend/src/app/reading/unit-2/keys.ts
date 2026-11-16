import { AnswerKey } from '../reading.models';

// This key is separate from the student-facing question data and is never rendered in the exam UI.
export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': { correctValue: 'b', expected: 'B · The Importance of Humour in Our Lives.', feedback: 'The text explains how humour affects health, relationships, and daily life.' },
  'n-b1': { groupsRequired: 2, groups: [['relax', 'relaxes'], ['reduces stress', 'reduce stress'], ['improves their mood', 'improves mood', 'improve their mood']], expected: 'It helps people relax, reduces stress and improves their mood. Any two: relax, reduce stress, improve mood.', feedback: 'The passage lists these positive effects on health.' },
  'n-b2': { accepted: ['to entertain young patients and make their hospital experience less frightening', 'to entertain young patients', 'to make their hospital experience less frightening', 'to help children feel more comfortable'], expected: 'To entertain young patients and make their hospital experience less frightening.', feedback: 'Hospitals use clowns to entertain young patients and help them feel more comfortable.' },
  'n-b3': { groupsRequired: 2, groups: [['make lessons more enjoyable', 'lessons more enjoyable'], ['encourage students to participate', 'students participate', 'encourages students to participate']], expected: 'It makes lessons more enjoyable and encourages students to participate.', feedback: 'The passage says that a teacher’s humour can make lessons enjoyable and encourage participation.' },
  'n-c1': { correctValue: 'true', justification: ['helps them deal with difficult situations', 'helps people deal with difficult situations', 'deal with difficult situations'], expected: 'TRUE. Humour helps people deal with difficult situations.', feedback: 'The first paragraph says humour helps people deal with difficult situations.' },
  'n-c2': { correctValue: 'false', justification: ["can hurt people's feelings", 'damage relationships'], expected: "FALSE. This type of humour can hurt people's feelings and damage relationships.", feedback: 'The passage explains that jokes about weaknesses can hurt people and damage relationships.' },
  'n-d1': { accepted: ['enjoyable'], expected: 'Enjoyable.', feedback: 'The text uses “enjoyable” to describe an ordinary day made more pleasant.' },
  'n-d2': { accepted: ['entertain'], expected: 'Entertain.', feedback: '“Entertain” means to amuse or provide enjoyment.' },
  'n-e1': { accepted: ['humour', 'humor'], expected: 'Humour.', feedback: '“It” refers to humour.' },
  'n-e2': { accepted: ['making fun of others because of their appearance background or weaknesses', 'making fun of others because of their appearance', 'making fun of others'], expected: 'Making fun of others because of their appearance, background or weaknesses.', feedback: '“This type of humour” refers to making fun of people for these reasons.' },

  's-a1': { correctValue: 'b', expected: 'B · The importance of humour.', feedback: 'The passage describes several reasons humour is important.' },
  's-b1': { accepted: ['happy', 'feel happy'], expected: 'Happy.', feedback: 'The first paragraph says humour makes people feel happy.' },
  's-b2': { accepted: ['to make children smile and feel less afraid', 'make children smile and feel less afraid', 'to make children smile', 'to help children feel less afraid'], expected: 'To make children smile and feel less afraid.', feedback: 'Clowns tell jokes and perform to make the children smile and feel less afraid.' },
  's-b3': { groupsRequired: 2, groups: [['makes lessons more enjoyable', 'make lessons more enjoyable'], ['students more interested in learning', 'interested in learning', 'students feel interested']], expected: 'It makes lessons more enjoyable and students more interested in learning.', feedback: 'The passage says humour makes lessons enjoyable and students interested in learning.' },
  's-c1': { correctValue: 'true', expected: 'TRUE.', feedback: 'The passage says humour helps people relax.' },
  's-c2': { correctValue: 'false', expected: 'FALSE.', feedback: 'The passage says making fun of someone’s appearance is not good.' },
  's-d1': { accepted: ['relax'], expected: 'Relax.', feedback: 'The text says humour helps people relax.' },
  's-d2': { accepted: ['entertain', 'make children smile', 'make children smile and feel less afraid'], expected: 'Entertain.', feedback: 'The supplied answer key gives “entertain”; the passage describes clowns making children smile.' },
  's-e1': { accepted: ['humour', 'humor', 'laughter'], expected: 'Humour / laughter.', feedback: '“It” refers to humour or laughter.' },
  's-e2': { accepted: ['clowns'], expected: 'Clowns.', feedback: '“They” refers to the clowns.' },
};
