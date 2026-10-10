import { Component, computed, inject, input, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, distinctUntilChanged, EMPTY, switchMap, tap } from 'rxjs';

import { CrosswordGridComponent } from './crossword-grid.component';
import { CrosswordCluesComponent } from './crossword-clues.component';
import { CrosswordInputPanelComponent } from './crossword-input-panel.component';
import { CrosswordService } from './crossword.service';
import { Crossword, Difficulty, PlacedWord } from './crossword.model';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'difficult', 'master'];

@Component({
  selector: 'app-crossword-page',
  standalone: true,
  imports: [CrosswordCluesComponent, CrosswordGridComponent, CrosswordInputPanelComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-8 text-[#4B5B5B] sm:px-8 sm:py-12">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to home
        </a>

        @if (crossword(); as puzzle) {
          <header class="mt-8">
            <h1 class="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">{{ puzzle.title }}</h1>
            @if (puzzle.subtitle) {
              <p class="mt-3 text-base text-[#4B5B5B]">{{ puzzle.subtitle }}</p>
            }
          </header>

          <div class="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
            <div class="min-w-0">
              @if (solved()) {
                <div role="status" class="mb-4 flex items-center gap-3 rounded-lg border border-[#0A6B6B] bg-[#DCF2E8] p-4 text-sm font-semibold text-[#084F4F]">
                  <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                  <span>Puzzle solved! Well done.</span>
                </div>
              }
              <app-crossword-grid
                [crossword]="puzzle"
                [placedWords]="placedWords()"
                [selectedWord]="selectedWord()"
                [filledLetters]="filledLetters()"
                [revealedCells]="revealedCells()"
                [checkedCells]="checkedCells()"
                (wordSelected)="selectWord($event)"
              >
                <app-crossword-input-panel
                  [selectedWord]="selectedWord()"
                  [lengthMismatch]="lengthMismatch()"
                  (confirmed)="confirmAnswer($event)"
                  (clueRequested)="requestClue($event)"
                />
                @if (!solved()) {
                  <div class="border-t border-[#E5E7E5] p-4 sm:p-6">
                    <button type="button" class="auth-btn w-full sm:max-w-[220px]" (click)="checkAnswers()">Check Answers</button>
                    @if (checkMessage()) {
                      <p class="mt-2 text-sm text-[#4B5B5B]" role="status">{{ checkMessage() }}</p>
                    }
                  </div>
                }
              </app-crossword-grid>
            </div>
            <app-crossword-clues
              class="block min-w-0"
              [crossword]="puzzle"
              [placedWords]="placedWords()"
              [selectedWord]="selectedWord()"
              (clueSelected)="selectWord($event)"
            />
          </div>
        } @else if (loading()) {
          <p class="mt-8" role="status">Loading crossword…</p>
        } @else if (error()) {
          <section class="mt-8 rounded-lg border border-[#E5E7E5] bg-white p-6" role="alert">
            <h1 class="font-display text-xl font-bold text-[#0B3B3B]">Crossword unavailable</h1>
            <p class="mt-2 text-sm">{{ error() }}</p>
            <button type="button" class="mt-4 min-h-11 rounded-sm font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]" (click)="retry()">Try again</button>
          </section>
        }
      </div>
    </main>
  `,
})
export class CrosswordPageComponent {
  readonly level = input<Difficulty | string>('easy');
  readonly crossword = signal<Crossword | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedWord = signal<PlacedWord | null>(null);
  readonly filledLetters = signal<Map<string, string>>(new Map());
  readonly revealedCells = signal<Set<string>>(new Set());
  readonly lengthMismatch = signal<string | null>(null);
  readonly checkedCells = signal<Map<string, 'correct' | 'wrong'>>(new Map());
  readonly checkMessage = signal<string | null>(null);
  readonly answersChecked = signal(false);
  readonly placedWords = computed(() => {
    const puzzle = this.crossword();
    if (!puzzle) return [];

    const starts = new Map<string, { row: number; col: number }>();
    for (const word of puzzle.words) starts.set(`${word.row},${word.col}`, { row: word.row, col: word.col });
    const numbers = new Map<string, number>();
    [...starts.entries()]
      .sort(([, first], [, second]) => first.row - second.row || first.col - second.col)
      .forEach(([key], index) => numbers.set(key, index + 1));

    return puzzle.words.map((word) => ({
      ...word,
      number: numbers.get(`${word.row},${word.col}`) ?? 0,
      length: word.answer.length,
      cells: Array.from({ length: word.answer.length }, (_, index) => ({
        row: word.row + (word.direction === 'down' ? index : 0),
        col: word.col + (word.direction === 'across' ? index : 0),
      })),
    }));
  });
  readonly solved = computed(() => {
    if (!this.answersChecked()) return false;
    const words = this.placedWords();
    const letters = this.filledLetters();
    return words.length > 0 && words.every((word) =>
      word.cells.every((cell, index) => letters.get(`${cell.row},${cell.col}`)?.toUpperCase() === word.answer[index].toUpperCase()),
    );
  });
  private readonly retryToken = signal(0);
  private readonly service = inject(CrosswordService);
  @ViewChild(CrosswordInputPanelComponent) private inputPanel?: CrosswordInputPanelComponent;

  constructor() {
    combineLatest([toObservable(this.level), toObservable(this.retryToken)])
      .pipe(
        distinctUntilChanged(([previousLevel, previousRetry], [level, retry]) => previousLevel === level && previousRetry === retry),
        switchMap(([level]) => {
          const difficulty = DIFFICULTIES.includes(level as Difficulty) ? (level as Difficulty) : 'easy';
          this.loading.set(true);
          this.error.set(null);
          this.crossword.set(null);
          return this.service.load(difficulty).pipe(
            tap((puzzle) => {
              this.crossword.set(puzzle);
              this.loading.set(false);
            }),
            catchError(() => {
              this.error.set('We couldn’t load this puzzle. Please try again in a moment.');
              this.loading.set(false);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  retry(): void {
    this.retryToken.update((token) => token + 1);
  }

  selectWord(word: PlacedWord): void {
    this.selectedWord.set(word);
    this.lengthMismatch.set(null);
    requestAnimationFrame(() => this.inputPanel?.focusInput());
  }

  confirmAnswer(event: { word: PlacedWord; answer: string }): void {
    this.checkedCells.set(new Map());
    this.checkMessage.set(null);
    this.answersChecked.set(false);
    const answer = event.answer.trim().toUpperCase();
    if (answer.length !== event.word.answer.length) {
      this.lengthMismatch.set(`That doesn't fit — the answer has ${event.word.answer.length} letters.`);
      return;
    }

    const letters = new Map(this.filledLetters());
    event.word.cells.forEach((cell, index) => letters.set(`${cell.row},${cell.col}`, answer[index]));
    this.filledLetters.set(letters);
    this.lengthMismatch.set(null);
  }

  requestClue(word: PlacedWord): void {
    this.checkedCells.set(new Map());
    this.checkMessage.set(null);
    this.answersChecked.set(false);
    const firstCell = word.cells[0];
    if (!firstCell) return;

    const key = `${firstCell.row},${firstCell.col}`;
    const letters = new Map(this.filledLetters());
    letters.set(key, word.answer[0]);
    this.filledLetters.set(letters);

    const revealed = new Set(this.revealedCells());
    revealed.add(key);
    this.revealedCells.set(revealed);
  }

  checkAnswers(): void {
    const letters = this.filledLetters();
    if (letters.size === 0) {
      this.checkMessage.set('Place at least one answer before checking.');
      return;
    }

    const expectedLetters = new Map<string, string[]>();
    for (const word of this.placedWords()) {
      word.cells.forEach((cell, index) => {
        const key = `${cell.row},${cell.col}`;
        const expected = expectedLetters.get(key) ?? [];
        expected.push(word.answer[index].toUpperCase());
        expectedLetters.set(key, expected);
      });
    }

    const checked = new Map<string, 'correct' | 'wrong'>();
    for (const [key, letter] of letters) {
      if (!letter) continue;
      const expected = expectedLetters.get(key);
      if (!expected) continue;
      checked.set(key, expected.every((correctLetter) => correctLetter === letter.toUpperCase()) ? 'correct' : 'wrong');
    }

    this.checkedCells.set(checked);
    this.checkMessage.set(null);
    this.answersChecked.set(true);
  }
}
