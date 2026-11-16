import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

interface BestScore { score: number; maxScore: number; }
interface GrammarExerciseCard {
  id: string;
  title: string;
  description: string;
  type: 'fill_modal' | 'identify_function' | 'mixed' | 'paragraph';
  sentenceCount: number;
  gapCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxScore: number;
  bestScore: BestScore | null;
}

@Component({
  selector: 'app-grammar-exercise-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac/unit/2" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2">←</span> Back to Unit 2</a>
        <header class="mt-5 rounded-2xl bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-9"><p class="text-xs font-bold uppercase tracking-[.18em] text-[#F5C56D]">Unit 2 · Grammar · Humour</p><h1 class="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Modal Verbs Practice</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">Choose a set, read the situation, and decide what the modal is doing. Your best score is saved for each exercise.</p></header>
        <section aria-labelledby="exercise-list-heading" class="mt-7"><div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Practice by function</p><h2 id="exercise-list-heading" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">Choose an exercise</h2></div>@if (!loading() && !error()) { <span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">{{ exercises().length }} exercises</span> }</div>
          @if (loading()) { <div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="h-48 animate-pulse rounded-2xl bg-white"></div><div class="h-48 animate-pulse rounded-2xl bg-white"></div><div class="h-48 animate-pulse rounded-2xl bg-white"></div></div> }
          @else if (error()) { <div class="mt-5 rounded-2xl border border-[#D9958C] bg-white p-6" role="alert"><p>{{ error() }}</p><button type="button" (click)="loadExercises()" class="mt-3 inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button></div> }
          @else if (exercises().length === 0) { <div class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-6"><h3 class="font-display text-lg font-bold text-[#0B3B3B]">Exercises are on their way</h3><p class="mt-2 text-sm">There are no modal exercises available yet.</p></div> }
          @else { <ol class="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">@for (exercise of exercises(); track exercise.id; let i = $index) { <li><article class="flex h-full flex-col rounded-2xl border border-[#E1E8E3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"><div class="flex items-start justify-between gap-3"><span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#075B5B]">Exercise {{ i + 1 }}</span><span class="rounded-full px-3 py-1.5 text-xs font-extrabold" [class.bg-[#E8F2F0]]="exercise.difficulty === 'Easy'" [class.text-[#075B5B]]="exercise.difficulty === 'Easy'" [class.bg-[#FFF0D1]]="exercise.difficulty === 'Medium'" [class.text-[#805300]]="exercise.difficulty === 'Medium'" [class.bg-[#FCE8E5]]="exercise.difficulty === 'Hard'" [class.text-[#9B3D2D]]="exercise.difficulty === 'Hard'">{{ exercise.difficulty }}</span></div><h3 class="font-display mt-4 text-xl font-extrabold text-[#0B3B3B]">{{ exercise.title }}</h3><p class="mt-2 flex-1 text-sm leading-6 text-[#53615F]">{{ exercise.description }}</p><div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#53615F]"><span class="rounded-lg bg-[#F5F8F6] px-2.5 py-1.5">{{ typeLabel(exercise.type) }}</span>@if (exercise.gapCount) { <span class="rounded-lg bg-[#F5F8F6] px-2.5 py-1.5">{{ exercise.gapCount }} gaps</span> } @else { <span class="rounded-lg bg-[#F5F8F6] px-2.5 py-1.5">{{ exercise.sentenceCount }} sentences</span> }<span class="rounded-lg bg-[#F5F8F6] px-2.5 py-1.5">{{ exercise.maxScore }} points</span></div><div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1EF] pt-4"><p class="text-xs font-semibold text-[#53615F]">@if (auth.currentUser()) { @if (exercise.bestScore) { Best: <strong class="text-[#0B3B3B]">{{ exercise.bestScore.score }} / {{ exercise.bestScore.maxScore }}</strong> } @else { Not attempted yet } } @else { Sign in to track }</p><a [routerLink]="[exercise.id]" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0A6B6B] px-4 text-sm font-extrabold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Start <span aria-hidden="true">→</span></a></div></article></li> }</ol> }
        </section>
        <footer class="my-7"><a routerLink="/2-bac/unit/2/grammar" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Review the Modal Verbs lesson</a></footer>
      </div>
    </main>
  `,
})
export class GrammarExerciseListComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);
  protected readonly exercises = signal<GrammarExerciseCard[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() { this.loadExercises(); }

  protected loadExercises(): void {
    this.loading.set(true);
    this.error.set('');
    const unitNumber = Number(this.route.snapshot.paramMap.get('unitNumber')) || 2;
    this.http.get<GrammarExerciseCard[]>(`/api/grammar/unit/${unitNumber}/exercises`).subscribe({
      next: (items) => { this.exercises.set(items); this.loading.set(false); },
      error: () => { this.error.set('Please check your connection and try again.'); this.loading.set(false); },
    });
  }

  protected typeLabel(type: GrammarExerciseCard['type']): string {
    return ({ fill_modal: 'Fill in the modal', identify_function: 'Identify the function', mixed: 'Modal + function', paragraph: 'Paragraph fill' })[type];
  }
}
