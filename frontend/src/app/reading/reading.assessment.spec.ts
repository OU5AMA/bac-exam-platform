import { READING_EXAMS } from './reading.data';
import { scoreReadingExam } from './reading.assessment';
import { ReadingAnswers } from './reading.models';

describe('scoreReadingExam', () => {
  it('marks the complete normal exam out of exactly 10', () => {
    const exam = READING_EXAMS.find((item) => item.version === 'normal')!;
    const answers: ReadingAnswers = {
      'n-a1': 'The importance of life skills in personal development and success',
      'n-a2': 'He was shy and found it hard to express his opinions',
      'n-a3': 'He participated in classroom discussions and worked with other students',
      'n-a4': 'Teamwork, empathy, and responsibility',
      'n-b1-choice': 'false', 'n-b1-why': 'He took the initiative to make positive changes',
      'n-b2-choice': 'true', 'n-b2-why': 'This helped him improve his school results',
      'n-b3-choice': 'false', 'n-b3-why': 'Success includes contributing to society',
      'n-c1': 'ambition', 'n-c2': 'concentrate', 'n-c3': 'challenges', 'n-c4': 'empathy',
      'n-d1': 'Youssef', 'n-d2': 'Helping younger children with their homework',
    };
    const result = scoreReadingExam(exam, answers);
    expect(result.total).toBe(10);
    expect(result.score).toBe(10);
    expect(result.questions.every((item) => item.status === 'correct')).toBe(true);
  });

  it('marks the complete SEN exam out of exactly 10', () => {
    const exam = READING_EXAMS.find((item) => item.version === 'sen')!;
    const answers: ReadingAnswers = {
      's-a1': ' Adam ', 's-a2': 'true', 's-a3': 'A study timetable', 's-a4': 'Helping others',
      's-b1': 'false', 's-b2': 'true', 's-c1': 'b', 's-c2': 'a',
      's-d1': 'b', 's-d2': 'a', 's-d3': 'd', 's-d4': 'c',
    };
    const result = scoreReadingExam(exam, answers);
    expect(result.total).toBe(10);
    expect(result.score).toBe(10);
  });

  it('awards half credit for a correct true/false choice without a justification', () => {
    const exam = READING_EXAMS.find((item) => item.version === 'normal')!;
    const result = scoreReadingExam(exam, { 'n-b1-choice': 'false' });
    const question = result.questions.find((item) => item.questionId === 'n-b1')!;
    expect(question.earned).toBe(0.5);
    expect(question.status).toBe('partial');
  });

  it('marks uncertain free-text wording for review instead of calling it incorrect', () => {
    const exam = READING_EXAMS.find((item) => item.version === 'normal')!;
    const result = scoreReadingExam(exam, { 'n-a1': 'Life skills make someone better at life.' });
    const question = result.questions.find((item) => item.questionId === 'n-a1')!;
    expect(question.earned).toBe(0);
    expect(question.status).toBe('review');
  });
});

describe('Small Actions, Big Changes activities', () => {
  const standard = READING_EXAMS.find((item) => item.slug === '2bac-small-actions-big-changes-standard')!;
  const sen = READING_EXAMS.find((item) => item.slug === '2bac-small-actions-big-changes-sen')!;

  it('publishes separate Standard and SEN tasks with unique routes and 10 points each', () => {
    expect(standard).toBeTruthy();
    expect(sen).toBeTruthy();
    expect(standard.id).not.toBe(sen.id);
    expect(standard.slug).not.toBe(sen.slug);
    expect(standard.version).toBe('normal');
    expect(sen.version).toBe('sen');
    expect(standard.title).toBe('Small Actions, Big Changes');
    expect(sen.title).toBe(standard.title);
    expect(standard.sections.flatMap((section) => section.questions).reduce((sum, question) => sum + question.marks, 0)).toBe(10);
    expect(sen.sections.flatMap((section) => section.questions).reduce((sum, question) => sum + question.marks, 0)).toBe(10);
  });

  it('scores a complete Standard attempt out of 10, including justified partial-mark items', () => {
    const answers: ReadingAnswers = {
      'sa-std-a1': 'A campaign to clean her neighbourhood',
      'sa-std-a2': 'She was worried that her classmates would not be interested',
      'sa-std-a3': 'Hamza designed posters',
      'sa-std-a4': 'Communication and empathy',
      'sa-std-b1-choice': 'false', 'sa-std-b1-why': 'They learned to cooperate, respect different opinions, and solve problems together.',
      'sa-std-b2-choice': 'true', 'sa-std-b2-why': 'She prepared a timetable and divided the tasks.',
      'sa-std-b3-choice': 'false', 'sa-std-b3-why': 'Young people should not wait for others to make changes.',
      'sa-std-c1': 'ambition', 'sa-std-c2': 'cooperate', 'sa-std-c3': 'challenges', 'sa-std-c4': 'leadership',
      'sa-std-d1': 'Salma', 'sa-std-d2': 'Salma, Hamza, and the other students',
    };
    const result = scoreReadingExam(standard, answers);
    expect(result.total).toBe(10);
    expect(result.score).toBe(10);
    expect(result.questions.every((question) => question.status === 'correct')).toBe(true);
  });

  it('scores the SEN attempt out of 10 and accepts a minor spelling error in a short answer', () => {
    const answers: ReadingAnswers = {
      'sa-sen-a1': '17 years old', 'sa-sen-a2': 'clean her neighbourhod', 'sa-sen-a3': 'designed posters', 'sa-sen-a4': 'proud and happy',
      'sa-sen-b1': 'true', 'sa-sen-b2': 'false', 'sa-sen-b3': 'true',
      'sa-sen-c1': 'b', 'sa-sen-c2': 'a', 'sa-sen-c3': 'd', 'sa-sen-c4': 'c',
      'sa-sen-d1': 'Salma', 'sa-sen-d2': 'Salma and her friends',
    };
    const result = scoreReadingExam(sen, answers);
    expect(result.total).toBe(10);
    expect(result.score).toBe(10);
  });

  it('includes every required Standard vocabulary answer in its passage', () => {
    const text = standard.passage.join(' ').toLowerCase();
    for (const word of ['ambition', 'cooperate', 'challenges', 'leadership']) expect(text).toContain(word);
  });
});
