import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
  id: 'unit-6-reading-women-power',
  slug: 'unit-6-reading-women-power',
  title: 'Women: Breaking Barriers and Making a Difference',
  level: '2BAC English',
  unit: 'Ticket to English 2 · Unit 6 — Women and Power',
  version: 'normal',
  versionLabel: 'Normal Version',
  description: 'Read about women’s equality, empowerment, and contributions to society.',
  duration: '25–30 minutes',
  supportLevel: 'Standard exam practice',
  passage: [
    'Throughout history, women have played important roles in society. They have contributed to education, science, politics, business and many other fields. However, in many parts of the world, women have faced discrimination and unequal opportunities. Some were prevented from receiving an education, choosing their careers or participating in important decisions.',
    'Today, many women are working hard to overcome these barriers. In education, more girls are attending schools and universities. In business, women are starting companies and managing large organisations. In politics, female leaders are participating in decision-making and defending the rights of their communities. <strong>These achievements</strong> show that women can make valuable contributions when they have equal opportunities.',
    "Despite this progress, gender inequality still exists. In some societies, women receive lower salaries than men for doing similar jobs. Others face difficulties finding employment or reaching leadership positions. In addition, traditional stereotypes sometimes suggest that certain professions are suitable only for men or only for women. <strong>Such beliefs</strong> limit people's choices and prevent societies from benefiting from everyone's abilities.",
    "Governments, schools and families all have a role to play in promoting gender equality. Governments should protect women's rights and ensure equal opportunities. Schools should teach boys and girls to respect one another, while families should encourage children to follow their interests without judging them according to gender. Women should also have opportunities to develop their skills and participate fully in society.",
    'In conclusion, empowering women does not mean giving them more rights than men. It means ensuring that everyone has the same opportunities to learn, work and participate in decision-making. A society that values both women and men is more likely to become fair, successful and developed.',
  ],
  sections: [
    { id: 'a', title: 'Section A · Choose the best title', instructions: 'Choose the best title for the text.', questions: [
      { id: 'n-a1', prompt: 'Choose the best title for the text.', marks: 1, type: 'choice', options: [{ value: 'a', label: 'a. The History of Education' }, { value: 'b', label: 'b. Women, Equality and Empowerment' }, { value: 'c', label: 'c. The Challenges of Modern Technology' }] },
    ] },
    { id: 'b', title: 'Section B · Answer the questions', instructions: 'Answer the questions using information from the text.', questions: [
      { id: 'n-b1', prompt: 'Mention two fields in which women have made important contributions.', marks: 1, type: 'short' },
      { id: 'n-b2', prompt: 'Give two examples of gender inequality mentioned in the text.', marks: 1, type: 'short' },
      { id: 'n-b3', prompt: 'What should schools do to promote gender equality?', marks: 1, type: 'short' },
    ] },
    { id: 'c', title: 'Section C · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
      { id: 'n-c1', prompt: 'Women have always enjoyed the same opportunities as men.', marks: 1, type: 'true-false-justify' },
      { id: 'n-c2', prompt: "Gender stereotypes can limit people's choices.", marks: 1, type: 'true-false-justify' },
    ] },
    { id: 'd', title: 'Section D · Vocabulary', instructions: 'Find words or expressions in the text that mean the following.', questions: [
      { id: 'n-d1', prompt: 'Unfair treatment of people (paragraph 1).', marks: 1, type: 'short' },
      { id: 'n-d2', prompt: 'The process of giving someone more control, confidence or opportunities (paragraph 5).', marks: 1, type: 'short' },
    ] },
    { id: 'e', title: 'Section E · References', instructions: 'What do the following expressions refer to?', questions: [
      { id: 'n-e1', prompt: '“These achievements” (paragraph 2).', marks: 1, type: 'short' },
      { id: 'n-e2', prompt: '“Such beliefs” (paragraph 3).', marks: 1, type: 'short' },
    ] },
  ],
};
