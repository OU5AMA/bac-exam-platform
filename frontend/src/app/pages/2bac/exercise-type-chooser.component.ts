import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { exercisePath, UNIT_SKILLS } from './unit-skill-routes';

const EXERCISE_TYPES = {
  vocabulary: [{ slug: 'crosswords', label: 'Crosswords', description: 'Recall unit vocabulary with themed puzzles.' }],
  grammar: [{ slug: 'quizzes', label: 'Grammar quizzes', description: 'Choose the correct form and check your understanding.' }],
  reading: [{ slug: 'comprehension', label: 'Reading comprehension', description: 'Read a passage and answer questions about it.' }],
  function: [{ slug: 'opinion', label: 'Expressing opinion', description: 'Practice building a clear opinion with supporting reasons.' }],
  writing: [{ slug: 'guided-writing', label: 'Guided writing', description: 'Plan and practice a structured response.' }],
} as const;

@Component({
  selector: 'app-exercise-type-chooser',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12">
      <div class="mx-auto max-w-3xl">
        <a [routerLink]="['/2-bac','unit',unitId()]" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Back to Unit {{ unitId() }}</a>
        <header class="mt-6"><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Unit {{ unitId() }}</p><h1 class="font-display mt-2 text-3xl font-extrabold tracking-tight text-[#0B3B3B]">{{ skillLabel() }} practice</h1><p class="mt-3 leading-7">Choose an exercise type to get started.</p></header>
        @if (types(); as options) {
          <ul class="mt-6 grid gap-4 sm:grid-cols-2">
            @for (item of options; track item.slug) {
              <li><a [routerLink]="exercisePath(unitId(), skillKey(), item.slug)" class="group flex min-h-32 h-full flex-col rounded-xl border border-[#E5E7E5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span class="font-display text-lg font-bold text-[#0B3B3B]">{{ item.label }} <span aria-hidden="true" class="text-[#0A6B6B]">→</span></span><span class="mt-2 text-sm leading-6">{{ item.description }}</span></a></li>
            }
          </ul>
        } @else {
          <section class="mt-6 rounded-xl border border-[#E5E7E5] bg-white p-6" role="alert"><h2 class="font-display text-xl font-bold text-[#0B3B3B]">Skill not found</h2><p class="mt-2">Choose Vocabulary, Grammar, Reading, Function, or Writing.</p></section>
        }
      </div>
    </main>
  `,
})
export class ExerciseTypeChooserComponent {
  readonly unitId = input.required<string>();
  readonly skill = input.required<string>();
  protected readonly exercisePath = exercisePath;
  protected readonly skillKey = computed(() => UNIT_SKILLS.includes(this.skill() as (typeof UNIT_SKILLS)[number]) ? this.skill() as keyof typeof EXERCISE_TYPES : 'vocabulary');
  protected readonly skillLabel = computed(() => this.skill().charAt(0).toUpperCase() + this.skill().slice(1));
  protected readonly types = computed(() => UNIT_SKILLS.includes(this.skill() as (typeof UNIT_SKILLS)[number]) ? EXERCISE_TYPES[this.skill() as keyof typeof EXERCISE_TYPES] : null);
}
