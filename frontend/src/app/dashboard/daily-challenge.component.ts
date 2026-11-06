import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DailyChallenge, DailyChallengeService } from './daily-challenge.service';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  template: `
    <article aria-labelledby="daily-challenge-title" class="relative mb-8 overflow-hidden rounded-2xl border border-[#F5C56D] bg-gradient-to-br from-[#FFF7E5] via-white to-[#E8F2F0] p-5 shadow-[0_8px_32px_rgba(245,166,35,0.15)] sm:p-7">
      <div class="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#F5A623]/15 blur-2xl" aria-hidden="true"></div>
      <div class="relative">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8A4B08]">Daily Challenge · {{ challenge()?.date ?? 'Today' }}</p>
            <h2 id="daily-challenge-title" class="font-display mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B] sm:text-3xl">
              Today's Challenge: {{ challenge()?.title ?? 'The CVC Spelling Rule' }}
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[#4B5B5B]">Beat the clock to earn a special badge! Three quick questions, five minutes.</p>
          </div>
          <span class="rounded-full border border-[#E9C596] bg-white/90 px-3 py-1.5 text-xs font-bold text-[#71420C]">⏱ 5 min</span>
        </div>

        @if (loading() && !challenge()) {
          <p class="mt-5 text-sm font-semibold text-[#4B5B5B]" role="status">Loading today's challenge…</p>
        } @else if (error()) {
          <div class="mt-5 flex flex-wrap items-center gap-3" role="alert">
            <p class="text-sm font-semibold text-[#7B261C]">{{ error() }}</p>
            <button type="button" (click)="load()" class="min-h-10 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button>
          </div>
        } @else if (challenge(); as daily) {
          @if (daily.completedAt) {
            <div class="mt-5 rounded-xl border border-[#B8D7D0] bg-white/90 p-4 sm:p-5" role="status" aria-live="polite">
              @if (daily.badgeAwarded) {
                <p class="font-bold text-[#075B5B]">🏅 Challenge complete! You beat the clock with a perfect score and earned the Daily Challenger badge.</p>
              } @else {
                <p class="font-bold text-[#173E3D]">Challenge complete: {{ daily.score }} / {{ daily.questions.length }}. Come back tomorrow for a new challenge.</p>
              }
            </div>
          } @else if (!daily.startedAt) {
            <p class="mt-3 text-sm leading-6 text-[#4B5B5B]">{{ daily.description }}</p>
            <button type="button" (click)="start()" [disabled]="loading()" class="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0A6B6B] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-wait disabled:opacity-60">
              {{ loading() ? 'Starting…' : 'Start today’s challenge' }}
            </button>
          } @else {
            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/90 px-4 py-3">
              <p class="text-sm font-semibold text-[#4B5B5B]">Answer all three questions before time runs out.</p>
              <p class="font-mono text-xl font-extrabold tabular-nums" [class.text-[#B42318]]="secondsLeft() <= 30" [class.text-[#075B5B]]="secondsLeft() > 30" role="timer" aria-live="off" aria-label="Time remaining {{ timerLabel() }}">{{ timerLabel() }}</p>
            </div>
            @if (secondsLeft() === 0) { <p class="mt-3 text-sm font-semibold text-[#8A4B08]" role="status">Time is up. Submit to see your result.</p> }
            <div class="mt-4 grid gap-3 sm:grid-cols-3">
              @for (question of daily.questions; track question.id; let index = $index) {
                <fieldset class="rounded-xl border border-[#E5E7E5] bg-white/90 p-4">
                  <legend class="text-sm font-bold leading-5 text-[#173E3D]">{{ index + 1 }}. {{ question.prompt }}</legend>
                  <div class="mt-3 space-y-2">
                    @for (option of question.options; track option) {
                      <label class="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#E5E7E5] px-3 text-sm text-[#344C4B] hover:bg-[#F7F5F0] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]">
                        <input type="radio" [name]="question.id" [value]="option" [checked]="answers()[question.id] === option" [disabled]="loading() || secondsLeft() === 0" (change)="setAnswer(question.id, option)" class="h-4 w-4 accent-[#0A6B6B]" />
                        <span>{{ option }}</span>
                      </label>
                    }
                  </div>
                </fieldset>
              }
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" (click)="submit()" [disabled]="loading() || (!allAnswered() && secondsLeft() > 0)" class="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-not-allowed disabled:opacity-50">
                {{ loading() ? 'Checking…' : 'Submit challenge' }}
              </button>
              @if (!allAnswered() && secondsLeft() > 0) { <p class="text-sm text-[#667575]" role="status">Choose one answer for each question.</p> }
            </div>
          }
        }
      </div>
    </article>
  `,
})
export class DailyChallengeComponent implements OnInit, OnDestroy {
  private readonly challengeApi = inject(DailyChallengeService);
  private readonly auth = inject(AuthService);
  protected readonly challenge = signal<DailyChallenge | null>(null);
  protected readonly answers = signal<Record<string, string>>({});
  protected readonly secondsLeft = signal(300);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly allAnswered = computed(() => {
    const daily = this.challenge();
    return Boolean(daily?.questions.length && daily.questions.every((question) => Boolean(this.answers()[question.id])));
  });
  protected readonly timerLabel = computed(() => `${Math.floor(this.secondsLeft() / 60).toString().padStart(2, '0')}:${(this.secondsLeft() % 60).toString().padStart(2, '0')}`);
  private timer?: ReturnType<typeof setInterval>;
  private rolloverTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void { this.load(); this.scheduleMidnightRefresh(); }
  ngOnDestroy(): void { this.stopTimer(); if (this.rolloverTimer) clearTimeout(this.rolloverTimer); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.challengeApi.loadToday().subscribe({
      next: (daily) => {
        this.setChallenge(daily);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Today’s challenge could not load. Check your connection and try again.');
      },
    });
  }

