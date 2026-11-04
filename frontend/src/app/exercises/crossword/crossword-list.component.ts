import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { CrosswordManifest, Difficulty } from './crossword.model';

const LEVELS: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'normal', label: 'Normal' },
  { key: 'hard', label: 'Hard' },
];

@Component({
  selector: 'app-crossword-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-8 text-[#4B5B5B] sm:px-8 sm:py-12">
      <div class="mx-auto max-w-3xl">
        <a routerLink="/2-bac/unit/1" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Unit 1
        </a>
        <header class="mt-6">
          <p class="text-sm font-semibold uppercase tracking-wide text-[#0A6B6B]">Vocabulary · Unit 1</p>
          <h1 class="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Crosswords</h1>
          @if (manifest(); as data) { <p class="mt-2 text-base">{{ data.unitTitle }}</p> }
        </header>

        @if (loading()) {
          <p class="mt-8 rounded-lg border border-[#E5E7E5] bg-white p-5" role="status">Loading crosswords…</p>
        } @else if (error()) {
          <section class="mt-8 rounded-lg border border-[#E5E7E5] bg-white p-6" role="alert">
            <h2 class="font-display text-xl font-bold text-[#0B3B3B]">Crosswords unavailable</h2>
            <p class="mt-2 text-sm">{{ error() }}</p>
            <button type="button" class="mt-4 min-h-11 font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]" (click)="retry()">Try again</button>
          </section>
        } @else {
          <div class="mt-8 space-y-4">
            @for (level of levels; track level.key) {
              <section class="overflow-hidden rounded-lg border border-[#E5E7E5] bg-white" [attr.aria-labelledby]="'heading-' + level.key">
                <h2 [id]="'heading-' + level.key" class="m-0">
                  <button type="button" class="flex min-h-14 w-full items-center justify-between gap-4 bg-[#FAFAF8] px-4 py-3 text-left text-base font-bold transition-colors hover:bg-[#F3F6F4] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0A6B6B] sm:px-5" [class.text-emerald-700]="level.key === 'easy'" [class.text-[#0A6B6B]]="level.key === 'normal'" [class.text-[#B45309]]="level.key === 'hard'" [attr.aria-expanded]="isOpen(level.key)" [attr.aria-controls]="'list-' + level.key" (click)="toggle(level.key)">
                    <span>{{ level.label }} · {{ grouped()[level.key].reduce(countWords, 0) }} words</span>
                    <svg class="h-5 w-5 shrink-0 text-[#647171] transition-transform duration-200" [class.rotate-90]="!isOpen(level.key)" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </h2>
                @if (isOpen(level.key)) {
                  <ul [id]="'list-' + level.key" class="divide-y divide-[#E5E7E5]">
                    @for (puzzle of grouped()[level.key]; track puzzle.id) {
                      <li>
                        <a [routerLink]="['/2-bac/exercices/unit-1/vocabulary/crossword']" [queryParams]="{ id: puzzle.id }" class="group flex min-h-16 items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-[#F1F8F6] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0A6B6B] sm:px-5">
                          <span class="min-w-0 font-semibold text-[#0B3B3B]">{{ puzzle.title }}</span>
                          <span class="flex shrink-0 items-center gap-3">
                            <span class="rounded-full bg-[#F1F4F2] px-3 py-1 text-xs font-medium text-[#536363]">{{ puzzle.wordCount }} words</span>
                            <svg class="h-4 w-4 text-[#778383] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0A6B6B]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                              <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </span>
                        </a>
                      </li>
                    } @empty {
                      <li class="px-4 py-4 text-sm text-[#536363] sm:px-5">No {{ level.label.toLowerCase() }} crosswords are available yet.</li>
                    }
                  </ul>
                }
              </section>
            }
          </div>
        }
      </div>
    </main>
  `,
})
export class CrosswordListComponent {
  readonly levels = LEVELS;
  protected readonly isEasyOpen = signal(true);
  protected readonly isNormalOpen = signal(true);
  protected readonly isHardOpen = signal(true);
  readonly manifest = signal<CrosswordManifest | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  private readonly http = inject(HttpClient);
  private readonly retryToken = signal(0);

  readonly grouped = computed(() => {
    const entries = this.manifest()?.crosswords ?? [];
    return {
      easy: entries.filter((entry) => entry.difficulty === 'easy'),
      normal: entries.filter((entry) => entry.difficulty === 'normal'),
      hard: entries.filter((entry) => entry.difficulty === 'hard'),
    };
  });

  constructor() {
    toObservable(this.retryToken).pipe(
      switchMap(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.get<CrosswordManifest>('/crosswords/unit-1/index.json').pipe(
          catchError(() => {
            this.error.set('We couldn’t load the crossword list. Please try again.');
            return of(null);
          }),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe((manifest) => {
      this.manifest.set(manifest);
      this.loading.set(false);
    });
  }

  readonly countWords = (total: number, puzzle: { wordCount: number }): number => total + puzzle.wordCount;

  isOpen(level: Difficulty): boolean {
    if (level === 'easy') return this.isEasyOpen();
    if (level === 'normal') return this.isNormalOpen();
    return this.isHardOpen();
  }

  toggle(level: Difficulty): void {
    if (level === 'easy') this.isEasyOpen.update((open) => !open);
    else if (level === 'normal') this.isNormalOpen.update((open) => !open);
    else this.isHardOpen.update((open) => !open);
  }

  retry(): void {
    this.retryToken.update((token) => token + 1);
  }
}
