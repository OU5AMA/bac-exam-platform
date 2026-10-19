import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COURSE_UNITS } from './unit-data';

@Component({
  selector: 'app-unit-hub',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to 2 Bac
        </a>

        @if (unit(); as selectedUnit) {
          <header class="mt-8 rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-10">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">2nd Year Baccalaureate · Unit {{ selectedUnit.id }}</p>
            <h1 class="font-display mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">{{ selectedUnit.title }}</h1>
            <p class="mt-4 max-w-2xl leading-7">Choose a skill to practice. More activities will be added as the course grows.</p>
          </header>

          <section aria-labelledby="skills-title" class="mt-10">
            <h2 id="skills-title" class="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B]">Practice a skill</h2>
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              @if (selectedUnit.id === 1) {
                <a [routerLink]="crosswordLink(selectedUnit.id)" class="group flex min-h-40 items-start gap-4 rounded-2xl border border-[#0A6B6B]/30 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#0A6B6B] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">
                  <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-[#0A6B6B]" aria-hidden="true"><svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zm4 4h3v3h-3z"/></svg></span>
                  <span class="flex-1">
                    <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#0A6B6B]">Available now</span>
                    <span class="font-display mt-2 block text-xl font-bold text-[#0B3B3B]">Vocabulary</span>
                    <span class="mt-2 block text-sm leading-6">Build your word knowledge with the Unit 1 crossword.</span>
                    <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0A6B6B]">Open crosswords <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span></span>
                  </span>
                </a>
              } @else {
                <article class="flex min-h-40 items-start gap-4 rounded-2xl border border-[#E5E7E5] bg-white p-6">
                  <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-[#0A6B6B]" aria-hidden="true"><span class="text-xl font-bold">Aa</span></span>
                  <span>
                    <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Coming soon</span>
                    <span class="font-display mt-2 block text-xl font-bold text-[#0B3B3B]">Vocabulary</span>
                    <span class="mt-2 block text-sm leading-6">Vocabulary activities for this unit are on the way.</span>
                  </span>
                </article>
              }

              @for (skill of comingSoonSkills; track skill) {
                <article class="flex min-h-40 items-start gap-4 rounded-2xl border border-[#E5E7E5] bg-white p-6">
                  <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F7F5F0] text-[#667575]" aria-hidden="true">
                    @switch (skill) {
                      @case ('Grammar') { <span class="text-lg font-bold">Aa</span> }
                      @case ('Reading') { <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8m-8 4h8"/></svg> }
                      @default { <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg> }
                    }
                  </span>
                  <span>
                    <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Coming soon</span>
                    <span class="font-display mt-2 block text-xl font-bold text-[#0B3B3B]">{{ skill }}</span>
                    <span class="mt-2 block text-sm leading-6">{{ skill }} practice for this unit is on the way.</span>
                  </span>
                </article>
              }
            </div>
          </section>
        } @else {
          <section class="mt-8 rounded-2xl border border-[#E5E7E5] bg-white p-8" role="alert">
            <h1 class="font-display text-2xl font-extrabold text-[#0B3B3B]">Unit not found</h1>
            <p class="mt-2">Choose a unit from the 2 Bac course page.</p>
            <a routerLink="/2-bac" class="mt-5 inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Browse all units</a>
          </section>
        }
      </div>
    </main>
  `,
})
export class UnitHubComponent {
  readonly unitId = input.required<string>();
  protected readonly unit = computed(() => COURSE_UNITS.find((item) => item.id === Number(this.unitId())) ?? null);
  protected readonly comingSoonSkills = ['Grammar', 'Reading', 'Writing'];

  protected crosswordLink(unitId: number): string[] {
    return ['/2-bac/exercices', `unit-${unitId}`, 'vocabulary', 'crosswords'];
  }
}
