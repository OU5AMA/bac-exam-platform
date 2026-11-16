import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface GrammarExample { text: string; modal: boolean; }
interface GrammarFunction {
  name: string;
  modals: string[];
  meaning: string;
  examples: string[];
  formNote: string;
  teachingNote: string;
  featured: boolean;
}
interface GrammarLesson {
  unitNumber: number;
  unitTitle: string;
  objective: string;
  intro: string;
  formRules: string[];
  formChecks: { incorrect: string; correct: string }[];
  functions: GrammarFunction[];
  contrasts: { modal: string; uses: { function: string; example: string }[] }[];
  pastModals: { form: string; meaning: string; example: string; gloss: string }[];
  contextParagraph: string;
  mistakes: { incorrect: string; correct: string; explanation: string }[];
  selfCheck: { prompt: string; answer: string }[];
}
interface ContextPart { text: string; modal: boolean; }

@Component({
  selector: 'app-unit-2-grammar-lesson',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .modal-card[open] > summary { border-bottom: 1px solid #DDE6E1; }
    .modal-card[open] .disclosure-cue { font-size: 0; }
    .modal-card[open] .disclosure-cue::after { content: 'Close'; font-size: .75rem; }
    .featured-card { border-color: #E8B85B; box-shadow: 0 5px 16px rgba(11, 59, 59, .09); }
    .modal-card summary::-webkit-details-marker { display: none; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; } }
  `],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-5xl">
        <a [routerLink]="['/2-bac/unit', unitId()]" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2">←</span> Back to Unit {{ unitId() }}</a>

        @if (loading()) {
          <div class="mt-6 animate-pulse space-y-4" aria-label="Loading modal verbs lesson" aria-busy="true"><div class="h-52 rounded-2xl bg-[#DDE6E1]"></div><div class="grid gap-3 sm:grid-cols-2"><div class="h-40 rounded-2xl bg-white"></div><div class="h-40 rounded-2xl bg-white"></div></div></div>
        } @else if (error()) {
          <section role="alert" class="mt-6 rounded-2xl border border-[#D9958C] bg-white p-6"><h1 class="font-display text-2xl font-bold text-[#0B3B3B]">We couldn’t load this grammar lesson</h1><p class="mt-2">{{ error() }}</p><button type="button" (click)="loadLesson()" class="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button></section>
        } @else if (lesson(); as data) {
          <header class="mt-5 rounded-2xl bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-9">
            <p class="text-xs font-bold uppercase tracking-[.18em] text-[#F5C56D]">Unit {{ data.unitNumber }} · Grammar · {{ data.unitTitle }}</p>
            <h1 class="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Modal Verbs — Function &amp; Meaning</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">{{ data.objective }}</p>
            <div class="mt-5 flex flex-wrap items-center gap-3"><span class="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold">◷ About 8 min</span><a href="#function-cards" class="inline-flex min-h-11 items-center rounded-lg bg-[#F5A623] px-5 text-sm font-extrabold text-[#273A36] hover:bg-[#F7B94B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start practice <span class="ml-2" aria-hidden="true">→</span></a></div>
          </header>

          <section aria-labelledby="modal-intro" class="mt-6 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7">
            <p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Start with the job</p><h2 id="modal-intro" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">What is a modal?</h2>
            <p class="mt-3 leading-7">{{ data.intro }}</p>
            <div class="mt-5 grid gap-4 lg:grid-cols-2">
              <div class="rounded-xl bg-[#F1F8F6] p-4 sm:p-5"><h3 class="font-display text-lg font-bold text-[#0B3B3B]">The quick form rules</h3><ul class="mt-3 space-y-2 text-sm leading-6">@for (rule of data.formRules; track rule) { <li class="flex gap-2"><span class="font-bold text-[#0A6B6B]" aria-hidden="true">✓</span><span>{{ rule }}</span></li> }</ul></div>
              <div class="rounded-xl border border-[#E6ECE9] bg-[#FAFCFB] p-4 sm:p-5"><h3 class="font-display text-lg font-bold text-[#0B3B3B]">Check the form</h3>@for (check of data.formChecks; track check.incorrect) { <p class="mt-3 text-sm"><span class="line-through decoration-[#A34426]">{{ check.incorrect }}</span><span class="mx-2" aria-hidden="true">→</span><strong class="text-[#075B5B]">{{ check.correct }}</strong></p> }</div>
            </div>
          </section>

          <section id="function-cards" aria-labelledby="functions-heading" class="scroll-mt-4 mt-7">
            <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Meaning first, form next</p><h2 id="functions-heading" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">What are you doing with the modal?</h2><p class="mt-2 text-sm">Open a function to see its meaning, examples, and form.</p></div><span class="rounded-full bg-[#FFF0D1] px-3 py-2 text-xs font-bold text-[#805300]">10 language functions</span></div>
            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              @for (fn of data.functions; track fn.name; let i = $index) {
                <details class="modal-card overflow-hidden rounded-2xl border bg-white shadow-sm" [attr.id]="'function-' + functionSlug(fn.name)" [class.featured-card]="fn.featured">
                  <summary class="flex min-h-24 cursor-pointer list-none items-start justify-between gap-3 p-4 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0A6B6B] sm:p-5">
                    <span><span class="block text-[11px] font-extrabold uppercase tracking-[.14em]" [class.text-[#A86400]]="fn.featured" [class.text-[#0A6B6B]]="!fn.featured">Function {{ i + 1 }}{{ fn.featured ? ' · Bac focus' : '' }}</span><span class="font-display mt-1 block text-lg font-extrabold text-[#0B3B3B]">{{ fn.name }}</span><span class="mt-2 flex flex-wrap gap-1.5">@for (modal of fn.modals; track modal) { <span class="rounded-full bg-[#E8F2F0] px-2.5 py-1 text-xs font-bold text-[#075B5B]">{{ modal }}</span> }</span></span>
                    <span class="disclosure-cue mt-1 rounded-full bg-[#F5F8F6] px-2.5 py-1 text-xs font-bold text-[#53615F]">Open</span>
                  </summary>
                  <div class="p-4 pt-3 sm:p-5 sm:pt-4"><p class="text-sm leading-6"><strong class="text-[#0B3B3B]">Meaning:</strong> {{ fn.meaning }}</p>
                    <h3 class="mt-4 text-xs font-extrabold uppercase tracking-wide text-[#53615F]">In a sentence</h3><ul class="mt-2 space-y-2">@for (example of fn.examples; track example) { <li class="rounded-xl bg-[#FAFCFB] p-3 text-sm leading-6 text-[#183E3D]">@for (part of splitModals(example, data.functions); track $index) { @if (part.modal) { <strong class="rounded bg-[#FFF0D1] px-0.5 text-[#805300]">{{ part.text }}</strong> } @else { {{ part.text }} } }</li> }</ul>
                    <p class="mt-3 rounded-lg bg-[#F1F8F6] p-3 text-sm leading-6"><strong>Form:</strong> {{ fn.formNote }}</p><p class="mt-2 text-xs leading-5 text-[#53615F]">{{ fn.teachingNote }}</p>
                  </div>
                </details>
              }
            </div>
          </section>

          <section aria-labelledby="contrast-heading" class="mt-7 rounded-2xl border-l-4 border-[#F5A623] bg-[#FFF4DC] p-5 shadow-sm sm:p-7">
            <p class="text-xs font-extrabold uppercase tracking-[.16em] text-[#805300]">Same word, different job</p><h2 id="contrast-heading" class="font-display mt-1 text-2xl font-extrabold text-[#273A36]">One modal can do more than one thing</h2><p class="mt-2 text-sm leading-6 text-[#4F473B]">Choose a modal to compare what it means in each sentence.</p>
            <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a modal to compare">@for (item of data.contrasts; track item.modal) { <button type="button" (click)="activeContrast.set(item.modal)" [attr.aria-pressed]="activeContrast() === item.modal" class="min-h-10 rounded-full border px-4 text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]" [class.border-[#0B3B3B]]="activeContrast() === item.modal" [class.bg-[#0B3B3B]]="activeContrast() === item.modal" [class.text-white]="activeContrast() === item.modal" [class.border-[#D6C7A7]]="activeContrast() !== item.modal" [class.bg-white]="activeContrast() !== item.modal" [class.text-[#273A36]]="activeContrast() !== item.modal">{{ item.modal }}</button> }</div>
            @for (item of data.contrasts; track item.modal) { @if (activeContrast() === item.modal) { <div class="mt-4 grid gap-3 sm:grid-cols-2" aria-live="polite">@for (use of item.uses; track use.function) { <article class="rounded-xl border border-[#E8D9B9] bg-white p-4"><p class="text-xs font-extrabold uppercase tracking-wide text-[#805300]">{{ use.function }}</p><p class="mt-2 text-base font-semibold leading-6 text-[#273A36]">{{ use.example }}</p></article> }</div> } }
          </section>

          <section aria-labelledby="past-modals-heading" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7">
            <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#A86400]">High-frequency Bac form</p><h2 id="past-modals-heading" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">Modal + have + past participle</h2><p class="mt-2 text-sm">Use this pattern to reason or look back at a past action.</p></div><label class="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[#53615F]"><input type="checkbox" [checked]="showGlosses()" (change)="showGlosses.set(!showGlosses())" class="h-4 w-4 accent-[#0A6B6B]"> Show Darija / French hints</label></div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">@for (item of data.pastModals; track item.form) { <article class="rounded-xl border border-[#E6ECE9] bg-[#FAFCFB] p-4"><p class="font-mono text-sm font-extrabold text-[#075B5B]">{{ item.form }}</p><p class="mt-1 text-xs font-semibold text-[#53615F]">{{ item.meaning }}</p><p class="mt-2 text-sm leading-6 text-[#183E3D]">{{ item.example }}</p>@if (showGlosses()) { <p class="mt-2 rounded-lg bg-white px-3 py-2 text-xs"><strong>Hint:</strong> {{ item.gloss }}</p> }</article> }</div>
          </section>

          <section aria-labelledby="context-heading" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Read it like an exam text</p><h2 id="context-heading" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">Modals in context</h2><p class="mt-4 text-base leading-8">@for (part of contextParts(); track $index) { @if (part.modal) { <button type="button" (click)="showContextModal(part.text)" class="rounded bg-[#FFF0D1] px-0.5 font-bold text-[#805300] underline decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]" [attr.aria-label]="'Explain modal ' + part.text">{{ part.text }}</button> } @else { {{ part.text }} } }</p>@if (selectedContextModal()) { <p class="mt-3 rounded-xl bg-[#F1F8F6] p-3 text-sm leading-6" aria-live="polite"><strong>{{ selectedContextModal() }}:</strong> {{ contextExplanation() }}</p> }<p class="mt-2 text-xs text-[#64716F]">Tap a highlighted modal to see the function it expresses.</p></section>

          <aside aria-labelledby="mistakes-heading" class="mt-5 rounded-2xl border-l-4 border-[#F5A623] bg-[#FFF4DC] p-5 shadow-sm sm:p-7"><p class="text-xs font-extrabold uppercase tracking-[.16em] text-[#805300]">A quick teacher tip</p><h2 id="mistakes-heading" class="font-display mt-1 text-xl font-extrabold text-[#273A36]">Common mistakes</h2><ul class="mt-3 space-y-3">@for (mistake of data.mistakes; track mistake.incorrect) { <li class="rounded-xl bg-white/70 p-3 text-sm leading-6 text-[#273A36]"><span class="line-through decoration-[#A34426]">{{ mistake.incorrect }}</span><span class="mx-2" aria-hidden="true">→</span><strong>{{ mistake.correct }}</strong><span class="mt-1 block text-xs text-[#5A5143]">{{ mistake.explanation }}</span></li> }</ul></aside>

          <section aria-labelledby="self-check-heading" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">No points. Just recall.</p><h2 id="self-check-heading" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Check in with yourself</h2></div><span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">Optional · ungraded</span></div><div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">@for (question of data.selfCheck; track question.prompt) { <button type="button" (click)="toggleRecall(question.prompt)" [attr.aria-expanded]="recall().has(question.prompt)" class="min-h-24 rounded-xl border border-[#E5E7E5] bg-[#FAFCFB] p-4 text-left focus-visible:outline-2 focus-visible:outline-[#0A6B6B]"><span class="block text-sm font-bold text-[#173E3D]">{{ question.prompt }}</span>@if (recall().has(question.prompt)) { <span class="mt-2 block text-sm font-extrabold text-[#0A6B6B]">{{ question.answer }}</span> } @else { <span class="mt-2 block text-xs text-[#64716F]">Tap to reveal</span> }</button> }</div></section>

          <footer class="my-7 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#0B3B3B] p-5 text-white sm:flex-row sm:items-center sm:p-6"><div><p class="font-display text-xl font-extrabold">You’ve got this.</p><p class="mt-1 text-sm text-white/85">Ready to try these modals in context?</p></div><a routerLink="/2-bac/unit/2/grammar/exercises" class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#F5A623] px-5 font-extrabold text-[#273A36] hover:bg-[#F7B94B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">Ready to practice <span class="ml-2" aria-hidden="true">→</span></a></footer>
        }
      </div>
    </main>
  `,
})
export class Unit2GrammarLessonComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  protected readonly unitId = computed(() => Number(this.route.snapshot.paramMap.get('unitId')) || 2);
  protected readonly lesson = signal<GrammarLesson | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly activeContrast = signal('must');
  protected readonly showGlosses = signal(false);
  protected readonly recall = signal(new Set<string>());
  protected readonly selectedContextModal = signal('');
  protected readonly contextParts = computed<ContextPart[]>(() => {
    const lesson = this.lesson();
    if (!lesson) return [];
    const modalList = lesson.functions.flatMap((fn) => fn.modals).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${modalList.map((modal) => modal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    return this.splitByPattern(lesson.contextParagraph, pattern);
  });

  constructor() { this.loadLesson(); }

  protected loadLesson(): void {
    this.loading.set(true);
    this.error.set('');
    this.http.get<GrammarLesson>(`/api/grammar/unit/${this.unitId()}`).subscribe({
      next: (lesson) => { this.lesson.set(lesson); this.loading.set(false); },
      error: () => { this.error.set('Please check your connection and try again.'); this.loading.set(false); },
    });
  }
  protected splitModals(text: string, functions: GrammarFunction[]): GrammarExample[] {
    const modals = functions.flatMap((fn) => fn.modals).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${modals.map((modal) => modal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    return this.splitByPattern(text, pattern).map((part) => ({ ...part, modal: part.modal }));
  }
  private splitByPattern(text: string, pattern: RegExp): GrammarExample[] {
    const result: GrammarExample[] = [];
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > last) result.push({ text: text.slice(last, index), modal: false });
      result.push({ text: match[0], modal: true });
      last = index + match[0].length;
    }
    if (last < text.length) result.push({ text: text.slice(last), modal: false });
    return result;
  }
  protected showContextModal(modal: string): void { this.selectedContextModal.set(modal); }
  protected functionSlug(name: string): string { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  protected contextExplanation(): string {
    const modal = this.selectedContextModal().toLowerCase();
    const lesson = this.lesson();
    const fn = lesson?.functions.find((item) => item.modals.some((candidate) => candidate.toLowerCase() === modal));
    return fn ? `${fn.name}: ${fn.meaning}` : 'This modal changes meaning with its context. Open the matching function card to compare its uses.';
  }
  protected toggleRecall(prompt: string): void {
    this.recall.update((state) => { const next = new Set(state); next.has(prompt) ? next.delete(prompt) : next.add(prompt); return next; });
  }
}
