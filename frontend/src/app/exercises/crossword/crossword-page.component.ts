import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, distinctUntilChanged, EMPTY, switchMap, tap } from 'rxjs';

import { CrosswordGridComponent } from './crossword-grid.component';
import { CrosswordService } from './crossword.service';
import { Crossword, Difficulty } from './crossword.model';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'difficult', 'master'];

@Component({
  selector: 'app-crossword-page',
  standalone: true,
  imports: [CrosswordGridComponent, RouterLink],
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

          <app-crossword-grid [crossword]="puzzle" />
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
  private readonly retryToken = signal(0);
  private readonly service = inject(CrosswordService);

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
}
