import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginGateService, SaveChoice } from '../../../shared/login-gate.service';
import { LoginGateModalComponent } from '../../../shared/login-gate-modal.component';

type ExerciseType = 'fill_modal' | 'identify_function' | 'mixed' | 'paragraph';
interface ExerciseQuestion {
  id: string;
  before?: string;
  after?: string;
  sentence?: string;
  modal?: string;
}
interface GrammarExercise {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  type: ExerciseType;
  sentenceCount: number;
  gapCount: number;
  difficulty: string;
  maxScore: number;
  wordBank: string[] | null;
  functionChoices: string[];
  questions: ExerciseQuestion[];
}
interface QuestionFeedback {
  id: string;
  correct: boolean;
  modalCorrect?: boolean;
  functionCorrect?: boolean;
  canonicalAnswer?: string;
  acceptedAnswers?: string[];
  canonicalFunction?: string;
  function?: string;
  explanation: string;
  pointsEarned: number;
}
interface ExerciseResult {
  exerciseId: string;
  score: number;
  maxScore: number;
  baseScore: number;
  baseMaxScore: number;
  attemptNumber: number;
  retryCapApplied: boolean;
  percent: number;
  progressScore: number;
  progressMaxScore: number;
  feedback: QuestionFeedback[];
  reviewFunctions: string[];
  badgeAwarded: string | null;
}
interface MixedAnswer { modal: string; function: string; }
type ExerciseAnswer = string | MixedAnswer;

