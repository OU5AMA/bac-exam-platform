import { Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReadingExam, ReadingQuestion, ReadingAnswers, ReadingSection, AssessmentResult, QuestionResult } from './reading.models';
import { readingExamBySlug } from './reading.data';
import { formatCountdown, secondsRemaining } from './reading-timer';
import { StreakService } from '../auth/streak.service';

interface SavedAttempt { answers: ReadingAnswers; submitted: boolean; result?: AssessmentResult | null; timerDeadline?: number | null; timerDurationMinutes?: number; }
interface FlatQuestion { section: ReadingSection; question: ReadingQuestion; }
const YES_NO = [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }];

@Component({
  selector: 'app-reading-exam', standalone: true, imports: [FormsModule, RouterLink],
  styles: [`.reading-passage { line-height: 1.85; } .reading-mode { background: #fffcf4; } dialog::backdrop { background: rgb(11 35 35 / 48%); }`],
  template: `
    @if (exam; as task) {
      <main class="min-h-screen bg-[#F7F5F0] px-4 py-5 text-[#344C4B] sm:px-6 sm:py-8 lg:px-10">
        <div class="mx-auto max-w-[1440px]">
          <a routerLink="/2-bac/reading" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Reading Tasks</a>
          <header class="mt-4 rounded-2xl border border-[#E0E7E3] bg-white p-5 shadow-sm sm:p-7">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold text-[#075B5B]">{{ task.versionLabel }}</span>
                  <span class="text-xs font-semibold text-[#667575]">{{ task.level }} · {{ task.unit }}</span>
                </div>
                <h1 class="font-display mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B] sm:text-3xl">{{ task.title }}</h1>
                <p class="mt-2 text-sm leading-6">{{ task.description }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <div class="rounded-lg bg-[#F7F8F6] px-4 py-2 text-sm"><span class="font-bold text-[#0B3B3B]">10 marks</span><span class="mx-2 text-[#9AA5A2]" aria-hidden="true">·</span><span>{{ task.duration }}</span></div>
                <button type="button" (click)="openSubmitDialog()" [disabled]="submitted() || scoring()" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#084F4F] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ scoring() ? 'Scoring…' : submitted() ? 'Exam Submitted' : 'Submit Exam' }}</button>
              </div>
            </div>
            @if (!submitted()) {
              <section aria-label="Optional countdown timer" class="mt-5 rounded-xl border border-[#E0E7E3] bg-[#F8FAF8] p-4 sm:px-5">
                @if (!timerStarted()) {
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <label for="countdown-duration" class="block text-sm font-bold text-[#173E3D]">Optional countdown</label>
                      <p class="mt-1 text-xs leading-5 text-[#64716F]">Untimed practice is the default. Starting a countdown will not auto-submit your exam.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <select id="countdown-duration" [ngModel]="selectedDurationMinutes()" (ngModelChange)="selectedDurationMinutes.set(+$event)" [ngModelOptions]="{standalone: true}" class="min-h-11 rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm font-semibold text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15">
                        @for (minutes of countdownOptions; track minutes) { <option [ngValue]="minutes">{{ minutes }} minutes</option> }
                      </select>
                      <button type="button" (click)="startCountdown()" class="min-h-11 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Start countdown</button>
                    </div>
                  </div>
                } @else {
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                      @if (!timerHidden()) {
                        <div class="rounded-lg border border-[#C8D8D1] bg-white px-4 py-2" [class.border-[#E8C47A]]="remainingSeconds() <= 300 && remainingSeconds() > 0" [class.bg-[#FFF8E8]]="remainingSeconds() <= 300 && remainingSeconds() > 0">
                          <p class="text-xs font-semibold text-[#526260]">Time remaining</p>
                          <time role="timer" [attr.aria-label]="'Time remaining ' + timerText()" class="font-display text-2xl font-extrabold tabular-nums text-[#0B3B3B]">{{ timerText() }}</time>
                        </div>
                      } @else { <p class="text-sm font-semibold text-[#526260]">Countdown is hidden and still running.</p> }
                      <button type="button" (click)="timerHidden.set(!timerHidden())" [attr.aria-pressed]="timerHidden()" class="min-h-10 rounded-md px-3 text-sm font-semibold text-[#0A6B6B] underline underline-offset-4 hover:bg-[#EDF5F1] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ timerHidden() ? 'Show timer' : 'Hide timer' }}</button>
                    </div>
                    @if (timerExpired()) { <p role="status" class="text-sm font-semibold leading-6 text-[#805300]">Time is up. Your exam is still open—finish your answers and submit when ready.</p> }
                  </div>
                }
              </section>
            }
            @if (restored() && !submitted()) { <p role="status" class="mt-4 rounded-lg border border-[#BFD9CF] bg-[#F0F8F4] p-3 text-sm text-[#174F43]">Your saved attempt has been restored on this device. Continue your attempt or discard it below.</p> }
            <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-semibold text-[#173E3D]" aria-live="polite">Question {{ activeIndex() + 1 }} of {{ flatQuestions().length }} <span class="mx-1 text-[#9AA5A2]" aria-hidden="true">·</span> {{ answeredCount() }} answered</p>
              <div class="flex items-center gap-3"><span class="text-xs text-[#667575]">{{ answeredCount() }} of {{ flatQuestions().length }} answered</span><div class="h-2 w-36 overflow-hidden rounded-full bg-[#E6EBE8]" role="progressbar" [attr.aria-valuenow]="answeredCount()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="flatQuestions().length" aria-label="Answered questions"><div class="h-full rounded-full bg-[#0A6B6B] transition-[width]" [style.width.%]="answeredPercent()"></div></div></div>
            </div>
          </header>

          @if (submitted() && result(); as score) {
            <section aria-labelledby="result-title" class="mt-6 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-8">
              <div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">Attempt complete</p><h2 id="result-title" class="font-display mt-2 text-3xl font-extrabold text-[#0B3B3B]">Your reading results</h2><p class="mt-2 max-w-2xl leading-6">Use the review to compare your responses with the expected answers. Short answers are checked against configured phrases, so uncertain responses are marked for teacher review.</p></div>
                <div class="rounded-2xl bg-[#F0F7F4] px-7 py-5 text-center"><p class="text-sm font-semibold text-[#47615C]">Your score</p><p class="font-display mt-1 text-4xl font-extrabold text-[#075B5B]">{{ score.score }}<span class="text-xl"> / {{ score.total }}</span></p><p class="mt-1 text-sm font-semibold text-[#47615C]">{{ percentage() }}%</p></div>
              </div>
              <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div class="rounded-lg border border-[#E2E8E4] p-3"><p class="text-xs text-[#667575]">Correct</p><p class="mt-1 text-xl font-bold text-[#176346]">{{ countStatus('correct') }}</p></div>
                <div class="rounded-lg border border-[#E2E8E4] p-3"><p class="text-xs text-[#667575]">Partial</p><p class="mt-1 text-xl font-bold text-[#8A5A00]">{{ countStatus('partial') }}</p></div>
                <div class="rounded-lg border border-[#E2E8E4] p-3"><p class="text-xs text-[#667575]">Incorrect</p><p class="mt-1 text-xl font-bold text-[#9B342B]">{{ countStatus('incorrect') }}</p></div>
                <div class="rounded-lg border border-[#E2E8E4] p-3"><p class="text-xs text-[#667575]">Unanswered</p><p class="mt-1 text-xl font-bold text-[#344C4B]">{{ countStatus('unanswered') }}</p></div>
                <div class="rounded-lg border border-[#E2E8E4] p-3"><p class="text-xs text-[#667575]">Teacher review</p><p class="mt-1 text-xl font-bold text-[#4C527E]">{{ countStatus('review') }}</p></div>
              </div>
              <div class="mt-6 flex flex-wrap gap-3">
                <button type="button" (click)="reviewOpen.set(!reviewOpen())" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] px-5 text-sm font-bold text-[#075B5B] hover:bg-[#F0F7F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ reviewOpen() ? 'Hide Answer Review' : 'Review Answers' }}</button>
                <button type="button" (click)="retry()" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try Again</button>
                <a routerLink="/2-bac/reading" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#D0DAD5] px-5 text-sm font-bold text-[#173E3D] hover:bg-[#F7F8F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Back to Reading Tasks</a>
              </div>
              @if (reviewOpen()) {
                <div class="mt-7 space-y-4" aria-label="Question-by-question review">
                  @for (entry of flatQuestions(); track entry.question.id; let i = $index) {
                    @let review = resultFor(entry.question.id);
                    <article class="rounded-xl border border-[#E1E7E3] p-4 sm:p-5">
                      <div class="flex flex-wrap items-start justify-between gap-3"><h3 class="font-semibold leading-6 text-[#173E3D]">{{ i + 1 }}. {{ entry.question.prompt }}</h3><span class="rounded-full px-3 py-1 text-xs font-bold" [class.bg-[#E8F3EC]]="review?.status === 'correct'" [class.text-[#176346]]="review?.status === 'correct'" [class.bg-[#FFF4DC]]="review?.status === 'partial'" [class.text-[#805300]]="review?.status === 'partial'" [class.bg-[#FCECEA]]="review?.status === 'incorrect'" [class.text-[#9B342B]]="review?.status === 'incorrect'" [class.bg-[#EEF0F8]]="review?.status === 'review'" [class.text-[#4C527E]]="review?.status === 'review'" [class.bg-[#F1F3F2]]="review?.status === 'unanswered'">{{ statusLabel(review?.status) }} · {{ review?.earned }} / {{ review?.possible }} marks</span></div>
                      <p class="mt-3 text-sm"><span class="font-semibold">Your answer:</span> {{ studentAnswer(entry.question) || 'No answer provided.' }}</p>
                      <p class="mt-2 text-sm"><span class="font-semibold">Expected answer:</span> {{ review?.expected }}</p>
                      <p class="mt-2 text-sm text-[#5B6B6B]">{{ review?.feedback }}</p>
                    </article>
                  }
                </div>
              }
            </section>
          } @else {
            <div class="mt-6 grid items-start gap-5 lg:grid-cols-2">
              <section class="overflow-hidden rounded-2xl border border-[#DDE6E1] bg-white shadow-sm" aria-labelledby="passage-heading">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EBE8] px-4 py-4 sm:px-6">
                  <div><p class="text-xs font-bold uppercase tracking-[0.14em] text-[#0A6B6B]">Reading passage</p><h2 id="passage-heading" class="font-display mt-1 text-xl font-bold text-[#0B3B3B]">{{ task.title }}</h2></div>
                  <div class="flex items-center gap-1" aria-label="Reading text size controls"><button type="button" (click)="changeFont(-0.1)" [disabled]="fontScale() <= 0.9" aria-label="Decrease reading text size" class="min-h-10 min-w-10 rounded-md border border-[#D6DFDB] font-bold text-[#173E3D] hover:bg-[#F4F7F5] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">A−</button><button type="button" (click)="changeFont(0.1)" [disabled]="fontScale() >= 1.5" aria-label="Increase reading text size" class="min-h-10 min-w-10 rounded-md border border-[#D6DFDB] font-bold text-[#173E3D] hover:bg-[#F4F7F5] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">A+</button></div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF1EF] bg-[#FAFBFA] px-4 py-3 sm:px-6">
                  <button type="button" (click)="passageOpen.set(!passageOpen())" [attr.aria-expanded]="passageOpen()" class="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0A6B6B] hover:bg-[#EDF5F1] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ passageOpen() ? 'Hide passage' : 'Show passage' }} <span aria-hidden="true">{{ passageOpen() ? '⌃' : '⌄' }}</span></button>
                  <button type="button" (click)="readingMode.set(!readingMode())" [attr.aria-pressed]="readingMode()" class="min-h-10 rounded-md px-2 text-sm font-semibold text-[#526260] hover:bg-[#EDF5F1] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ readingMode() ? 'Exit reading focus' : 'Reading focus' }}</button>
                </div>
                @if (passageOpen()) {
                  <div class="reading-passage max-h-[55vh] overflow-y-auto p-5 sm:p-7 lg:max-h-[calc(100vh-360px)]" [class.reading-mode]="readingMode()" [style.font-size.rem]="fontScale()">
                    @for (paragraph of task.passage; track $index) { <p class="mb-5 last:mb-0">{{ paragraph }}</p> }
                  </div>
                }
              </section>

              <section class="overflow-hidden rounded-2xl border border-[#DDE6E1] bg-white shadow-sm" aria-labelledby="questions-heading">
                <div class="border-b border-[#E6EBE8] px-4 py-4 sm:px-6"><div class="flex items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-[#0A6B6B]">Questions · 10 marks total</p><h2 id="questions-heading" class="font-display mt-1 text-xl font-bold text-[#0B3B3B]">Your answers</h2></div>@if (task.version === 'sen') { <span class="rounded-full bg-[#F1ECF7] px-3 py-1 text-xs font-bold text-[#584075]">Take your time</span> }</div></div>
                <div class="max-h-[60vh] overflow-y-auto p-4 sm:p-6 lg:max-h-[calc(100vh-300px)]">
                  <nav aria-label="Question navigator" class="mb-5 rounded-xl bg-[#F7F8F6] p-3"><p class="mb-2 text-xs font-bold uppercase tracking-wide text-[#64716F]">Jump to question</p><div class="flex flex-wrap gap-2">@for (entry of flatQuestions(); track entry.question.id; let i = $index) { <button type="button" (click)="activeIndex.set(i)" [attr.aria-label]="'Question ' + (i + 1) + (isAnswered(entry.question) ? ', answered' : ', unanswered')" [attr.aria-current]="activeIndex() === i ? 'step' : null" class="relative min-h-10 min-w-10 rounded-lg border px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]" [class.border-[#0A6B6B]]="activeIndex() === i" [class.bg-[#0A6B6B]]="activeIndex() === i" [class.text-white]="activeIndex() === i" [class.border-[#BFD9CF]]="activeIndex() !== i && isAnswered(entry.question)" [class.bg-[#E8F3EC]]="activeIndex() !== i && isAnswered(entry.question)" [class.text-[#176346]]="activeIndex() !== i && isAnswered(entry.question)" [class.border-[#D6DFDB]]="activeIndex() !== i && !isAnswered(entry.question)">{{ i + 1 }}@if (marked()[entry.question.id]) {<span class="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F5A623]" aria-label="Marked for review"></span>}</button> }</div></nav>
                  @if (current(); as item) {
                    <article class="min-h-64" aria-live="polite">
                      <p class="text-xs font-bold uppercase tracking-[0.13em] text-[#0A6B6B]">{{ item.section.title }}</p><p class="mt-1 text-sm text-[#667575]">{{ item.section.instructions }}</p>
                      <div class="mt-5 rounded-xl border border-[#E2E8E4] p-4 sm:p-5">
                        <div class="flex items-start justify-between gap-3"><h3 class="text-base font-bold leading-7 text-[#173E3D] sm:text-lg">{{ activeIndex() + 1 }}. {{ item.question.prompt }}</h3><span class="shrink-0 rounded-full bg-[#F1F4F2] px-3 py-1 text-xs font-bold text-[#425653]">{{ marksLabel(item.question.marks) }}</span></div>
                        @switch (item.question.type) {
                          @case ('short') { <label class="mt-5 block text-sm font-semibold" [for]="item.question.id">Your answer</label><textarea [id]="item.question.id" [ngModel]="answers()[item.question.id] || ''" (ngModelChange)="setAnswer(item.question.id, $event)" [disabled]="submitted()" [rows]="task.version === 'sen' ? 3 : 2" [placeholder]="task.version === 'sen' ? 'Type a short answer here' : 'Write your answer here'" class="mt-2 block w-full rounded-lg border border-[#C9D1CF] bg-white p-3 text-base leading-6 text-[#173E3D] placeholder:text-[#81908C] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15 disabled:bg-[#F4F6F4]"></textarea> }
                          @case ('true-false') { <fieldset class="mt-5"><legend class="text-sm font-semibold">Choose one answer</legend><div class="mt-2 flex flex-wrap gap-3">@for (option of yesNo; track option.value) { <label class="flex min-h-12 min-w-28 cursor-pointer items-center gap-3 rounded-lg border border-[#D6DFDB] px-4 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]"><input type="radio" [name]="item.question.id" [value]="option.value" [checked]="answers()[item.question.id] === option.value" (change)="setAnswer(item.question.id, option.value)" [disabled]="submitted()" class="h-4 w-4 accent-[#0A6B6B]"> <span class="text-sm font-semibold">{{ option.label }}</span></label> }</div></fieldset> }
                          @case ('true-false-justify') { <fieldset class="mt-5"><legend class="text-sm font-semibold">Choose True or False</legend><div class="mt-2 flex gap-3">@for (option of yesNo; track option.value) { <label class="flex min-h-11 min-w-24 cursor-pointer items-center gap-2 rounded-lg border border-[#D6DFDB] px-4 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]"><input type="radio" [name]="item.question.id + '-choice'" [value]="option.value" [checked]="answers()[item.question.id + '-choice'] === option.value" (change)="setAnswer(item.question.id + '-choice', option.value)" [disabled]="submitted()" class="h-4 w-4 accent-[#0A6B6B]"><span class="text-sm font-semibold">{{ option.label }}</span></label> }</div></fieldset><label class="mt-4 block text-sm font-semibold" [for]="item.question.id + '-why'">Justify your choice from the text</label><textarea [id]="item.question.id + '-why'" [ngModel]="answers()[item.question.id + '-why'] || ''" (ngModelChange)="setAnswer(item.question.id + '-why', $event)" [disabled]="submitted()" rows="2" class="mt-2 block w-full rounded-lg border border-[#C9D1CF] p-3 text-base leading-6 focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15 disabled:bg-[#F4F6F4]"></textarea> }
                          @case ('choice') { <fieldset class="mt-5"><legend class="text-sm font-semibold">Choose one answer</legend><div class="mt-2 space-y-2">@for (option of item.question.options; track option.value) { <label class="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#D6DFDB] px-4 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]"><input type="radio" [name]="item.question.id" [value]="option.value" [checked]="answers()[item.question.id] === option.value" (change)="setAnswer(item.question.id, option.value)" [disabled]="submitted()" class="h-4 w-4 accent-[#0A6B6B]"><span class="text-sm leading-6">{{ option.label }}</span></label> }</div></fieldset> }
                          @case ('matching') { <fieldset class="mt-5"><legend class="text-sm font-semibold">Choose the matching meaning</legend><div class="mt-2 space-y-2">@for (option of item.question.options; track option.value) { <label class="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#D6DFDB] px-4 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]"><input type="radio" [name]="item.question.id" [value]="option.value" [checked]="answers()[item.question.id] === option.value" (change)="setAnswer(item.question.id, option.value)" [disabled]="submitted()" class="h-4 w-4 accent-[#0A6B6B]"><span class="text-sm leading-6">{{ option.label }}</span></label> }</div></fieldset> }
                        }
                        <button type="button" (click)="toggleMarked(item.question.id)" [attr.aria-pressed]="!!marked()[item.question.id]" class="mt-5 min-h-10 rounded-md px-2 text-sm font-semibold text-[#72510D] underline decoration-dotted underline-offset-4 hover:bg-[#FFF8E8] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ marked()[item.question.id] ? 'Remove review mark' : 'Mark for review' }}</button>
                      </div>
                      <div class="mt-5 flex items-center justify-between gap-3"><button type="button" (click)="activeIndex.set(math.max(0, activeIndex() - 1))" [disabled]="activeIndex() === 0" class="min-h-11 rounded-lg border border-[#CCD8D2] px-4 text-sm font-bold text-[#173E3D] hover:bg-[#F5F8F6] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">← Previous</button><button type="button" (click)="activeIndex.set(math.min(flatQuestions().length - 1, activeIndex() + 1))" [disabled]="activeIndex() === flatQuestions().length - 1" class="min-h-11 rounded-lg bg-[#0A6B6B] px-4 text-sm font-bold text-white hover:bg-[#084F4F] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Next question →</button></div>
                    </article>
                  }
                </div>
              </section>
            </div>
            @if ((restored() || answeredCount() > 0) && !submitted()) { <div class="mt-5 text-right"><button type="button" (click)="openDiscardDialog()" class="min-h-10 rounded-md px-3 text-sm font-semibold text-[#9B342B] underline underline-offset-4 hover:bg-[#FCECEA] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Discard saved attempt</button></div> }
          }
          <footer class="mt-6 text-center text-xs leading-5 text-[#657471]">Untimed practice · Answers are saved locally on this device. Client-side answer keys are not secure from a technically curious user.</footer>
        </div>

        <dialog #confirmDialog aria-labelledby="confirm-title" class="w-[min(92vw,30rem)] rounded-2xl border-0 p-0 shadow-2xl backdrop:bg-black/50">
          <div class="p-6 sm:p-7">
            @if (dialogMode() === 'submit') {
              <h2 id="confirm-title" class="font-display text-xl font-extrabold text-[#0B3B3B]">Submit your exam?</h2>
              <p class="mt-3 leading-6">You have <strong>{{ unansweredCount() }} unanswered {{ unansweredCount() === 1 ? 'question' : 'questions' }}</strong>. After submission, this attempt is locked and your result will be calculated.</p>
              <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" (click)="closeDialog()" class="min-h-11 rounded-lg border border-[#CCD8D2] px-4 text-sm font-bold text-[#173E3D]">Keep working</button><button type="button" (click)="submitConfirmed()" class="min-h-11 rounded-lg bg-[#0A6B6B] px-4 text-sm font-bold text-white">Submit exam</button></div>
            } @else {
              <h2 id="confirm-title" class="font-display text-xl font-extrabold text-[#0B3B3B]">Discard this saved attempt?</h2>
              <p class="mt-3 leading-6">Your saved answers will be removed from this device. You can start a new attempt at any time.</p>
              <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" (click)="closeDialog()" class="min-h-11 rounded-lg border border-[#CCD8D2] px-4 text-sm font-bold text-[#173E3D]">Keep attempt</button><button type="button" (click)="discardAttempt()" class="min-h-11 rounded-lg bg-[#9B342B] px-4 text-sm font-bold text-white">Discard attempt</button></div>
            }
          </div>
        </dialog>
      </main>
    } @else {
      <main class="min-h-screen bg-[#F7F5F0] px-5 py-10"><section class="mx-auto max-w-2xl rounded-2xl border border-[#E5E7E5] bg-white p-7" role="alert"><h1 class="font-display text-2xl font-extrabold text-[#0B3B3B]">Reading task not found</h1><p class="mt-2 leading-6">This exam link may have changed. Browse the available reading tasks to continue.</p><a routerLink="/2-bac/reading" class="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Browse Reading Tasks</a></section></main>
    }
  `,
})
export class ReadingExamComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly streak = inject(StreakService);
  @ViewChild('confirmDialog') private confirmDialog?: ElementRef<HTMLDialogElement>;
  protected readonly exam: ReadingExam | undefined = readingExamBySlug(this.route.snapshot.paramMap.get('slug'));
  protected readonly answers = signal<ReadingAnswers>({});
  protected readonly activeIndex = signal(0);
  protected readonly submitted = signal(false);
  protected readonly scoring = signal(false);
  protected readonly restored = signal(false);
  protected readonly result = signal<AssessmentResult | null>(null);
  protected readonly reviewOpen = signal(false);
  protected readonly passageOpen = signal(true);
  protected readonly readingMode = signal(false);
  protected readonly marked = signal<Record<string, boolean>>({});
  protected readonly dialogMode = signal<'submit' | 'discard'>('submit');
  protected readonly fontScale = signal(this.exam?.version === 'sen' ? 1.125 : 1);
  protected readonly countdownOptions = this.exam?.version === 'sen' ? [25, 30, 40] : [25, 30];
  protected readonly selectedDurationMinutes = signal(30);
  protected readonly timerStarted = signal(false);
  protected readonly timerHidden = signal(false);
  protected readonly remainingSeconds = signal(0);
  protected readonly timerExpired = computed(() => this.timerStarted() && this.remainingSeconds() === 0);
  private timerDeadline: number | null = null;
  private timerInterval: ReturnType<typeof setInterval> | undefined;
  protected readonly yesNo = YES_NO;
  protected readonly math = Math;
  private readonly storageKey = this.exam ? `reading-attempt:${this.exam.slug}` : '';
  protected readonly flatQuestions = computed<FlatQuestion[]>(() => this.exam?.sections.flatMap((section) => section.questions.map((question) => ({ section, question }))) ?? []);
  protected readonly current = computed(() => this.flatQuestions()[this.activeIndex()] ?? null);
  protected readonly answeredCount = computed(() => this.flatQuestions().filter(({ question }) => this.isAnswered(question)).length);
  protected readonly unansweredCount = computed(() => this.flatQuestions().length - this.answeredCount());
  protected readonly answeredPercent = computed(() => this.flatQuestions().length ? this.answeredCount() / this.flatQuestions().length * 100 : 0);

  constructor() { this.restoreAttempt(); this.resumeCountdown(); }

  ngOnDestroy(): void { this.stopTimerInterval(); }

  protected answer(id: string): string { return this.answers()[id] ?? ''; }
  protected setAnswer(id: string, value: string): void {
    if (this.submitted()) return;
    this.answers.update((current) => ({ ...current, [id]: value }));
    this.persist();
  }
  protected isAnswered(question: ReadingQuestion): boolean {
    if (question.type === 'true-false-justify') return Boolean(this.answer(`${question.id}-choice`) && this.answer(`${question.id}-why`).trim());
    return Boolean(this.answer(question.id).trim());
  }
  protected changeFont(delta: number): void { this.fontScale.update((size) => Math.min(1.5, Math.max(0.9, Number((size + delta).toFixed(2))))); }
  protected timerText(): string { return formatCountdown(this.remainingSeconds()); }
  protected startCountdown(): void {
    if (this.timerStarted() || this.submitted()) return;
    this.timerDeadline = Date.now() + this.selectedDurationMinutes() * 60_000;
    this.timerStarted.set(true);
    this.refreshCountdown();
    if (this.remainingSeconds() > 0) this.timerInterval = setInterval(() => this.refreshCountdown(), 1_000);
    this.persist();
  }
  protected marksLabel(marks: number): string { return `${marks} ${marks === 1 ? 'mark' : 'marks'}`; }
  protected toggleMarked(id: string): void { this.marked.update((current) => ({ ...current, [id]: !current[id] })); }
  protected openSubmitDialog(): void { if (!this.submitted()) { this.dialogMode.set('submit'); this.confirmDialog?.nativeElement.showModal(); } }
  protected openDiscardDialog(): void { this.dialogMode.set('discard'); this.confirmDialog?.nativeElement.showModal(); }
  protected closeDialog(): void { this.confirmDialog?.nativeElement.close(); }
  protected async submitConfirmed(): Promise<void> {
    if (this.submitted() || this.scoring() || !this.exam) return;
    this.scoring.set(true);
    try {
      const { scoreReadingExam } = await import('./reading.assessment');
      const scored = scoreReadingExam(this.exam, this.answers());
      this.result.set(scored); this.submitted.set(true); this.stopTimerInterval(); this.persist(); this.closeDialog(); this.activeIndex.set(0);
      if (scored.total > 0) this.streak.recordProgress(1, 'READING', scored.score, scored.total);
    } finally { this.scoring.set(false); }
  }
  protected resultFor(id: string): QuestionResult | undefined { return this.result()?.questions.find((item) => item.questionId === id); }
  protected studentAnswer(question: ReadingQuestion): string {
    if (question.type === 'true-false-justify') return `${this.answer(`${question.id}-choice`) || 'No choice'}${this.answer(`${question.id}-why`) ? ` — ${this.answer(`${question.id}-why`)}` : ''}`;
    const answer = this.answer(question.id);
    if ((question.type === 'choice' || question.type === 'matching') && answer) return question.options?.find((option) => option.value === answer)?.label ?? answer;
    return answer;
  }
  protected countStatus(status: QuestionResult['status']): number { return this.result()?.questions.filter((item) => item.status === status).length ?? 0; }
  protected statusLabel(status?: QuestionResult['status']): string {
    return ({ correct: 'Correct', partial: 'Partially correct', incorrect: 'Incorrect', unanswered: 'Unanswered', review: 'Needs teacher review' } as Record<string, string>)[status ?? ''] ?? 'Not scored';
  }
  protected percentage(): number { const score = this.result(); return score?.total ? Math.round(score.score / score.total * 100) : 0; }
  protected retry(): void {
    if (this.storageKey) localStorage.removeItem(this.storageKey);
    this.stopTimerInterval(); this.timerDeadline = null; this.timerStarted.set(false); this.timerHidden.set(false); this.remainingSeconds.set(0); this.selectedDurationMinutes.set(30);
    this.answers.set({}); this.result.set(null); this.submitted.set(false); this.restored.set(false); this.reviewOpen.set(false); this.activeIndex.set(0); this.marked.set({});
  }
  protected discardAttempt(): void {
    if (this.storageKey) localStorage.removeItem(this.storageKey);
    this.closeDialog(); void this.router.navigateByUrl('/2-bac/reading');
  }
  private restoreAttempt(): void {
    if (!this.storageKey || typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.storageKey); if (!raw) return;
      const saved = JSON.parse(raw) as SavedAttempt;
      this.answers.set(saved.answers ?? {}); this.submitted.set(Boolean(saved.submitted)); this.result.set(saved.result ?? null); this.timerDeadline = saved.timerDeadline ?? null;
      if (this.timerDeadline) { this.timerStarted.set(true); this.selectedDurationMinutes.set(saved.timerDurationMinutes ?? 30); }
      this.restored.set(true);
    } catch { localStorage.removeItem(this.storageKey); }
  }
  private resumeCountdown(): void {
    if (!this.timerDeadline || !this.timerStarted() || this.submitted()) return;
    this.refreshCountdown();
    if (this.remainingSeconds() > 0) this.timerInterval = setInterval(() => this.refreshCountdown(), 1_000);
  }
  private refreshCountdown(): void {
    if (!this.timerDeadline) return;
    this.remainingSeconds.set(secondsRemaining(this.timerDeadline, Date.now()));
    if (this.remainingSeconds() === 0) this.stopTimerInterval();
  }
  private stopTimerInterval(): void {
    if (this.timerInterval !== undefined) clearInterval(this.timerInterval);
    this.timerInterval = undefined;
  }
  private persist(): void {
    if (!this.storageKey || typeof localStorage === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify({ answers: this.answers(), submitted: this.submitted(), result: this.result(), timerDeadline: this.timerDeadline, timerDurationMinutes: this.selectedDurationMinutes() } satisfies SavedAttempt));
  }
}
