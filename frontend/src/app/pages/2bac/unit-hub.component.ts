import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COURSE_UNITS } from './unit-data';
import { exercisesPath, lessonPath, UnitSkill } from './unit-skill-routes';

const UNIT_DATA: Record<number, { title: string; function: string }> = {
  1: { title: 'The Gifts of Youth', function: 'Expressing Opinion' },
  2: { title: 'Humour', function: 'Expressing Opinion' },
  3: { title: 'Education', function: 'Expressing Opinion' },
  4: { title: 'Cultural Issues and Values', function: 'Expressing Opinion' },
  5: { title: 'Citizenship', function: 'Expressing Opinion' },
  6: { title: 'Women and Power', function: 'Expressing Opinion' },
  7: { title: 'Science and Technology', function: 'Expressing Opinion' },
  8: { title: 'The Media', function: 'Expressing Opinion' },
  9: { title: 'Global Issues', function: 'Expressing Opinion' },
  10: { title: 'Cultural Values (Review)', function: 'Expressing Opinion' },
};

interface UnitCard {
  title: string;
  icon: string;
  description: string;
  subtitle?: string;
  skill: UnitSkill;
  available: boolean;
  featured?: boolean;
}

@Component({
  selector: 'app-unit-hub',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <div class="mx-auto max-w-6xl">
        <a routerLink="/2-bac" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to 2 Bac
        </a>

        @if (unit(); as selectedUnit) {
          <header class="mt-8">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">2nd Year Baccalaureate</p>
            <h1 class="font-display mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Unit {{ selectedUnit.id }}: {{ selectedUnit.title }}</h1>
            <p class="mt-3 max-w-2xl leading-7">Choose a skill to practice and build your confidence in this unit.</p>
          </header>

          <section aria-labelledby="skills-title" class="mt-8 sm:mt-10">
            <h2 id="skills-title" class="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B]">Explore this unit</h2>
            <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              @for (card of cards(); track card.title) {
                <article [class]="card.featured ? 'flex min-h-64 flex-col rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#C96C13] p-0 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl' : 'flex min-h-64 flex-col rounded-2xl border border-[#E5E7E5] bg-white p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'">
                  <a [routerLink]="lessonCardPath(selectedUnit.id, card.skill)" [attr.aria-label]="card.title + ' lesson'" class="flex flex-1 flex-col rounded-2xl p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
                  <div class="flex items-start justify-between gap-3">
                    <span [class]="card.featured ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/30 text-2xl' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-2xl text-[#0A6B6B]'" aria-hidden="true">{{ card.icon }}</span>
                    @if (card.featured) { <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4B0082]">Featured</span> }
                    @else if (card.available) { <span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0A6B6B]">Available</span> }
                    @else { <span class="rounded-full bg-[#F0F1EF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#667575]">Coming soon</span> }
                  </div>
                  <h3 [class]="card.featured ? 'font-display mt-4 text-2xl font-bold text-white' : 'font-display mt-4 text-xl font-bold text-[#0B3B3B]'">{{ card.title }}</h3>
                  @if (card.subtitle) { <p [class]="card.featured ? 'mt-1 text-base font-semibold text-white' : 'mt-1 text-sm font-semibold text-[#5B3FA3]'">{{ card.subtitle }}</p> }
                  <p [class]="card.featured ? 'mt-2 flex-1 text-sm leading-6 text-white' : 'mt-2 flex-1 text-sm leading-6 text-[#4B5B5B]'">{{ card.description }}</p>
                  </a>
                  <a [routerLink]="practicePath(selectedUnit.id, card.skill)" class="mx-6 mb-6 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0A6B6B] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Practice <span aria-hidden="true">→</span></a>
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
  protected readonly unit = computed(() => {
    const id = Number(this.unitId());
    const courseUnit = COURSE_UNITS.find((item) => item.id === id);
    return courseUnit ? { ...courseUnit, ...UNIT_DATA[id] } : null;
  });

  protected lessonCardPath(unitId: number, skill: UnitSkill): string[] {
    if (skill === 'grammar' || skill === 'function') return ['/2-bac', 'unit', String(unitId), skill];
    return lessonPath(unitId, skill);
  }

  protected practicePath(unitId: number, skill: UnitSkill): string[] {
    if (skill === 'vocabulary') return ['/2-bac', 'unit', String(unitId), 'vocabulary', 'exercises', 'crosswords'];
    if (skill === 'grammar' && unitId === 1) return ['/2-bac/unit/1/grammar/exercises'];
    return exercisesPath(unitId, skill);
  }

  protected cards(): UnitCard[] {
    return [
      { title: 'Vocabulary', skill: 'vocabulary', icon: 'Aa', description: 'Build unit vocabulary with interactive crosswords.', available: true },
      { title: 'Grammar', skill: 'grammar', icon: '✎', description: 'Review grammar rules and practice using them in context.', available: true },
      { title: 'Reading', skill: 'reading', icon: '▤', description: 'Practice reading comprehension and analyzing texts.', available: true },
      { title: 'Function', skill: 'function', icon: '✦', description: 'Learn clear opinion starters and build a convincing argument.', subtitle: UNIT_DATA[Number(this.unitId())]?.function ?? 'Expressing Opinion', available: true },
      { title: 'Writing', skill: 'writing', icon: '↗', description: 'Explore guided writing lessons and practice activities.', available: true },
    ];
  }
}
