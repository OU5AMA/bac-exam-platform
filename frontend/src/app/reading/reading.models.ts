export type ReadingQuestionType = 'short' | 'true-false' | 'true-false-justify' | 'choice' | 'matching';
export interface ReadingOption { value: string; label: string; }
export interface ReadingQuestion { id: string; prompt: string; marks: number; type: ReadingQuestionType; options?: ReadingOption[]; }
export interface ReadingSection { id: string; title: string; instructions: string; questions: ReadingQuestion[]; }
export interface ReadingExam {
  id: string; slug: string; title: string; level: string; unit: string;
  version: 'normal' | 'sen'; versionLabel: string; description: string;
  duration: string; supportLevel: string; passage: string[]; sections: ReadingSection[];
}
export type ReadingAnswers = Record<string, string>;
export type ResultStatus = 'correct' | 'partial' | 'incorrect' | 'unanswered' | 'review';
export interface QuestionResult { questionId: string; earned: number; possible: number; status: ResultStatus; expected: string; feedback: string; }
export interface AssessmentResult { score: number; total: number; questions: QuestionResult[]; }
