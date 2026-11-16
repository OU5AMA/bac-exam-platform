import { AnswerKey } from '../reading.models';

export const READING_ANSWER_KEYS: Record<string, AnswerKey> = {
  'n-a1': { correctValue: 'b', expected: 'B · Science and Technology: Benefits and Challenges.', feedback: 'The text describes both the benefits and challenges of science and technology.' },
  'n-b1': { accepted: ['it allows people to communicate with others around the world in a few seconds', 'allows people to communicate with people around the world in a few seconds', 'people can communicate with others around the world in a few seconds'], expected: 'It allows people to communicate with others around the world in a few seconds.', feedback: 'The first paragraph explains that modern devices make worldwide communication fast.' },
  'n-b2': { groupsRequired: 2, groups: [['digital libraries'], ['educational websites'], ['online courses'], ['digital tools'], ['interactive activities']], expected: 'Any two: digital libraries, educational websites, online courses, digital tools or interactive activities.', feedback: 'These are examples of technology supporting education in paragraph 2.' },
  'n-b3': { groupsRequired: 2, groups: [['helped doctors diagnose diseases more accurately', 'diagnose diseases more accurately'], ['treat patients more effectively', 'treat patients effectively'], ['new medicines and vaccines help prevent and fight illnesses', 'medicines and vaccines help prevent and fight illnesses']], expected: 'Scientific discoveries help doctors diagnose diseases more accurately and treat patients more effectively; new medicines and vaccines help prevent and fight illnesses.', feedback: 'Paragraph 3 describes improved diagnosis and treatment, as well as medicines and vaccines.' },
  'n-c1': { correctValue: 'true', justification: ['learning is no longer limited to the classroom', 'no longer limited to the classroom'], expected: 'TRUE. Learning is no longer limited to the classroom.', feedback: 'The second paragraph says people can study beyond the classroom.' },
  'n-c2': { correctValue: 'false', justification: ["sharing personal information on the internet can put users' privacy at risk", 'put users privacy at risk', 'privacy at risk'], expected: "FALSE. Sharing personal information online can put users' privacy at risk.", feedback: 'The fourth paragraph warns that sharing personal information can put privacy at risk.' },
  'n-d1': { accepted: ['accessible'], expected: 'Accessible.', feedback: 'The first paragraph says technology has made information more accessible.' },
  'n-d2': { accepted: ['privacy'], expected: 'Privacy.', feedback: 'The passage warns that users’ privacy can be at risk.' },
  'n-e1': { accepted: ['the use of smartphones computers and the internet to communicate and exchange information', 'smartphones computers and the internet to communicate with people around the world', 'communicating with people around the world using smartphones computers and the internet'], expected: 'The use of smartphones, computers and the internet to communicate and exchange information.', feedback: '“These developments” refers to modern communication technology described in the first paragraph.' },
  'n-e2': { accepted: ['people'], expected: 'People.', feedback: '“They” refers to people.' },

  's-a1': { correctValue: 'a', expected: 'A · Science and technology in our lives.', feedback: 'The text explains how science and technology are part of daily life.' },
  's-b1': { accepted: ['to communicate with others', 'communicate with others', 'to send messages and talk to people in different countries'], expected: 'To communicate with others.', feedback: 'The first paragraph says people use these devices to communicate.' },
  's-b2': { groupsRequired: 2, groups: [['find information'], ['read digital books'], ['follow online courses']], expected: 'They can find information, read digital books and follow online courses.', feedback: 'These are ways students use technology to learn in paragraph 2.' },
  's-b3': { groupsRequired: 2, groups: [['fight illnesses'], ['stay healthy']], expected: 'They help people fight illnesses and stay healthy.', feedback: 'The third paragraph says medicines and vaccines help people fight illnesses and stay healthy.' },
  's-c1': { correctValue: 'true', expected: 'TRUE.', feedback: 'The passage says students can learn at school or at home.' },
  's-c2': { correctValue: 'false', expected: 'FALSE. Not all information on the internet is true.', feedback: 'The fourth paragraph says not all internet information is true.' },
  's-d1': { accepted: ['diseases'], expected: 'Diseases.', feedback: 'The text uses “diseases” for illnesses.' },
  's-d2': { accepted: ['protect'], expected: 'Protect.', feedback: 'The passage says we should protect our personal information.' },
  's-e1': { accepted: ['students'], expected: 'Students.', feedback: '“They” refers to students.' },
  's-e2': { accepted: ['technology'], expected: 'Technology.', feedback: '“It” refers to technology.' },
};