  protected start(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.challengeApi.start().subscribe({
      next: (daily) => {
        this.setChallenge(daily);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('The challenge could not start. Please try again.');
      },
    });
  }

  protected setAnswer(questionId: string, answer: string): void {
    this.answers.update((current) => ({ ...current, [questionId]: answer }));
    const daily = this.challenge();
    const userId = this.auth.currentUser()?.id;
    if (daily && userId) localStorage.setItem(this.answerStorageKey(userId, daily.date), JSON.stringify(this.answers()));
  }

  protected submit(): void {
    if ((!this.allAnswered() && this.secondsLeft() > 0) || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.challengeApi.submit(this.answers()).subscribe({
      next: (daily) => {
        this.stopTimer();
        this.setChallenge(daily);
        this.loading.set(false);
        const userId = this.auth.currentUser()?.id;
        if (userId) localStorage.removeItem(this.answerStorageKey(userId, daily.date));
        this.auth.me().subscribe({ error: () => undefined });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Your answers could not be checked. They are still here—please try again.');
      },
    });
  }

  private setChallenge(daily: DailyChallenge): void {
    this.challenge.set(daily);
    const userId = this.auth.currentUser()?.id;
    if (userId && !daily.completedAt) {
      try {
        const savedAnswers = localStorage.getItem(this.answerStorageKey(userId, daily.date));
        if (savedAnswers) this.answers.set(JSON.parse(savedAnswers) as Record<string, string>);
      } catch {
        localStorage.removeItem(this.answerStorageKey(userId, daily.date));
      }
    }
    if (daily.completedAt) {
      if (userId) localStorage.removeItem(this.answerStorageKey(userId, daily.date));
      this.stopTimer();
      this.secondsLeft.set(0);
    } else if (daily.startedAt) {
      const elapsed = Math.floor((Date.now() - Date.parse(daily.startedAt)) / 1000);
      this.secondsLeft.set(Math.max(0, daily.durationSeconds - elapsed));
      if (this.secondsLeft() > 0) {
        this.stopTimer();
        this.timer = setInterval(() => this.secondsLeft.update((value) => Math.max(0, value - 1)), 1000);
      }
    } else {
      this.secondsLeft.set(daily.durationSeconds);
      this.stopTimer();
    }
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private answerStorageKey(userId: number, date: string): string {
    return `daily-challenge:${userId}:${date}`;
  }

  private scheduleMidnightRefresh(): void {
    const now = new Date();
    const nextUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    this.rolloverTimer = setTimeout(() => {
      this.answers.set({});
      this.load();
      this.scheduleMidnightRefresh();
    }, Math.max(1000, nextUtcMidnight - Date.now()));
  }
}
