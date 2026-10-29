import { READING_ANSWER_KEYS } from './reading.answer-keys';
import { AssessmentResult, QuestionResult, ReadingAnswers, ReadingExam, ReadingQuestion } from './reading.models';

const normalize = (value: string): string => value.toLocaleLowerCase().trim().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  if (i < a.length || j < b.length) edits++;
  return edits <= 1;
}
function containsAcceptedWithMinorTypo(actual: string, expected: string): boolean {
  const actualWords = actual.split(' '), expectedWords = expected.split(' ');
  if (expectedWords.length > actualWords.length) return false;
  return actualWords.some((_, start) => {
    if (start + expectedWords.length > actualWords.length) return false;
    let typoCount = 0;
    for (let offset = 0; offset < expectedWords.length; offset++) {
      const actualWord = actualWords[start + offset], expectedWord = expectedWords[offset];
      if (actualWord === expectedWord) continue;
      if (!withinOneEdit(actualWord, expectedWord) || ++typoCount > 1) return false;
    }
    return true;
  });
}
export function scoreReadingExam(exam: ReadingExam, answers: ReadingAnswers): AssessmentResult {
  const results: QuestionResult[] = [];
  for (const section of exam.sections) for (const question of section.questions) results.push(scoreQuestion(question, answers));
  const score = Number(results.reduce((sum, question) => sum + question.earned, 0).toFixed(2));
  return { score, total: results.reduce((sum, question) => sum + question.possible, 0), questions: results };
}
function scoreQuestion(question: ReadingQuestion, answers: ReadingAnswers): QuestionResult {
  const key = READING_ANSWER_KEYS[question.id];
  const base = { questionId: question.id, possible: question.marks, expected: key.expected, feedback: key.feedback };
  const value = (answers[question.id] ?? '').trim();
  if (question.type === 'true-false-justify') {
    const choice = answers[`${question.id}-choice`] ?? '';
    const why = normalize(answers[`${question.id}-why`] ?? '');
    if (!choice && !why) return { ...base, earned: 0, status: 'unanswered' };
    const choiceMark = choice === key.correctValue ? question.marks / 2 : 0;
    const hasJustification = (key.justification ?? []).some((phrase) => why.includes(normalize(phrase)));
    const earned = Number((choiceMark + (hasJustification ? question.marks / 2 : 0)).toFixed(2));
    return { ...base, earned, status: earned === question.marks ? 'correct' : earned > 0 ? 'partial' : 'review' };
  }
  if (!value) return { ...base, earned: 0, status: 'unanswered' };
  if (question.type === 'true-false' || question.type === 'choice' || question.type === 'matching') {
    const earned = value === key.correctValue ? question.marks : 0;
    return { ...base, earned, status: earned ? 'correct' : 'incorrect' };
  }
  const normalized = normalize(value);
  if (key.accepted?.some((answer) => normalized === normalize(answer) || normalized.includes(normalize(answer)) || (key.allowMinorSpellingErrors && containsAcceptedWithMinorTypo(normalized, normalize(answer))))) return { ...base, earned: question.marks, status: 'correct' };
  if (key.groups?.length) {
    const matched = key.groups.filter((group) => group.some((phrase) => normalized.includes(normalize(phrase)))).length;
    const required = Math.min(key.groupsRequired ?? key.groups.length, key.groups.length);
    if (matched) {
      const earned = Number((question.marks * Math.min(matched, required) / required).toFixed(2));
      return { ...base, earned, status: earned === question.marks ? 'correct' : 'partial' };
    }
  }
  // Free text is not judged semantically. Show the model answer and identify uncertain responses for review.
  return { ...base, earned: 0, status: 'review' };
}
export function questionAnswered(question: ReadingQuestion, answers: ReadingAnswers): boolean {
  if (question.type === 'true-false-justify') return Boolean(answers[`${question.id}-choice`] && answers[`${question.id}-why`]?.trim());
  return Boolean(answers[question.id]?.trim());
}
