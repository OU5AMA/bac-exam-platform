import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COURSE_UNITS } from './unit-data';

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
  action: string;
  available: boolean;
  featured?: boolean;
  link: string[] | null;
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
              @for (card of cards(selectedUnit.id); track card.title) {
                @if (card.link) {
                  <a [routerLink]="card.link" [attr.aria-label]="card.title + ': ' + card.description" [class]="card.featured ? 'group flex min-h-48 items-start gap-4 rounded-2xl bg-gradient-to-br from-[#5B3FA3] to-[#39246F] p-6 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B3FA3]' : 'group flex min-h-48 items-start gap-4 rounded-2xl border border-[#E5E7E5] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#0A6B6B]/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]'">
                    <span [class]="card.featured ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-2xl text-[#0A6B6B]'" aria-hidden="true">{{ card.icon }}</span>
                    <span class="flex-1">
                      @if (card.featured) {
                        <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Featured skill</span>
                      } @else if (card.available) {
                        <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#0A6B6B]">Available now</span>
                      } @else {
                        <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Coming soon</span>
                      }
                      <span [class]="card.featured ? 'font-display mt-3 block text-2xl font-bold text-white sm:text-3xl' : 'font-display mt-2 block text-xl font-bold text-[#0B3B3B]'">{{ card.title }}</span>
                      @if (card.featured) {
                        <span class="mt-1 block text-lg font-semibold text-white">{{ card.subtitle }}</span>
                      }
                      <span [class]="card.featured ? 'mt-3 block max-w-xl text-sm leading-6 text-white/90' : 'mt-2 block text-sm leading-6 text-[#4B5B5B]'">{{ card.description }}</span>
                      <span [class]="card.featured ? 'mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white' : 'mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A6B6B]'">{{ card.action }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span></span>
                    </span>
                  </a>
                } @else {
                  <article [class]="card.featured ? 'flex min-h-48 items-start gap-4 rounded-2xl bg-gradient-to-br from-[#5B3FA3] to-[#39246F] p-6 text-white shadow-lg' : 'flex min-h-48 items-start gap-4 rounded-2xl border border-[#E5E7E5] bg-white p-6'" aria-label="{{ card.title }}: Coming soon">
                    <span [class]="card.featured ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl' : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-2xl text-[#0A6B6B]'" aria-hidden="true">{{ card.icon }}</span>
                    <span>
                      @if (card.featured) { <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Featured skill</span> }
                      @else { <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Coming soon</span> }
                      <span [class]="card.featured ? 'font-display mt-3 block text-2xl font-bold text-white' : 'font-display mt-2 block text-xl font-bold text-[#0B3B3B]'">{{ card.title }}</span>
                      @if (card.subtitle) { <span [class]="card.featured ? 'mt-1 block text-lg font-semibold text-white' : 'mt-1 block font-semibold text-[#5B3FA3]'">{{ card.subtitle }}</span> }
                      <span [class]="card.featured ? 'mt-3 block text-sm leading-6 text-white/90' : 'mt-2 block text-sm leading-6'">{{ card.description }}</span>
                    </span>
                  </article>
                }
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

  protected cards(unitId: number): UnitCard[] {
    const unitOne = unitId === 1;
    return [
      { title: 'Vocabulary', icon: 'Aa', description: unitOne ? 'Practice new words with the Unit 1 crosswords.' : 'Practice new words from this unit.', action: 'Open crosswords', available: unitOne, link: unitOne ? ['/2-bac/exercices/unit-1/vocabulary/crosswords'] : null },
      { title: 'Grammar', icon: '✎', description: unitOne ? 'Review full infinitives, bare infinitives, and gerunds.' : 'Review the rules and strengthen your grammar.', action: 'Open grammar lesson', available: unitOne, link: unitOne ? ['/2-bac/unit/1/grammar'] : null },
      { title: 'Reading', icon: '▤', description: unitOne ? 'Read and comprehend texts with Unit 1 exam practice.' : 'Read and comprehend texts related to this unit.', action: 'Open reading practice', available: unitOne, link: unitOne ? ['/2-bac/reading'] : null },
      { title: 'Function', icon: '✦', description: 'Master the communication skill for this unit.', subtitle: UNIT_DATA[unitId]?.function ?? 'Expressing Opinion', action: 'Coming soon', available: false, link: null },
      { title: 'Writing', icon: '↗', description: 'Practice your essays and express your ideas clearly.', action: 'Coming soon', available: false, link: null },
      { title: 'Exam Simulator', icon: '▣', description: "Take a mock exam based on this unit's lessons.", action: 'Coming soon', available: false, featured: true, link: null },
    ];
  }
}
