import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface VocabularyWord {
  id: number;
  unitNumber: number;
  cluster: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  collocation: string;
  nounForm: string | null;
  adjectiveForm: string | null;
  darijaGloss: string | null;
}
interface VocabularyLesson {
  unitNumber: number;
  unitTitle: string;
  contextParagraph: string;
  words: VocabularyWord[];
  collocations: { phrase: string; meaning: string }[];
  commonMistakes: { incorrect: string; correct: string; note: string }[];
  wordPairs: { noun: string; adjective: string }[];
}
interface ContextPart { text: string; word: VocabularyWord | null; }

@Component({
  selector: 'app-vocabulary-lesson',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .flip-card { perspective: 1000px; }
    .flip-inner { transform-style: preserve-3d; transition: transform 520ms cubic-bezier(.2,.75,.25,1); }
    .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }
    .flip-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .flip-back { transform: rotateY(180deg); }
    @media (prefers-reduced-motion: reduce) { .flip-inner { transition-duration: .01ms; } }
  `],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-5xl">
        <a [routerLink]="['/2-bac/unit', unitId()]" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2">←</span> Back to Unit {{ unitId() }}</a>

        @if (loading()) {
          <div class="mt-6 animate-pulse space-y-4" aria-label="Loading vocabulary lesson" aria-busy="true"><div class="h-52 rounded-2xl bg-[#DDE6E1]"></div><div class="h-10 w-1/3 rounded bg-[#DDE6E1]"></div><div class="grid grid-cols-2 gap-3 sm:grid-cols-3"><div class="h-44 rounded-2xl bg-white"></div><div class="h-44 rounded-2xl bg-white"></div><div class="h-44 rounded-2xl bg-white"></div></div></div>
        } @else if (error()) {
          <section class="mt-6 rounded-2xl border border-[#D9958C] bg-white p-6" role="alert"><h1 class="font-display text-2xl font-bold text-[#0B3B3B]">We couldn’t load the lesson</h1><p class="mt-2">{{ error() }}</p><button type="button" (click)="loadLesson()" class="mt-4 inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button></section>
        } @else if (lesson(); as data) {
          <header class="mt-5 rounded-2xl bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-9">
            <p class="text-xs font-bold uppercase tracking-[.18em] text-[#F5C56D]">Unit {{ data.unitNumber }} · Vocabulary · {{ data.unitTitle }}</p>
            <h1 class="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Words for your next big step.</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">Learn the words of Unit 1 — the exact words you’ll meet in the crosswords.</p>
            <div class="mt-5 flex flex-wrap items-center gap-3"><span class="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold">◷ About 6 min</span><a href="#word-cards" class="inline-flex min-h-11 items-center rounded-lg bg-[#F5A623] px-5 text-sm font-extrabold text-[#273A36] hover:bg-[#F7B94B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start practice <span class="ml-2" aria-hidden="true">→</span></a></div>
          </header>

          <section id="word-cards" aria-labelledby="words-heading" class="scroll-mt-4 mt-7">
            <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">The word deck</p><h2 id="words-heading" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Meet the words</h2><p class="mt-2 text-sm">Tap a card to turn it over. Star words you already know.</p></div>
              <label class="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[#53615F]"><input type="checkbox" [checked]="showGlosses()" (change)="showGlosses.set(!showGlosses())" class="h-4 w-4 accent-[#0A6B6B]"> Show Darija / French glosses</label>
            </div>
            @for (cluster of clusters(); track cluster.name) {
              <section class="mt-6" [attr.aria-labelledby]="'cluster-' + cluster.slug"><div class="mb-3 flex items-center justify-between"><h3 [id]="'cluster-' + cluster.slug" class="font-display text-lg font-extrabold text-[#0B3B3B]">{{ cluster.name }}</h3><span class="text-xs font-semibold text-[#64716F]">{{ cluster.words.length }} words</span></div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  @for (word of cluster.words; track word.word) {
                    <article class="flip-card relative min-h-[220px]" [attr.data-vocabulary-word]="word.word" [class.is-flipped]="flipped().has(word.word)">
                      <div class="flip-inner relative min-h-[220px] h-full">
                        <div class="flip-face absolute inset-0 flex min-h-[220px] flex-col rounded-2xl border border-[#E1E8E3] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div class="flex items-start justify-between gap-2"><span class="rounded-full bg-[#E8F2F0] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#075B5B]">{{ word.partOfSpeech }}</span><button type="button" [attr.aria-label]="known().has(word.word) ? 'Unmark ' + word.word + ' as known' : 'Mark ' + word.word + ' as known'" [attr.aria-pressed]="known().has(word.word)" (click)="toggleKnown(word.word); $event.stopPropagation()" class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-xl focus-visible:outline-2 focus-visible:outline-[#0A6B6B]" [class.text-[#B66B00]]="known().has(word.word)" [class.text-[#77827F]]="!known().has(word.word)">{{ known().has(word.word) ? '★' : '☆' }}</button></div>
                          <button type="button" (click)="toggleFlip(word.word)" [attr.aria-expanded]="flipped().has(word.word)" class="mt-2 flex flex-1 flex-col items-start text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]"><span class="font-display text-2xl font-extrabold tracking-tight text-[#0B3B3B]">{{ word.word.toLowerCase() }}</span><span class="mt-2 text-sm font-semibold text-[#0A6B6B]">Tap to explore <span aria-hidden="true">↻</span></span></button>
                        </div>
                        <div class="flip-face flip-back absolute inset-0 flex min-h-[220px] flex-col overflow-y-auto rounded-2xl border border-[#B9D8CF] bg-[#F5FBF8] p-4 shadow-md">
                          <div class="flex items-start justify-between gap-2"><h4 class="font-display text-lg font-extrabold text-[#0B3B3B]">{{ word.word.toLowerCase() }}</h4><button type="button" [attr.aria-label]="known().has(word.word) ? 'Unmark as known' : 'Mark as known'" [attr.aria-pressed]="known().has(word.word)" (click)="toggleKnown(word.word)" class="min-h-9 min-w-9 rounded-full text-lg text-[#A86400] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ known().has(word.word) ? '★' : '☆' }}</button></div>
                          <p class="mt-1 text-sm leading-5">{{ word.definition }}</p><p class="mt-2 text-xs leading-5 text-[#344C4B]"><strong>Example:</strong> {{ word.exampleSentence }}</p><p class="mt-1 text-xs leading-5"><strong>Goes with:</strong> {{ word.collocation }}</p>
                          @if (word.nounForm || word.adjectiveForm) { <p class="mt-1 text-xs font-semibold text-[#0A6B6B]">Word family: {{ word.nounForm?.toLowerCase() || '—' }} ↔ {{ word.adjectiveForm?.toLowerCase() || '—' }}</p> }
                          @if (showGlosses() && word.darijaGloss) { <p class="mt-1 rounded bg-white px-2 py-1 text-xs"><strong>Gloss:</strong> {{ word.darijaGloss }}</p> }
                          <button type="button" (click)="toggleFlip(word.word)" class="mt-auto min-h-9 self-start pt-2 text-xs font-bold text-[#0A6B6B] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Turn back</button>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              </section>
            }
          </section>

          <section aria-labelledby="context-title" class="mt-8 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Read it like an exam text</p><h2 id="context-title" class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">Youth in context</h2><p class="mt-4 text-base leading-8">@for (part of contextParts(); track $index) { @if (part.word) { <button type="button" (click)="showWord(part.word.word)" class="rounded bg-[#FFF0D1] px-0.5 font-bold text-[#805300] underline decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]" [attr.aria-label]="'Review ' + part.word.word + ': ' + part.word.definition">{{ part.text }}</button> } @else { {{ part.text }} } }</p><p class="mt-2 text-xs text-[#64716F]">Tap a highlighted word to open its flip card.</p></section>

          <section aria-labelledby="collocations-title" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><div class="flex items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#A86400]">Sound natural</p><h2 id="collocations-title" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Useful word partners</h2></div><span class="text-xs font-semibold text-[#64716F]">Quick scan</span></div><div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">@for (item of data.collocations.slice(0, 18); track item.phrase) { <div class="rounded-xl bg-[#F5F8F6] p-3"><p class="font-bold text-[#0B3B3B]">{{ item.phrase }}</p><p class="mt-1 text-xs text-[#53615F]">{{ item.meaning }}</p></div> }</div><details class="mt-3 rounded-xl bg-[#FAFCFB] p-3"><summary class="min-h-10 cursor-pointer content-center text-sm font-bold text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Explore the rest of the crossword word partners</summary><div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">@for (item of data.collocations.slice(18); track item.phrase) { <div class="rounded-xl bg-white p-3"><p class="font-bold text-[#0B3B3B]">{{ item.phrase }}</p><p class="mt-1 text-xs text-[#53615F]">{{ item.meaning }}</p></div> }</div></details></section>

          <section aria-labelledby="families-title" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">Language exam word families</p><h2 id="families-title" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Build the adjective</h2><div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">@for (pair of data.wordPairs; track pair.noun) { <button type="button" (click)="revealPair(pair.noun)" [attr.aria-expanded]="revealedPairs().has(pair.noun)" class="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-[#E5E7E5] bg-[#FBFCFB] px-3 text-left hover:border-[#7BB5A7] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]"><span class="text-sm font-bold text-[#173E3D]">{{ pair.noun.toLowerCase() }}</span><span class="text-sm font-extrabold text-[#0A6B6B]">{{ revealedPairs().has(pair.noun) ? '→ ' + pair.adjective.toLowerCase() : 'Reveal' }}</span></button> }</div></section>

          <aside aria-labelledby="mistakes-title" class="mt-5 rounded-2xl border-l-4 border-[#F5A623] bg-[#FFF4DC] p-5 shadow-sm sm:p-7"><p class="text-xs font-extrabold uppercase tracking-[.16em] text-[#805300]">A quick teacher tip</p><h2 id="mistakes-title" class="font-display mt-1 text-xl font-extrabold text-[#273A36]">Common mix-ups</h2><ul class="mt-3 space-y-3">@for (mistake of data.commonMistakes; track mistake.incorrect) { <li class="text-sm leading-6 text-[#273A36]"><span class="line-through decoration-[#A34426]">{{ mistake.incorrect }}</span> <span aria-hidden="true">→</span> <strong>{{ mistake.correct }}</strong><span class="block text-xs text-[#5A5143]">{{ mistake.note }}</span></li> }</ul></aside>

          <section aria-labelledby="recall-title" class="mt-5 rounded-2xl border border-[#DDE6E1] bg-white p-5 shadow-sm sm:p-7"><div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.16em] text-[#0A6B6B]">No points. Just a quick recall.</p><h2 id="recall-title" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Check in with yourself</h2></div><span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">Optional · ungraded</span></div><div class="mt-4 grid gap-3 sm:grid-cols-3">@for (question of selfCheck; track question.prompt) { <button type="button" (click)="toggleRecall(question.prompt)" [attr.aria-expanded]="recall().has(question.prompt)" class="min-h-24 rounded-xl border border-[#E5E7E5] bg-[#FAFCFB] p-4 text-left focus-visible:outline-2 focus-visible:outline-[#0A6B6B]"><span class="block text-sm font-bold text-[#173E3D]">{{ question.prompt }}</span>@if (recall().has(question.prompt)) { <span class="mt-2 block text-sm font-extrabold text-[#0A6B6B]">{{ question.answer }}</span> } @else { <span class="mt-2 block text-xs text-[#64716F]">Tap to reveal</span> }</button> }</div></section>

          <footer class="my-7 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#0B3B3B] p-5 text-white sm:flex-row sm:items-center sm:p-6"><div><p class="font-display text-xl font-extrabold">You’ve got this.</p><p class="mt-1 text-sm text-white/85">Ready to see these words in action?</p></div><a [routerLink]="['/2-bac/unit', unitId(), 'vocabulary', 'exercises']" class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#F5A623] px-5 font-extrabold text-[#273A36] hover:bg-[#F7B94B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">Ready to practice <span class="ml-2" aria-hidden="true">→</span></a></footer>
        }
      </div>
    </main>
  `,
})
export class VocabularyLessonComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  protected readonly unitId = computed(() => Number(this.route.snapshot.paramMap.get('unitId')) || 1);
  protected readonly lesson = signal<VocabularyLesson | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly showGlosses = signal(false);
  protected readonly flipped = signal(new Set<string>());
  protected readonly known = signal(new Set<string>());
  protected readonly revealedPairs = signal(new Set<string>());
  protected readonly recall = signal(new Set<string>());
  protected readonly clusters = computed(() => {
    const words = this.lesson()?.words ?? [];
    const ordered = ['Energy & Initiative', 'Mind & Creativity', 'Character & Growth'];
    return ordered.map((name) => ({ name, slug: name.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and'), words: words.filter((word) => word.cluster === name) })).filter((cluster) => cluster.words.length);
  });
  protected readonly contextParts = computed<ContextPart[]>(() => {
    const lesson = this.lesson();
    if (!lesson) return [];
    const byWord = new Map(lesson.words.map((word) => [word.word.toLowerCase(), word]));
    const pattern = new RegExp(`\\b(${lesson.words.map((word) => word.word).sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi');
    const parts: ContextPart[] = [];
    let last = 0;
    for (const match of lesson.contextParagraph.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > last) parts.push({ text: lesson.contextParagraph.slice(last, index), word: null });
      const text = match[0];
      parts.push({ text, word: byWord.get(text.toLowerCase()) ?? null });
      last = index + text.length;
    }
    if (last < lesson.contextParagraph.length) parts.push({ text: lesson.contextParagraph.slice(last), word: null });
    return parts;
  });
  protected readonly selfCheck = [
    { prompt: 'What is the adjective of vigour?', answer: 'Vigorous' },
    { prompt: 'Which noun means the quality of being reliable?', answer: 'Reliability' },
    { prompt: 'Complete: fulfil your ____.', answer: 'Ambition' },
  ];

  constructor() { this.loadLesson(); }

  protected loadLesson(): void {
    this.loading.set(true); this.error.set('');
    this.http.get<VocabularyLesson>(`/api/vocabulary/unit/${this.unitId()}`).subscribe({
      next: (lesson) => { this.lesson.set(lesson); this.loading.set(false); },
      error: () => { this.error.set('Please check your connection and try again.'); this.loading.set(false); },
    });
  }
  protected toggleFlip(word: string): void { this.flipped.update((state) => { const next = new Set(state); next.has(word) ? next.delete(word) : next.add(word); return next; }); }
  protected showWord(word: string): void {
    this.flipped.update((state) => new Set(state).add(word));
    this.scrollToWord(word);
  }
  protected toggleKnown(word: string): void { this.known.update((state) => { const next = new Set(state); next.has(word) ? next.delete(word) : next.add(word); return next; }); }
  protected revealPair(noun: string): void { this.revealedPairs.update((state) => new Set(state).add(noun)); }
  protected toggleRecall(prompt: string): void { this.recall.update((state) => { const next = new Set(state); next.has(prompt) ? next.delete(prompt) : next.add(prompt); return next; }); }
  protected scrollToWord(word: string): void {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    document.querySelector(`[data-vocabulary-word="${CSS.escape(word)}"]`)?.scrollIntoView({ behavior, block: 'center' });
  }
}
