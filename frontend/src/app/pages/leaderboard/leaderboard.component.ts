import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ClassApiService, ClassLeaderboardEntry } from '../../classes/class-api.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <a routerLink="/dashboard" class="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Back to dashboard</a>
      <header class="mt-6">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Learn together</p>
        <h1 class="font-display mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Class Leaderboard</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-[#4B5B5B]">See how classes are progressing. Every point earned by a class member adds to the team total.</p>
      </header>

      @if (loading()) {
        <div class="mt-8 rounded-2xl border border-[#E1E7E3] bg-white p-8 text-center text-sm text-[#4B5B5B]" role="status" aria-live="polite">Loading class standings…</div>
      } @else if (error()) {
        <section class="mt-8 rounded-2xl border border-[#F0C8C3] bg-white p-6" aria-labelledby="leaderboard-error-title">
          <h2 id="leaderboard-error-title" class="font-bold text-[#7A1810]">Standings are unavailable</h2>
          <p class="mt-2 text-sm text-[#4B5B5B]">{{ error() }}</p>
          <button type="button" (click)="load()" class="mt-4 min-h-11 rounded-lg bg-[#0A6B6B] px-4 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button>
        </section>
      } @else if (entries().length === 0) {
        <section class="mt-8 rounded-2xl border border-dashed border-[#C9D8D1] bg-white p-8 text-center">
          <span aria-hidden="true" class="text-4xl">🏫</span>
          <h2 class="font-display mt-3 text-xl font-extrabold text-[#0B3B3B]">The leaderboard is ready for its first class</h2>
          <p class="mt-2 text-sm text-[#4B5B5B]">Create a class or invite your classmates to get started.</p>
          <a routerLink="/dashboard" class="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Go to My Class</a>
        </section>
      } @else {
        @if (myClass(); as ownClass) {
          <section aria-label="Your class points" class="mt-8 flex flex-col gap-2 rounded-2xl border border-[#F1C35B] bg-gradient-to-r from-[#FFF7DD] to-[#FFE9B3] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p class="text-xs font-extrabold uppercase tracking-[0.16em] text-[#79530A]">Your class total</p><h2 class="font-display mt-1 break-words text-xl font-extrabold text-[#3E300E]">{{ ownClass.name }}</h2></div>
            <p class="text-3xl font-extrabold tabular-nums text-[#5B410A] sm:text-4xl">{{ ownClass.totalPoints }} <span class="text-base font-bold">Points</span></p>
          </section>
        }

        @if (topThree().length) {
          <section aria-label="Top three classes" class="mt-8 grid items-end gap-3 sm:grid-cols-3 sm:gap-4">
            @for (entry of topThree(); track entry.id) {
              <article [class]="podiumClass(entry)" [attr.aria-label]="'Rank ' + entry.rank + ': ' + entry.name + ', ' + entry.totalPoints + ' points'">
                <p class="text-3xl" aria-hidden="true">{{ medal(entry.rank) }}</p>
                <p class="mt-2 text-xs font-extrabold uppercase tracking-[0.16em]">Rank {{ entry.rank }}</p>
                @if (entry.currentClass) { <span class="mt-2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#075B5B]">Your class</span> }
                <h2 class="mt-2 break-words text-lg font-extrabold leading-tight">{{ entry.name }}</h2>
                <p class="mt-3 text-2xl font-extrabold tabular-nums">{{ entry.totalPoints }}</p>
                <p class="text-xs font-semibold opacity-80">points · {{ entry.memberCount }} students</p>
              </article>
            }
          </section>
        }

        <section aria-labelledby="standings-heading" class="mt-8 overflow-hidden rounded-2xl border border-[#E1E7E3] bg-white shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8ECE9] px-5 py-4 sm:px-6">
            <h2 id="standings-heading" class="font-display text-lg font-extrabold text-[#0B3B3B]">Top classes</h2>
            <span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">{{ entries().length }} class{{ entries().length === 1 ? '' : 'es' }}</span>
          </div>
          <ol class="list-none p-0">
            @for (entry of entries(); track entry.id) {
              @if (entry.rank > 3) {
                <li [class]="rowClass(entry)" [attr.aria-current]="entry.currentClass ? 'true' : null">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F6F3] text-sm font-extrabold text-[#365553]">{{ entry.rank }}</span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-bold text-[#12302F]">{{ entry.name }} @if (entry.currentClass) { <span class="ml-1 rounded-full bg-[#E0F2E9] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#17633D]">Your class</span> }</p>
                    <p class="mt-1 text-xs text-[#667575]">{{ entry.memberCount }} students</p>
                  </div>
                  <p class="shrink-0 text-right font-extrabold tabular-nums text-[#0B3B3B]">{{ entry.totalPoints }} <span class="block text-[10px] font-semibold uppercase tracking-wide text-[#667575]">points</span></p>
                </li>
              }
            }
          </ol>
        </section>

        @if (myClassOutsideTop()) {
          <section aria-labelledby="your-class-heading" class="mt-6 rounded-2xl border-2 border-[#0A6B6B] bg-[#F2F8F5] p-5 sm:p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0A6B6B]">Your class</p>
            <div class="mt-3 flex items-center gap-4">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-extrabold text-[#0A6B6B]">{{ myClassOutsideTop()?.rank }}</span>
              <div class="min-w-0 flex-1"><h2 id="your-class-heading" class="truncate font-bold text-[#12302F]">{{ myClassOutsideTop()?.name }}</h2><p class="mt-1 text-xs text-[#667575]">{{ myClassOutsideTop()?.memberCount }} students</p></div>
              <p class="text-right font-extrabold tabular-nums text-[#0B3B3B]">{{ myClassOutsideTop()?.totalPoints }}<span class="block text-[10px] font-semibold uppercase tracking-wide text-[#667575]">points</span></p>
            </div>
          </section>
        }
      }
    </main>
  `,
})
export class LeaderboardComponent implements OnInit {
  private readonly api = inject(ClassApiService);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly entries = signal<ClassLeaderboardEntry[]>([]);
  protected readonly myClass = signal<ClassLeaderboardEntry | null>(null);
  protected readonly topThree = () => this.entries().filter((entry) => entry.rank <= 3);
  protected readonly myClassOutsideTop = () => this.myClass() && this.myClass()!.rank > 10 ? this.myClass() : null;

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.leaderboard().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (result) => { this.entries.set(result.topClasses); this.myClass.set(result.myClass); },
      error: () => this.error.set('Please try again in a moment.'),
    });
  }

  protected medal(rank: number): string { return rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'; }
  protected podiumClass(entry: ClassLeaderboardEntry): string {
    const rankStyles = entry.rank === 1 ? 'sm:order-2 sm:min-h-64 border-[#E7BC42] bg-[#FFF7DD] text-[#664B0B]' : entry.rank === 2 ? 'sm:order-1 sm:min-h-56 border-[#CAD2D5] bg-[#F4F6F7] text-[#37474F]' : 'sm:order-3 sm:min-h-52 border-[#D4A27C] bg-[#FFF1E7] text-[#6E4024]';
    return `flex flex-col items-center justify-center rounded-2xl border-2 p-5 text-center shadow-sm ${rankStyles} ${entry.currentClass ? 'ring-2 ring-[#0A6B6B] ring-offset-2' : ''}`;
  }
  protected rowClass(entry: ClassLeaderboardEntry): string {
    return `flex min-h-[4.5rem] items-center gap-3 border-b border-[#EDF0EE] px-4 py-3 last:border-0 sm:px-6 ${entry.currentClass ? 'bg-[#F2F8F5] ring-inset ring-2 ring-[#0A6B6B]' : ''}`;
  }
}