@Component({
  selector: 'app-grammar-exercise',
  standalone: true,
  imports: [RouterLink, LoginGateModalComponent],
  template: `
    <app-login-gate-modal />
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-4xl">
        <a routerLink="/2-bac/unit/2/grammar/exercises" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2">←</span> All grammar exercises</a>
        @if (loading()) { <div class="mt-6 animate-pulse space-y-4" aria-label="Loading exercise" aria-busy="true"><div class="h-36 rounded-2xl bg-[#DDE6E1]"></div><div class="h-56 rounded-2xl bg-white"></div></div> }
        @else if (error()) { <section role="alert" class="mt-6 rounded-2xl border border-[#D9958C] bg-white p-6"><h1 class="font-display text-2xl font-bold text-[#0B3B3B]">We couldn’t load this exercise</h1><p class="mt-2">{{ error() }}</p><button type="button" (click)="loadExercise()" class="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button></section> }
        @else if (exercise(); as data) {
          <header class="mt-5 rounded-2xl bg-[#0B3B3B] p-5 text-white shadow-sm sm:p-7"><p class="text-xs font-bold uppercase tracking-[.18em] text-[#F5C56D]">Unit 2 · Grammar · Humour</p><h1 class="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{{ data.title }}</h1><p class="mt-2 max-w-2xl text-sm leading-6 text-white/90">{{ data.description }}</p>@if (!result() && data.wordBank) { <button type="button" (click)="hideWordBank.set(!hideWordBank())" [attr.aria-pressed]="hideWordBank()" class="mt-4 inline-flex min-h-10 items-center rounded-lg border border-white/40 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{{ hideWordBank() ? 'Show word bank · standard points' : 'Hide word bank · +50% points' }}</button> }</header>

          @if (result(); as outcome) {
            <section class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="result-heading">
              <p class="text-xs font-extrabold uppercase tracking-[.16em] text-[#0A6B6B]">Exercise complete</p><h2 id="result-heading" class="font-display mt-1 text-3xl font-extrabold text-[#0B3B3B]">{{ outcome.score }} / {{ outcome.maxScore }} points</h2><p class="mt-2 text-sm leading-6">{{ outcome.percent }}% · Attempt {{ outcome.attemptNumber }}@if (outcome.retryCapApplied) { · retry score capped at 70% }</p>
              <div class="mt-4 h-3 overflow-hidden rounded-full bg-[#E7EEEA]" role="progressbar" [attr.aria-valuenow]="outcome.percent" aria-valuemin="0" aria-valuemax="100" aria-label="Exercise score"><div class="h-full rounded-full bg-[#0A6B6B]" [style.width.%]="outcome.percent"></div></div>
              @if (outcome.badgeAwarded) { <p class="mt-4 inline-flex rounded-full bg-[#FFF0D1] px-3 py-2 text-sm font-extrabold text-[#805300]" role="status">🏅 {{ outcome.badgeAwarded }} earned</p> }
              <p class="mt-3 text-sm" role="status">@if (progressSaved() === true) { Progress and streak saved. } @else if (progressSaved() === false) { {{ progressError() }} } @else if (progressSaved() === 'skipped') { Practice complete. This score was not saved. } @else { Choose whether to save your score. }</p>
              <div class="mt-6"><h3 class="font-display text-xl font-extrabold text-[#0B3B3B]">Review mistakes</h3>@if (mistakes(outcome).length === 0) { <p class="mt-2 rounded-xl bg-[#F1F8F6] p-4 text-sm font-semibold text-[#075B5B]">No mistakes this time. Great work!</p> } @else { <ul class="mt-3 space-y-3">@for (item of mistakes(outcome); track item.id) { <li class="rounded-xl border border-[#E9EDEB] bg-[#FAFCFB] p-4"><p class="text-sm"><span class="font-bold text-[#9B3D2D]">Your answer:</span> {{ submittedLabel(item.id) || 'No answer' }}</p><p class="mt-1 text-sm"><span class="font-bold text-[#075B5B]">Answer:</span> {{ answerLabel(item) }}</p><p class="mt-2 text-xs leading-5 text-[#53615F]">{{ item.explanation }}</p>@if (reviewFunction(item)) { <a [routerLink]="'/2-bac/unit/2/grammar'" [fragment]="reviewFragment(item)" class="mt-2 inline-flex min-h-10 items-center text-xs font-bold text-[#0A6B6B] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Review {{ reviewFunction(item) }} in the lesson →</a> }</li> }</ul> }</div>
              <div class="mt-6 flex flex-col gap-3 sm:flex-row"><a routerLink="/2-bac/unit/2/grammar/exercises" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Back to exercise list</a><a routerLink="/2-bac/unit/2" class="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#0A6B6B] bg-white px-5 font-extrabold text-[#075B5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Back to Unit Hub</a><button type="button" (click)="retry()" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F5A623] px-5 font-extrabold text-[#273A36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button></div>
            </section>
          } @else if (data.type === 'paragraph') {
            <section class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="paragraph-heading"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wide text-[#0A6B6B]">Continuous paragraph · {{ data.gapCount }} gaps</p><h2 id="paragraph-heading" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Fill each blank, then submit the whole paragraph</h2></div><span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">{{ answeredCount() }} / {{ data.gapCount }} filled</span></div>
              @if (!hideWordBank() && data.wordBank) { <div class="mt-4 rounded-xl bg-[#F1F8F6] p-4"><p class="text-xs font-extrabold uppercase tracking-wide text-[#075B5B]">Word bank</p><div class="mt-2 flex flex-wrap gap-2">@for (word of data.wordBank; track word) { <button type="button" (click)="setAnswer(activeQuestionId(), word)" class="min-h-9 rounded-lg border border-[#C7DBD3] bg-white px-3 text-xs font-bold text-[#075B5B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ word }}</button> }</div></div> }
              <p class="mt-5 text-base leading-[2.8] text-[#183E3D]">@for (question of data.questions; track question.id; let i = $index) { {{ question.before }}<span class="inline-flex items-center gap-1 rounded-lg px-1 align-baseline" [class.bg-[#FFF0D1]]="activeParagraphGap() === i"><span class="text-[11px] font-extrabold text-[#805300]">({{ i + 1 }})</span><input type="text" [id]="'paragraph-gap-' + i" [attr.data-gap-index]="i" [value]="answerText(question.id)" (focus)="activeParagraphGap.set(i)" (input)="setAnswer(question.id, $any($event.target).value)" (keydown)="onParagraphKeydown($event, i)" [attr.aria-label]="'Paragraph blank ' + (i + 1)" [readonly]="!!result()" class="w-28 rounded-md border border-[#8EB8A8] bg-white px-2 py-1 text-sm font-bold text-[#0B3B3B] focus-visible:outline-2 focus-visible:outline-[#0A6B6B] sm:w-36"></span>{{ question.after }} }</p>
              @if (paragraphFeedback().length) { <div class="mt-5 space-y-2" aria-live="polite">@for (question of data.questions; track question.id; let i = $index) { @if (feedbackFor(question.id); as fb) { <details class="rounded-xl border border-[#E5E7E5] bg-[#FAFCFB] p-3"><summary class="cursor-pointer text-sm font-bold focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Blank {{ i + 1 }} · {{ fb.correct ? 'Correct' : 'Review this answer' }}</summary><p class="mt-2 text-sm">Answer: <strong>{{ fb.canonicalAnswer }}</strong></p>@if (fb.function) { <p class="mt-1 text-xs font-bold text-[#075B5B]">Function: {{ fb.function }}</p> }<p class="mt-1 text-xs leading-5">{{ fb.explanation }}</p></details> } }</div> }
              @if (gradeError()) { <p class="mt-3 text-sm font-semibold text-[#9B3D2D]" role="alert">{{ gradeError() }}</p> }
              <div class="mt-5 flex flex-wrap items-center justify-between gap-3"><button type="button" (click)="moveParagraphGap(-1)" [disabled]="activeParagraphGap() === 0" class="min-h-11 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Previous blank</button><button type="button" (click)="moveParagraphGap(1)" [disabled]="activeParagraphGap() >= data.gapCount - 1" class="min-h-11 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Next blank</button><button type="button" (click)="submitExercise()" [disabled]="!allAnswered() || submitting()" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F5A623] px-5 font-extrabold text-[#273A36] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ submitting() ? 'Checking…' : 'Submit paragraph' }}</button></div>
            </section>
          } @else if (question(); as current) {
            <section class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="question-heading"><div class="flex items-center justify-between gap-3"><span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-extrabold text-[#075B5B]">Question {{ currentIndex() + 1 }} of {{ data.questions.length }}</span><span class="text-xs font-bold text-[#53615F]">{{ data.type === 'mixed' ? '2 points' : '1 point' }}</span></div><progress class="mt-4 h-2 w-full accent-[#0A6B6B]" [value]="currentIndex() + 1" [max]="data.questions.length" [attr.aria-label]="'Question ' + (currentIndex() + 1) + ' of ' + data.questions.length"></progress>
              @if (data.type === 'identify_function') { <h2 id="question-heading" class="font-display mt-5 text-xl font-extrabold text-[#0B3B3B]">What is the modal doing?</h2><p class="mt-4 rounded-xl bg-[#FAFCFB] p-4 text-lg leading-8 text-[#183E3D]">@for (part of sentenceParts(current); track $index) { @if (part.modal) { <strong class="rounded bg-[#FFF0D1] px-1 text-[#805300]">{{ part.text }}</strong> } @else { {{ part.text }} } }</p><div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">@for (fn of data.functionChoices; track fn) { <button type="button" (click)="setAnswer(current.id, fn)" [attr.aria-pressed]="answerText(current.id) === fn" class="min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]" [class.border-[#0A6B6B]]="answerText(current.id) === fn" [class.bg-[#E8F2F0]]="answerText(current.id) === fn" [class.text-[#075B5B]]="answerText(current.id) === fn" [class.border-[#E5E7E5]]="answerText(current.id) !== fn" [class.bg-white]="answerText(current.id) !== fn">{{ fn }}</button> }</div> }
              @else { <h2 id="question-heading" class="font-display mt-5 text-xl font-extrabold text-[#0B3B3B]">@if (data.type === 'mixed') { Choose the modal and its function } @else { Complete the sentence }</h2><p class="mt-4 rounded-xl bg-[#FAFCFB] p-4 text-lg leading-8 text-[#183E3D]">{{ current.before }}<input type="text" [value]="modalAnswer(current.id)" (input)="setMixedModal(current.id, $any($event.target).value)" [attr.aria-label]="'Modal answer for question ' + (currentIndex() + 1)" class="inline-block w-36 rounded-md border border-[#8EB8A8] bg-white px-2 py-1 text-base font-bold text-[#0B3B3B] focus-visible:outline-2 focus-visible:outline-[#0A6B6B] sm:w-48">{{ current.after }}</p>
                @if (data.type === 'mixed') { <h3 class="mt-5 text-xs font-extrabold uppercase tracking-wide text-[#53615F]">Choose the function</h3><div class="mt-2 flex flex-wrap gap-2">@for (fn of data.functionChoices; track fn) { <button type="button" (click)="setMixedFunction(current.id, fn)" [attr.aria-pressed]="functionAnswer(current.id) === fn" class="min-h-10 rounded-lg border px-3 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]" [class.border-[#0A6B6B]]="functionAnswer(current.id) === fn" [class.bg-[#E8F2F0]]="functionAnswer(current.id) === fn" [class.text-[#075B5B]]="functionAnswer(current.id) === fn" [class.border-[#E5E7E5]]="functionAnswer(current.id) !== fn" [class.bg-white]="functionAnswer(current.id) !== fn">{{ fn }}</button> }</div> } }
              @if (feedbackFor(current.id); as fb) { <div class="mt-4 rounded-xl p-4" [class.bg-[#EAF5EF]]="fb.correct" [class.bg-[#FFF0E9]]="!fb.correct" role="status"><p class="font-bold" [class.text-[#075B5B]]="fb.correct" [class.text-[#9B3D2D]]="!fb.correct">{{ fb.correct ? 'Correct' : 'Not quite' }}@if (data.type === 'mixed' && !fb.correct) { · modal {{ fb.modalCorrect ? '✓' : '✗' }}, function {{ fb.functionCorrect ? '✓' : '✗' }} }</p><p class="mt-1 text-sm">Answer: <strong>{{ answerLabel(fb) }}</strong></p>@if (fb.function || fb.canonicalFunction) { <p class="mt-1 text-xs font-bold text-[#075B5B]">Function: {{ fb.function || fb.canonicalFunction }}</p> }<p class="mt-1 text-xs leading-5">{{ fb.explanation }}</p></div> }
              @if (gradeError()) { <p class="mt-3 text-sm font-semibold text-[#9B3D2D]" role="alert">{{ gradeError() }}</p> }
              <div class="mt-5 flex flex-wrap justify-between gap-3"><button type="button" (click)="moveQuestion(-1)" [disabled]="currentIndex() === 0 || submitting()" class="min-h-11 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Previous</button>@if (!feedbackFor(current.id)) { <button type="button" (click)="checkCurrent(current)" [disabled]="!currentAnswered(current) || submitting()" class="min-h-11 rounded-lg bg-[#0A6B6B] px-5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ submitting() ? 'Checking…' : 'Check answer' }}</button> } @else if (currentIndex() < data.questions.length - 1) { <button type="button" (click)="moveQuestion(1)" class="min-h-11 rounded-lg bg-[#F5A623] px-5 text-sm font-extrabold text-[#273A36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Next question →</button> } @else { <button type="button" (click)="submitExercise()" [disabled]="submitting()" class="min-h-11 rounded-lg bg-[#F5A623] px-5 text-sm font-extrabold text-[#273A36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ submitting() ? 'Saving…' : 'Finish exercise' }}</button> }</div>
            </section>
          }
        }
      </div>
    </main>
  `,
})
export class GrammarExerciseComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly loginGate = inject(LoginGateService);
  protected readonly exercise = signal<GrammarExercise | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly answers = signal<Record<string, ExerciseAnswer>>({});
  protected readonly checked = signal<Record<string, QuestionFeedback>>({});
  protected readonly currentIndex = signal(0);
  protected readonly activeParagraphGap = signal(0);
  protected readonly hideWordBank = signal(false);
  protected readonly submitting = signal(false);
  protected readonly gradeError = signal('');
  protected readonly result = signal<ExerciseResult | null>(null);
  protected readonly progressSaved = signal<boolean | SaveChoice | null>(null);
  protected readonly progressError = signal('');
  protected readonly question = computed(() => this.exercise()?.questions[this.currentIndex()] ?? null);
  protected readonly paragraphFeedback = computed(() => this.result()?.feedback ?? Object.values(this.checked()));

  constructor() { this.loadExercise(); }

  protected loadExercise(): void {
    this.loading.set(true); this.error.set('');
    const id = this.route.snapshot.paramMap.get('exerciseId');
    this.http.get<GrammarExercise>(`/api/grammar/unit/2/exercises/${encodeURIComponent(id ?? '')}`).subscribe({
      next: (exercise) => { this.exercise.set(exercise); this.loading.set(false); },
      error: () => { this.error.set('Please check your connection and try again.'); this.loading.set(false); },
    });
  }

  protected answerText(id: string): string { const value = this.answers()[id]; return typeof value === 'string' ? value : ''; }
  protected modalAnswer(id: string): string { const value = this.answers()[id]; return typeof value === 'object' ? value.modal : ''; }
  protected functionAnswer(id: string): string { const value = this.answers()[id]; return typeof value === 'object' ? value.function : ''; }
  protected setAnswer(id: string, value: string): void {
    this.answers.update((all) => ({ ...all, [id]: value }));
    this.checked.update((all) => { const next = { ...all }; delete next[id]; return next; });
  }
  protected setMixedModal(id: string, modal: string): void { this.setMixedPart(id, 'modal', modal); }
  protected setMixedFunction(id: string, fn: string): void { this.setMixedPart(id, 'function', fn); }
  private setMixedPart(id: string, key: keyof MixedAnswer, value: string): void {
    this.answers.update((all) => ({ ...all, [id]: { ...(typeof all[id] === 'object' ? all[id] as MixedAnswer : { modal: '', function: '' }), [key]: value } }));
    this.checked.update((all) => { const next = { ...all }; delete next[id]; return next; });
  }
  protected currentAnswered(question: ExerciseQuestion): boolean {
    if (this.exercise()?.type !== 'mixed') return Boolean(this.answerText(question.id).trim());
    return Boolean(this.modalAnswer(question.id).trim() && this.functionAnswer(question.id).trim());
  }
  protected answeredCount(): number { return this.exercise()?.questions.filter((question) => Boolean(this.answerText(question.id).trim())).length ?? 0; }
  protected allAnswered(): boolean {
    const exercise = this.exercise();
    return Boolean(exercise?.questions.every((question) => this.currentAnswered(question)));
  }
  protected activeQuestionId(): string { return this.exercise()?.questions[this.activeParagraphGap()]?.id ?? ''; }

  protected checkCurrent(question: ExerciseQuestion): void {
    const response: Record<string, ExerciseAnswer> = { [question.id]: this.answers()[question.id] };
    this.gradeError.set(''); this.submitting.set(true);
    this.http.post<{ feedback: QuestionFeedback[] }>(`/api/grammar/exercises/${this.exercise()?.id}/grade`, { answers: response, hideWordBank: this.hideWordBank(), finalize: false }).subscribe({
      next: (grade) => { const feedback = grade.feedback?.[0]; if (feedback) this.checked.update((all) => ({ ...all, [feedback.id]: feedback })); this.submitting.set(false); },
      error: () => { this.gradeError.set('We couldn’t check that answer. Please try again.'); this.submitting.set(false); },
    });
  }

  protected submitExercise(): void {
    const exercise = this.exercise();
    if (!exercise || !this.allAnswered()) return;
    this.gradeError.set(''); this.submitting.set(true);
    this.http.post<ExerciseResult>(`/api/grammar/exercises/${exercise.id}/grade`, { answers: this.answers(), hideWordBank: this.hideWordBank(), finalize: true }).subscribe({
      next: (result) => { this.result.set(result); this.submitting.set(false); this.saveProgress(result); },
      error: () => { this.gradeError.set('We couldn’t submit your answers. Please try again.'); this.submitting.set(false); },
    });
  }
  private saveProgress(result: ExerciseResult): void {
    this.progressSaved.set(null); this.progressError.set('');
    void this.loginGate.requestSave({ unitNumber: 2, skill: 'GRAMMAR', score: result.progressScore, maxScore: result.progressMaxScore }, { allowSkip: true })
      .then((choice) => this.progressSaved.set(choice === 'cancelled' ? false : choice))
      .catch(() => { this.progressSaved.set(false); this.progressError.set('Your result is ready, but we could not save your progress. Please try again.'); });
  }

  protected sentenceParts(question: ExerciseQuestion): { text: string; modal: boolean }[] {
    const sentence = question.sentence ?? '';
    const modal = question.modal ?? '';
    const index = sentence.toLowerCase().indexOf(modal.toLowerCase());
    if (index < 0 || !modal) return [{ text: sentence, modal: false }];
    return [{ text: sentence.slice(0, index), modal: false }, { text: sentence.slice(index, index + modal.length), modal: true }, { text: sentence.slice(index + modal.length), modal: false }];
  }
  protected moveQuestion(direction: number): void {
    const count = this.exercise()?.questions.length ?? 0;
    this.currentIndex.update((index) => Math.max(0, Math.min(count - 1, index + direction)));
  }
  protected moveParagraphGap(direction: number): void { this.focusGap(this.activeParagraphGap() + direction); }
  protected onParagraphKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const input = event.target as HTMLInputElement;
    const atBoundary = event.key === 'ArrowRight' ? input.selectionStart === input.value.length : input.selectionStart === 0;
    if (!atBoundary) return;
    event.preventDefault();
    this.focusGap(index + (event.key === 'ArrowRight' ? 1 : -1));
  }
  private focusGap(index: number): void {
    const max = (this.exercise()?.questions.length ?? 1) - 1;
    const next = Math.max(0, Math.min(max, index));
    this.activeParagraphGap.set(next);
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`[data-gap-index="${next}"]`)?.focus());
  }
  protected feedbackFor(id: string): QuestionFeedback | null { return this.result()?.feedback.find((item) => item.id === id) ?? this.checked()[id] ?? null; }
  protected answerLabel(item: QuestionFeedback): string {
    if (item.canonicalAnswer && item.canonicalFunction) return `${item.canonicalAnswer} · ${item.canonicalFunction}`;
    if (item.canonicalAnswer) return item.canonicalAnswer;
    if (item.canonicalFunction) return item.canonicalFunction;
    return item.function ?? 'Review the explanation';
  }
  protected submittedLabel(id: string): string {
    const answer = this.answers()[id];
    return typeof answer === 'object' ? `${answer.modal} · ${answer.function}` : answer ?? '';
  }
  protected mistakes(result: ExerciseResult): QuestionFeedback[] { return result.feedback.filter((item) => !item.correct); }
  protected reviewFunction(item: QuestionFeedback): string {
    const value = item.function ?? item.canonicalFunction;
    return value ? this.functionForReview(value) : '';
  }
  protected reviewFragment(item: QuestionFeedback): string { return `function-${this.functionSlug(item.function ?? item.canonicalFunction ?? '')}`; }
  private functionForReview(value: string): string {
    const map: Record<string, string> = { ability: 'Ability / Inability', disability: 'Ability / Inability', 'probability/possibility': 'Probability / Possibility', 'certainty/deduction': 'Certainty / Deduction', obligation: 'Obligation / Necessity', 'no obligation': 'Obligation / Necessity', prohibition: 'Prohibition', permission: 'Permission', advice: 'Advice / Recommendation', 'past regret': 'Regret / Criticism of the Past', request: 'Requests / Offers / Invitations', habit: 'Past Habits' };
    return map[value.toLowerCase()] ?? value;
  }
  private functionSlug(value: string): string { return this.functionForReview(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  protected retry(): void {
    this.answers.set({}); this.checked.set({}); this.currentIndex.set(0); this.activeParagraphGap.set(0); this.hideWordBank.set(false); this.result.set(null); this.progressSaved.set(null); this.gradeError.set('');
  }
}
