import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PracticeQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

@Component({
  selector: 'app-grammar-lesson',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .full-motion .verb-push { transform: translateX(0.65rem); }
    .full-motion .to-particle { animation: nudge-in 500ms ease-out both; }
    .bare-motion .to-crossed { opacity: 1; transform: rotate(-12deg) scale(1); }
    .bare-motion .case-verb { animation: case-bounce 500ms ease-out both; }
    .silent-motion .silent-e { animation: fade-away 650ms ease-in forwards; }
    .silent-motion .ing-slide { animation: slide-in 500ms 350ms ease-out both; }
    .cvc-motion .duplicate-t { animation: drop-in 500ms ease-out both; }
    .cvc-motion .cvc-ing { animation: slide-in 450ms 300ms ease-out both; }
    .to-particle, .silent-e, .ing-slide, .duplicate-t, .cvc-ing { display: inline-block; }
    .to-crossed { opacity: .28; transform: rotate(0) scale(.9); transition: opacity 250ms ease, transform 250ms ease; text-decoration: line-through; }
    .duplicate-t, .cvc-ing, .ing-slide { opacity: 0; }
    @keyframes nudge-in { from { opacity: .25; transform: translateX(-.5rem); } to { opacity: 1; transform: translateX(0); } }
    @keyframes case-bounce { 0% { transform: translateY(-.55rem); } 65% { transform: translateY(.2rem); } 100% { transform: translateY(0); } }
    @keyframes fade-away { to { opacity: 0; transform: translateY(-.6rem); } }
    @keyframes slide-in { from { opacity: 0; transform: translateX(-.6rem); } to { opacity: 1; transform: translateX(0); } }
    @keyframes drop-in { from { opacity: 0; transform: translateY(-1rem); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
  `],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac/unit/1" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Unit 1</a>

        <header class="mt-6 rounded-2xl border border-[#E5E7E5] bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-9">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C56D]">2BAC English · Ticket to English 2 · Unit 1</p>
          <h1 class="font-display mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Grammar: The Power of Verbs.</h1>
          <p class="mt-4 max-w-3xl leading-7 text-white/85">A verb can change its form depending on the word or verb that comes before it. Learn when to use <strong class="text-white">to + verb</strong>, a <strong class="text-white">bare verb</strong>, or a <strong class="text-white">verb + ing</strong>.</p>
          <a href="#full-infinitive" class="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#F5A623] px-5 text-sm font-extrabold text-[#273A36] hover:bg-[#F7B94B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start the lesson <span class="ml-2" aria-hidden="true">↓</span></a>
        </header>

        <nav aria-label="Lesson sections" class="sticky top-0 z-10 -mx-4 mt-5 overflow-x-auto border-y border-[#E1E6E3] bg-[#F7F5F0]/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3">
          <ul class="flex min-w-max gap-2 text-sm font-semibold">
            <li><a href="#full-infinitive" class="inline-flex min-h-10 items-center rounded-lg px-3 text-[#0A6B6B] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Full infinitive</a></li>
            <li><a href="#bare-infinitive" class="inline-flex min-h-10 items-center rounded-lg px-3 text-[#0A6B6B] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Bare infinitive</a></li>
            <li><a href="#gerund" class="inline-flex min-h-10 items-center rounded-lg px-3 text-[#0A6B6B] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Gerunds</a></li>
            <li><a href="#spelling-rules" class="inline-flex min-h-10 items-center rounded-lg px-3 text-[#0A6B6B] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Spelling rules</a></li>
            <li><a href="#practice-check" class="inline-flex min-h-10 items-center rounded-lg px-3 text-[#0A6B6B] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Practice check</a></li>
          </ul>
        </nav>

        <section id="full-infinitive" aria-labelledby="full-title" class="scroll-mt-24 mt-6 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">01 · The form with “to”</p><h2 id="full-title" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Full Infinitive</h2></div>
            <span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold text-[#075B5B]">to + base verb</span>
          </div>
          <p class="mt-4 max-w-3xl leading-7">We use <strong>to + base verb</strong> after certain verbs, such as <em>want, decide, hope, plan, need,</em> and <em>promise</em>.</p>
          <ul class="mt-4 grid gap-3 sm:grid-cols-3">
            @for (example of fullExamples; track example) { <li class="rounded-xl border border-[#E6ECE9] bg-[#FAFCFB] p-4 text-base leading-7 text-[#183E3D]">{{ example }}</li> }
          </ul>
          <div class="mt-5 rounded-xl border border-[#DDE9E4] bg-[#F4F9F6] p-4 sm:p-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-[#526260]">Watch “to” lead the verb</p>
                <p class="sr-only" aria-live="polite">{{ fullMotion() ? 'To moves forward and pushes study.' : 'To comes before study.' }}</p>
                <div aria-hidden="true" class="mt-3 flex items-center gap-1 font-mono text-3xl font-extrabold tracking-wide text-[#0B3B3B]">
                  <span class="to-particle rounded-md bg-[#DDF1EA] px-2 py-1 text-[#0A6B6B]">to</span>
                  <span [class.verb-push]="fullMotion()" class="verb-push rounded-md px-2 py-1 transition-transform duration-500">study</span>
                </div>
              </div>
              <button type="button" (click)="playFullMotion()" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ fullMotion() ? 'Replay movement' : 'Show the movement' }}</button>
            </div>
          </div>
        </section>

        <section id="bare-infinitive" aria-labelledby="bare-title" class="scroll-mt-24 mt-5 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">02 · The form without “to”</p><h2 id="bare-title" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Bare Infinitive</h2></div>
            <span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold text-[#075B5B]">base verb</span>
          </div>
          <p class="mt-4 max-w-3xl leading-7">We use the base verb without <em>to</em> after modal verbs such as <em>can, must, should, might,</em> and <em>will</em>, and after <em>make</em> or <em>let</em>.</p>
          <ul class="mt-4 grid gap-3 sm:grid-cols-2">
            @for (example of bareExamples; track example) { <li class="rounded-xl border border-[#E6ECE9] bg-[#FAFCFB] p-4 text-base leading-7 text-[#183E3D]">{{ example }}</li> }
          </ul>
          <div class="mt-5 rounded-xl border border-[#E7E3D8] bg-[#FCFAF5] p-4 sm:p-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-[#526260]">Pack the verb. Leave “to” behind.</p>
                <p class="sr-only" aria-live="polite">{{ bareMotion() ? 'The verb is packed without to.' : 'A verb is ready to go in the suitcase.' }}</p>
                <div [class.bare-motion]="bareMotion()" class="mt-4 inline-flex min-h-24 items-center gap-4 rounded-xl border-2 border-dashed border-[#B8C9C2] bg-white p-4">
                  <span class="relative inline-flex h-12 items-center rounded-md bg-[#FFF0D1] px-2 text-lg font-bold text-[#805300]"><span class="to-crossed">to</span></span>
                  <span class="text-xl font-bold text-[#70807C]" aria-hidden="true">→</span>
                  <span class="case-verb inline-flex min-h-14 min-w-28 items-center justify-center rounded-lg border-2 border-[#0A6B6B] bg-[#E8F2F0] px-4 font-mono text-2xl font-extrabold text-[#075B5B]">go</span>
                  <span class="sr-only">Verb suitcase</span>
                </div>
              </div>
              <button type="button" (click)="playBareMotion()" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">{{ bareMotion() ? 'Reset example' : 'Pack the verb' }}</button>
            </div>
          </div>
        </section>

        <section id="gerund" aria-labelledby="gerund-title" class="scroll-mt-24 mt-5 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">03 · Verb acting like a noun</p><h2 id="gerund-title" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Gerund</h2></div>
            <span class="rounded-full bg-[#FFF2D9] px-3 py-1 text-xs font-bold text-[#805300]">verb + <span class="text-[#B66B00]">-ing</span></span>
          </div>
          <p class="mt-4 max-w-3xl leading-7">A gerund is a verb ending in <strong class="text-[#A85F00]">-ing</strong> that acts like a noun. Use it after verbs such as <em>enjoy, avoid, suggest, mind,</em> and <em>finish</em>, and after prepositions such as <em>in, at, on,</em> and <em>for</em>.</p>
          <ul class="mt-4 grid gap-3 sm:grid-cols-3">
            @for (example of gerundExamples; track example.lead) {
              <li class="rounded-xl border border-[#F0E5CF] bg-[#FFFCF6] p-4 text-base leading-7 text-[#183E3D]">{{ example.lead }} <strong class="text-[#A85F00]">{{ example.gerund }}</strong>{{ example.tail }}</li>
            }
          </ul>
        </section>

        <section id="spelling-rules" aria-labelledby="spelling-title" class="scroll-mt-24 mt-5 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#A86400]">04 · Make the -ing form</p>
          <h2 id="spelling-title" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Golden Spelling Rules</h2>
          <p class="mt-3 max-w-3xl leading-7">Look at the end of the base verb before adding <strong class="text-[#A85F00]">-ing</strong>. Use these three patterns to spell the gerund correctly.</p>

          <div class="mt-6 grid gap-4 lg:grid-cols-2">
            <article class="rounded-2xl border border-[#E5E7E5] bg-[#FBFCFB] p-5 sm:p-6">
              <div class="flex items-start justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wide text-[#0A6B6B]">Rule 1</p><h3 class="font-display mt-1 text-xl font-bold text-[#0B3B3B]">The Silent E</h3></div><span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold text-[#075B5B]">drop e + ing</span></div>
              <p class="mt-3 leading-6">If the verb ends in <strong>e</strong>, drop the <strong>e</strong> and add <strong class="text-[#A85F00]">-ing</strong>.</p>
              <div class="mt-4 rounded-xl border border-[#E5E7E5] bg-white p-4">
                <p class="text-xs font-bold uppercase tracking-wide text-[#64716F]">LIKE changes to LIKING</p>
                <p class="sr-only" aria-live="polite">{{ silentEMotion() ? 'The e fades away. I N G slides in. The result is liking.' : 'The base word is like.' }}</p>
                <div [class.silent-motion]="silentEMotion()" class="mt-3 flex min-h-14 items-center gap-0 font-mono text-2xl font-extrabold tracking-wide sm:text-3xl" aria-hidden="true">
                  <span class="text-[#0B3B3B]">LIK</span><span class="silent-e rounded bg-[#FFF0D1] px-1 text-[#805300]">E</span><span class="ing-slide ml-1 rounded bg-[#FFF2D9] px-1 text-[#A85F00]">ING</span>
                </div>
                <button type="button" (click)="playSilentE()" class="mt-3 inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-bold text-[#0A6B6B] underline underline-offset-4 hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ silentEMotion() ? 'Replay spelling change' : 'Show spelling change' }}</button>
              </div>
              <div class="mt-4 rounded-lg bg-[#F4F7F5] p-3"><div class="flex items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-wide text-[#526260]" aria-live="polite">Example {{ silentExampleIndex() + 1 }} of {{ silentExamples.length }}</p><div class="flex gap-1"><button type="button" (click)="previousSilentExample()" [disabled]="silentExampleIndex() === 0" aria-label="Previous silent e example" class="min-h-9 min-w-9 rounded-md border border-[#D3DDD8] text-sm font-bold text-[#173E3D] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">←</button><button type="button" (click)="nextSilentExample()" [disabled]="silentExampleIndex() === silentExamples.length - 1" aria-label="Next silent e example" class="min-h-9 min-w-9 rounded-md border border-[#D3DDD8] text-sm font-bold text-[#173E3D] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">→</button></div></div><p class="mt-2 text-lg font-bold text-[#0B3B3B]">{{ silentExamples[silentExampleIndex()].base }} <span aria-hidden="true">→</span> <span class="text-[#A85F00]">{{ silentExamples[silentExampleIndex()].gerund }}</span></p></div>
            </article>

            <article class="rounded-2xl border border-[#E5E7E5] bg-[#FBFCFB] p-5 sm:p-6">
              <div class="flex items-start justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wide text-[#0A6B6B]">Rule 2</p><h3 class="font-display mt-1 text-xl font-bold text-[#0B3B3B]">The CVC Rule</h3></div><span class="rounded-full bg-[#E8F2F0] px-3 py-1 text-xs font-bold text-[#075B5B]">double + ing</span></div>
              <p class="mt-3 leading-6">For a short verb ending in consonant–vowel–consonant, double the last consonant and add <strong class="text-[#A85F00]">-ing</strong>.</p>
              <div class="mt-4 rounded-xl border border-[#E5E7E5] bg-white p-4">
                <p class="text-xs font-bold uppercase tracking-wide text-[#64716F]">G–E–T changes to GETTING</p>
                <div class="mt-2 flex flex-wrap gap-2 text-xs font-semibold"><span class="rounded bg-[#DBEAFE] px-2 py-1 text-[#1D4ED8]">Blue = consonant</span><span class="rounded bg-[#FEF3C7] px-2 py-1 text-[#805300]">Orange = vowel</span></div>
                <p class="sr-only" aria-live="polite">{{ cvcMotion() ? 'The final consonant t doubles, then i n g slides in. The result is getting.' : 'G is a consonant, E is a vowel, and T is a consonant.' }}</p>
                <div [class.cvc-motion]="cvcMotion()" class="mt-4 flex min-h-16 items-center gap-0 font-mono text-2xl font-extrabold tracking-wide sm:text-3xl" aria-hidden="true">
                  <span class="rounded bg-[#DBEAFE] px-1 text-[#1D4ED8]">G</span><span class="rounded bg-[#FEF3C7] px-1 text-[#805300]">E</span><span class="rounded bg-[#DBEAFE] px-1 text-[#1D4ED8]">T</span><span class="duplicate-t rounded bg-[#DBEAFE] px-1 text-[#1D4ED8]">T</span><span class="cvc-ing ml-1 rounded bg-[#FFF2D9] px-1 text-[#A85F00]">ING</span>
                </div>
                <button type="button" (click)="playCvc()" class="mt-2 inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-bold text-[#0A6B6B] underline underline-offset-4 hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">{{ cvcMotion() ? 'Replay spelling change' : 'Show the double consonant' }}</button>
              </div>
              <div class="mt-4 rounded-lg bg-[#F4F7F5] p-3"><div class="flex items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-wide text-[#526260]" aria-live="polite">Example {{ cvcExampleIndex() + 1 }} of {{ cvcExamples.length }}</p><div class="flex gap-1"><button type="button" (click)="previousCvcExample()" [disabled]="cvcExampleIndex() === 0" aria-label="Previous CVC example" class="min-h-9 min-w-9 rounded-md border border-[#D3DDD8] text-sm font-bold text-[#173E3D] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">←</button><button type="button" (click)="nextCvcExample()" [disabled]="cvcExampleIndex() === cvcExamples.length - 1" aria-label="Next CVC example" class="min-h-9 min-w-9 rounded-md border border-[#D3DDD8] text-sm font-bold text-[#173E3D] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">→</button></div></div><p class="mt-2 text-lg font-bold text-[#0B3B3B]">{{ cvcExamples[cvcExampleIndex()].base }} <span aria-hidden="true">→</span> <span class="text-[#A85F00]">{{ cvcExamples[cvcExampleIndex()].gerund }}</span></p></div>
            </article>
          </div>

          <article class="mt-4 rounded-2xl border border-[#E5E7E5] bg-[#FBFCFB] p-5 sm:p-6">
            <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wide text-[#0A6B6B]">Rule 3</p><h3 class="font-display mt-1 text-xl font-bold text-[#0B3B3B]">The Normal Rule</h3></div><span class="rounded-full bg-[#FFF2D9] px-3 py-1 text-xs font-bold text-[#805300]">base verb + ing</span></div>
            <p class="mt-3 leading-6">For most verbs, simply add <strong class="text-[#A85F00]">-ing</strong>.</p>
            <ul class="mt-4 grid gap-3 sm:grid-cols-3">@for (example of normalExamples; track example.base) { <li class="rounded-xl border border-[#E6ECE9] bg-white p-4 text-lg font-bold text-[#0B3B3B]">{{ example.base }} <span aria-hidden="true">→</span> <span class="text-[#A85F00]">{{ example.gerund }}</span></li> }</ul>
          </article>
        </section>

        <section id="practice-check" aria-labelledby="practice-title" class="scroll-mt-24 mt-5 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">05 · Check what you know</p><h2 id="practice-title" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Practice Check</h2></div><span class="rounded-full bg-[#F4F7F5] px-3 py-1 text-xs font-bold text-[#526260]">3 questions · optional</span></div>
          <p class="mt-3 leading-6">Choose the form that completes each sentence. You can change your answers until you check them.</p>
          <div class="mt-5 space-y-4">
            @for (question of quizQuestions; track question.id; let questionIndex = $index) {
              <fieldset class="rounded-xl border border-[#E5E7E5] p-4 sm:p-5">
                <legend class="px-1 text-base font-bold text-[#173E3D]">{{ questionIndex + 1 }}. {{ question.prompt }}</legend>
                <div class="mt-2 grid gap-2 sm:grid-cols-3">
                  @for (option of question.options; track option) {
                    <label class="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#D8E0DC] px-3 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]">
                      <input type="radio" [name]="question.id" [value]="option" [checked]="quizAnswers()[question.id] === option" (change)="setQuizAnswer(question.id, option)" [disabled]="quizChecked()" class="h-4 w-4 accent-[#0A6B6B]">
                      <span class="text-sm font-semibold text-[#173E3D]">{{ option }}</span>
                    </label>
                  }
                </div>
                @if (quizChecked()) {
                  <p class="mt-3 rounded-lg p-3 text-sm font-semibold" role="status" [class.bg-[#E8F3EC]]="quizAnswers()[question.id] === question.answer" [class.text-[#176346]]="quizAnswers()[question.id] === question.answer" [class.bg-[#FFF4DC]]="quizAnswers()[question.id] !== question.answer" [class.text-[#805300]]="quizAnswers()[question.id] !== question.answer">{{ quizAnswers()[question.id] === question.answer ? 'Correct.' : 'Not quite.' }} {{ question.explanation }}</p>
                }
              </fieldset>
            }
          </div>
          @if (!quizChecked()) {
            <button type="button" (click)="checkQuiz()" [disabled]="!quizComplete()" class="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#084F4F] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Check answers</button>
            @if (!quizComplete()) { <p class="mt-2 text-sm text-[#667575]">Choose one answer for each question to check your work.</p> }
          } @else {
            <div class="mt-5 flex flex-wrap items-center gap-3"><p class="text-sm font-bold text-[#173E3D]" role="status">You got {{ quizScore() }} out of {{ quizQuestions.length }} correct. Keep practicing—you’re making progress.</p><button type="button" (click)="resetQuiz()" class="min-h-11 rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] hover:bg-[#F0F7F4] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Try again</button></div>
          }
        </section>

        <footer class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7E5] bg-white px-4 py-4 text-sm">
          <p><span class="font-semibold text-[#0B3B3B]">Lesson complete?</span> You can return to the other Unit 1 skills at any time.</p>
          <a routerLink="/2-bac/unit/1" class="inline-flex min-h-10 items-center rounded-lg px-3 font-bold text-[#0A6B6B] underline underline-offset-4 hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-[#0A6B6B]">Back to Unit 1</a>
        </footer>
      </div>
    </main>
  `,
})
export class GrammarLessonComponent {
  protected readonly fullExamples = ['I want to study.', 'She decided to help.', 'They hope to win.'];
  protected readonly bareExamples = ['You must go.', 'I can help.', 'She made me cry. (No “to” after make.)', 'Let me try.'];
  protected readonly gerundExamples = [
    { lead: 'I enjoy ', gerund: 'reading', tail: '.' },
    { lead: 'She is good at ', gerund: 'painting', tail: '.' },
    { lead: 'They avoid ', gerund: 'making mistakes', tail: '.' },
  ];
  protected readonly silentExamples = [{ base: 'take', gerund: 'taking' }, { base: 'write', gerund: 'writing' }, { base: 'dance', gerund: 'dancing' }];
  protected readonly cvcExamples = [{ base: 'sit', gerund: 'sitting' }, { base: 'shop', gerund: 'shopping' }, { base: 'run', gerund: 'running' }];
  protected readonly normalExamples = [{ base: 'play', gerund: 'playing' }, { base: 'go', gerund: 'going' }, { base: 'read', gerund: 'reading' }];
  protected readonly quizQuestions: PracticeQuestion[] = [
    { id: 'infinitive', prompt: 'I want ___ (go) home.', options: ['to go', 'going', 'go'], answer: 'to go', explanation: 'Use the full infinitive after want: want to go.' },
    { id: 'gerund', prompt: 'She enjoys ___ (read) books.', options: ['to read', 'reading', 'read'], answer: 'reading', explanation: 'Use a gerund after enjoy: enjoys reading.' },
    { id: 'bare', prompt: 'You must ___ (study) hard.', options: ['to study', 'studying', 'study'], answer: 'study', explanation: 'Use the bare infinitive after must: must study.' },
  ];
  protected readonly fullMotion = signal(false);
  protected readonly bareMotion = signal(false);
  protected readonly silentEMotion = signal(false);
  protected readonly cvcMotion = signal(false);
  protected readonly silentExampleIndex = signal(0);
  protected readonly cvcExampleIndex = signal(0);
  protected readonly quizAnswers = signal<Record<string, string>>({});
  protected readonly quizChecked = signal(false);

  protected playFullMotion(): void { this.fullMotion.set(false); requestAnimationFrame(() => this.fullMotion.set(true)); }
  protected playBareMotion(): void { this.bareMotion.update((active) => !active); }
  protected playSilentE(): void { this.silentEMotion.set(false); requestAnimationFrame(() => this.silentEMotion.set(true)); }
  protected playCvc(): void { this.cvcMotion.set(false); requestAnimationFrame(() => this.cvcMotion.set(true)); }
  protected nextSilentExample(): void { this.silentExampleIndex.update((index) => Math.min(index + 1, this.silentExamples.length - 1)); }
  protected previousSilentExample(): void { this.silentExampleIndex.update((index) => Math.max(index - 1, 0)); }
  protected nextCvcExample(): void { this.cvcExampleIndex.update((index) => Math.min(index + 1, this.cvcExamples.length - 1)); }
  protected previousCvcExample(): void { this.cvcExampleIndex.update((index) => Math.max(index - 1, 0)); }
  protected setQuizAnswer(id: string, answer: string): void { this.quizAnswers.update((answers) => ({ ...answers, [id]: answer })); }
  protected quizComplete(): boolean { return this.quizQuestions.every((question) => Boolean(this.quizAnswers()[question.id])); }
  protected checkQuiz(): void { if (this.quizComplete()) this.quizChecked.set(true); }
  protected quizScore(): number { return this.quizQuestions.filter((question) => this.quizAnswers()[question.id] === question.answer).length; }
  protected resetQuiz(): void { this.quizAnswers.set({}); this.quizChecked.set(false); }
}
