import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { exercisesPath, UNIT_SKILLS } from './unit-skill-routes';

const TYPE_LABELS: Record<string, string> = {
  quizzes: 'Grammar quizzes', comprehension: 'Reading comprehension', opinion: 'Expressing opinion', 'guided-writing': 'Guided writing',
};

@Component({
  selector: 'app-exercise-type-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12"><section class="mx-auto max-w-2xl rounded-2xl border border-[#E5E7E5] bg-white p-6 shadow-sm sm:p-8">
      <a [routerLink]="exercisesPath(unitId(), skillKey())" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← All {{ skill() }} exercises</a>
      <h1 class="font-display mt-6 text-3xl font-extrabold text-[#0B3B3B]">{{ title() }}</h1><p class="mt-3 leading-7">This practice activity is being prepared. You can return to the exercise list and choose another activity.</p>
      <a [routerLink]="['/2-bac','unit',unitId(),skill(),'lesson']" class="mt-6 inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Review the lesson</a>
    </section></main>
  `,
})
export class ExerciseTypePageComponent {
  readonly unitId = input.required<string>();
  readonly skill = input.required<string>();
  readonly type = input.required<string>();
  protected readonly skillKey = computed(() => UNIT_SKILLS.includes(this.skill() as (typeof UNIT_SKILLS)[number]) ? this.skill() as (typeof UNIT_SKILLS)[number] : 'vocabulary');
  protected readonly exercisesPath = exercisesPath;
  protected readonly title = computed(() => TYPE_LABELS[this.type()] ?? 'Exercise type not found');
}
