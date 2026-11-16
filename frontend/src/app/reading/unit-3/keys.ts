import { AnswerKey } from '../reading.models';

// This key is separate from the student-facing question data and is never rendered in the exam UI.
export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': { correctValue: 'b', expected: 'B · The Three Types of Education.', feedback: 'The text describes formal, non-formal and informal education.' },
  'n-b1': { accepted: ['in schools colleges and universities', 'schools colleges and universities'], expected: 'In schools, colleges and universities.', feedback: 'Formal education takes place in schools, colleges and universities.' },
  'n-b2': { groupsRequired: 2, groups: [['language courses'], ['computer training'], ['workshops'], ['sports programmes', 'sports programs'], ['vocational training']], expected: 'Any two: language courses, computer training, workshops, sports programmes, or vocational training.', feedback: 'These are the examples of non-formal education listed in paragraph 3.' },
  'n-b3': { groupsRequired: 3, groups: [['family', 'families'], ['friends'], ['personal experiences'], ['hobbies'], ['media']], expected: 'Through family, friends, personal experiences, hobbies and the media.', feedback: 'Paragraph 4 lists these everyday sources of informal learning.' },
  'n-c1': { correctValue: 'true', justification: ['follows an organised programme', 'organised programme with specific subjects'], expected: 'TRUE. Formal education follows an organised programme.', feedback: 'This is stated in paragraph 2.' },
  'n-c2': { correctValue: 'false', justification: ['does not normally lead to an official certificate', 'not normally planned and does not normally lead to an official certificate', 'does not normally lead to a certificate'], expected: 'FALSE. Informal education does not normally lead to an official certificate.', feedback: 'The passage says informal learning does not normally lead to an official certificate.' },
  'n-d1': { accepted: ['students'], expected: 'Students.', feedback: '“Students” is used in paragraph 2 for people who study.' },
  'n-d2': { accepted: ['flexible'], expected: 'Flexible.', feedback: 'The passage describes non-formal education as more flexible.' },
  'n-e1': { accepted: ['language courses computer training workshops sports programmes and vocational training', 'language courses computer training workshops sports programs and vocational training', 'language courses, computer training, workshops, sports programmes and vocational training'], expected: 'Language courses, computer training, workshops, sports programmes and vocational training.', feedback: '“These activities” refers to the examples listed in the previous sentence.' },
  'n-e2': { accepted: ['informal education', 'learning through everyday experiences', 'informal education learning through everyday experiences'], expected: 'Informal education, or learning through everyday experiences.', feedback: '“This type of learning” refers to informal education described in paragraph 4.' },

  's-a1': { correctValue: 'b', expected: 'B · Three types of education.', feedback: 'The text describes formal, non-formal and informal education.' },
  's-b1': { accepted: ['at schools colleges and universities', 'schools colleges and universities'], expected: 'At schools, colleges and universities.', feedback: 'The passage gives these places in paragraph 2.' },
  's-b2': { groupsRequired: 2, groups: [['language courses'], ['computer classes'], ['workshops'], ['sports activities']], expected: 'Any two: language courses, computer classes, workshops or sports activities.', feedback: 'These are the examples of non-formal education listed in paragraph 3.' },
  's-b3': { groupsRequired: 2, groups: [['parents'], ['friends'], ['personal experiences'], ['other people', 'people']], expected: 'Parents, friends and other people.', feedback: 'Paragraph 4 says people learn from parents, friends and personal experiences.' },
  's-c1': { correctValue: 'true', expected: 'TRUE.', feedback: 'The passage says students take tests and examinations in formal education.' },
  's-c2': { correctValue: 'false', expected: 'FALSE.', feedback: 'Informal education happens in everyday life, not only at school.' },
  's-d1': { accepted: ['teacher'], expected: 'Teacher.', feedback: 'Teachers explain lessons and teach students.' },
  's-d2': { accepted: ['skills'], expected: 'Skills.', feedback: 'Paragraph 1 says education helps us develop useful skills.' },
  's-e1': { accepted: ['language courses computer classes workshops and sports activities', 'language courses computer classes workshops sports activities'], expected: 'Language courses, computer classes, workshops and sports activities.', feedback: '“These activities” refers to the examples listed in paragraph 3.' },
  's-e2': { accepted: ['people'], expected: 'People.', feedback: 'The word “People” refers to people learning informally in everyday life.' },
};
