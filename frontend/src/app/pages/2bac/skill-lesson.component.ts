import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { exercisesPath, UNIT_SKILLS, UnitSkill } from './unit-skill-routes';

const LESSONS = {
  vocabulary: { title: 'Build your vocabulary', intro: 'Learn and use the key words from this unit.', points: ['Notice each word in context.', 'Connect new words to ideas you already know.', 'Use the words in a sentence of your own.'] },
  grammar: { title: 'Grammar lesson', intro: 'Review the forms and patterns used in this unit.', points: ['Study the example before the rule.', 'Notice how the form changes the meaning.', 'Try the pattern in your own sentence.'] },
  reading: { title: 'Reading strategies', intro: 'Prepare to understand a text and find evidence for your answers.', points: ['Preview the title and key vocabulary.', 'Read once for the main idea.', 'Return to the text to support each answer.'] },
  function: { title: 'Expressing opinion', intro: 'Build a clear opinion and support it with a convincing reason.', points: ['State your opinion clearly.', 'Give a reason or example.', 'Connect your ideas with useful phrases.'] },
  writing: { title: 'Writing lesson', intro: 'Plan, draft, and improve a clear piece of writing.', points: ['Organize your ideas before drafting.', 'Use linking words to guide the reader.', 'Review grammar and punctuation before finishing.'] },
} as const;

@Component({
  selector: 'app-skill-lesson',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12">
      <article class="mx-auto max-w-3xl rounded-2xl border border-[#E5E7E5] bg-white p-6 shadow-sm sm:p-8">
        <a [routerLink]="['/2-bac','unit',unitId()]" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Back to Unit {{ unitId() }}</a>
        @if (lesson(); as content) {
          <header class="mt-6">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Unit {{ unitId() }} · {{ skill() }}</p>
            <h1 class="font-display mt-2 text-3xl font-extrabold tracking-tight text-[#0B3B3B] sm:text-4xl">{{ content.title }}</h1>
            <p class="mt-3 max-w-2xl leading-7">{{ content.intro }}</p>
          </header>
          <section class="mt-8 rounded-xl bg-[#F1F8F6] p-5 sm:p-6" aria-labelledby="lesson-points">
            <h2 id="lesson-points" class="font-display text-xl font-bold text-[#0B3B3B]">Keep these in mind</h2>
            <ol class="mt-4 list-decimal space-y-3 pl-5 leading-7">
              @for (point of content.points; track point) { <li>{{ point }}</li> }
            </ol>
          </section>
          <a [routerLink]="exercisesPath(unitId(), skillKey())" class="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#F5A623] px-5 py-3 font-bold text-[#2E2718] transition hover:bg-[#E69A18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Go to Practice <span aria-hidden="true">→</span></a>
        } @else {
          <section class="mt-6" role="alert"><h1 class="font-display text-2xl font-bold text-[#0B3B3B]">Lesson not found</h1><p class="mt-2">Choose one of the five skills from your unit page.</p></section>
        }
      </article>
    </main>
  `,
})
export class SkillLessonComponent {
  readonly unitId = input.required<string>();
  readonly skill = input.required<string>();
  protected readonly exercisesPath = exercisesPath;
  protected readonly skillKey = computed(() => UNIT_SKILLS.includes(this.skill() as UnitSkill) ? this.skill() as UnitSkill : 'vocabulary');
  protected readonly lesson = computed(() => UNIT_SKILLS.includes(this.skill() as (typeof UNIT_SKILLS)[number])
    ? LESSONS[this.skill() as keyof typeof LESSONS]
    : null);
}
