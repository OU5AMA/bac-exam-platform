import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { LoginGateModalComponent } from '../../shared/login-gate-modal.component';
import { COURSE_UNITS } from './unit-data';
import { LoginGateService, SaveChoice } from '../../shared/login-gate.service';

interface StoryFeedback {
  positives: string[];
  negatives: string[];
  score: number;
  maxScore: number;
}

interface StorySentence {
  id: string;
  text: string;
}

const STORY_STAGES = [
  { label: 'Setting', guide: 'Who is there? When and where does it happen?' },
  { label: 'Build-up', guide: 'What was happening before the problem?' },
  { label: 'Climax', guide: 'What surprising or funny moment happens?' },
  { label: 'Reaction', guide: 'What do the people do or say next?' },
  { label: 'Closing', guide: 'What one sentence finishes the story?' },
];

const SCRAMBLED_STORY: StorySentence[] = [
  { id: 'reaction', text: 'We laughed, opened a window, and ordered another pizza.' },
  { id: 'build-up-2', text: 'We forgot to set a timer because we started playing a board game.' },
  { id: 'setting', text: 'On Saturday evening, my family decided to make a pizza at home.' },
  { id: 'climax', text: 'Suddenly, our cat ran into the room with a slice of pizza in its mouth.' },
  { id: 'build-up-1', text: 'While my mother was cutting vegetables, my brother was reading the recipe.' },
];

const CORRECT_ORDER = ['setting', 'build-up-1', 'build-up-2', 'climax', 'reaction'];
const DEFAULT_PLAN: Record<string, string> = Object.fromEntries(STORY_STAGES.map(({ label }) => [label, '']));

@Component({
  selector: 'app-writing-short-story',
  standalone: true,
  imports: [FormsModule, RouterLink, LoginGateModalComponent],
  template: `
    <app-login-gate-modal />
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-8 text-[#4B5B5B] sm:px-8 sm:py-10">
      <div class="mx-auto max-w-5xl">
        <a [routerLink]="['/2-bac', 'unit', unitId(), 'writing', 'lesson']" class="inline-flex min-h-11 items-center rounded-sm font-semibold text-[#0A6B6B] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Back to Writing</a>
        <header class="mt-5 rounded-3xl bg-[#0B3B3B] p-6 text-white sm:p-9">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#BDE3D6]">Unit {{ unitId() }} · Writing</p>
          <h1 class="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Short Story Writing</h1>
          <p class="mt-3 max-w-2xl leading-7 text-white/85">Use five simple stages to plan one incident, build to a surprise, and finish your story.</p>
          <div class="mt-6" role="group" aria-label="Lesson progress">
            <div class="flex items-center justify-between text-sm font-semibold"><span>Lesson progress</span><span>{{ completedCount() }} of 7 steps</span></div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20"><div class="h-full rounded-full bg-[#F5A623] transition-[width]" [style.width.%]="progressPercent()"></div></div>
          </div>
        </header>

        <nav aria-label="Short story lesson steps" class="mt-5 overflow-x-auto pb-2">
          <ol class="flex min-w-max gap-2">
            @for (title of cardTitles; track title; let index = $index) {
              <li><button type="button" (click)="goTo(index)" [disabled]="index > step()" [attr.aria-current]="step() === index ? 'step' : null" class="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-not-allowed disabled:opacity-50" [class.border-[#0A6B6B]]="step() === index" [class.bg-[#0A6B6B]]="step() === index" [class.text-white]="step() === index" [class.border-[#D7E4DE]]="step() !== index" [class.bg-white]="step() !== index"><span class="flex h-6 w-6 items-center justify-center rounded-full text-xs" [class.bg-[#0B3B3B]]="completed().includes(index)" [class.text-white]="completed().includes(index)" [class.bg-[#E8F2F0]]="!completed().includes(index)">{{ completed().includes(index) ? '✓' : index + 1 }}</span>{{ title }}</button></li>
            }
          </ol>
        </nav>

        <section class="mt-4 rounded-3xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8" aria-live="polite">
          @switch (step()) {
            @case (0) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 1 · Understand</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">What is a short story?</h2>
              <p class="mt-4 max-w-3xl text-lg leading-8">A short story tells about <strong>one incident</strong>, with a clear beginning, middle, and end. It often has a twist or surprise near the end.</p>
              <ul class="mt-5 list-disc space-y-3 pl-6 leading-7">
                <li>A story happens in order: first, next, and finally.</li>
                <li>A paragraph describes a person, place, or idea; a story shows what happens.</li>
                <li>Keep the story focused on one main incident.</li>
              </ul>
              <button type="button" (click)="next()" class="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to the story shape →</button>
            }
            @case (1) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 2 · See the shape</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Story Roller Coaster</h2>
              <p class="mt-2 leading-7">A story rises to its biggest moment, then comes gently back down.</p>
              <div class="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end sm:gap-2" aria-label="Roller coaster story structure">
                @for (stage of rollerStages; track stage.label; let index = $index) {
                  <article class="relative rounded-2xl border border-[#D9E8E2] bg-[#F7F5F0] p-4 sm:text-center" [class.sm:mb-0]="index === 0 || index === 4" [class.sm:mb-8]="index === 1 || index === 3" [class.sm:mb-16]="index === 2">
                    <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A6B6B] font-bold text-white" aria-hidden="true">{{ index + 1 }}</span>
                    <p class="mt-3 text-xs font-bold uppercase tracking-wide text-[#0A6B6B]">{{ stage.ride }}</p>
                    <h3 class="font-display mt-1 text-lg font-extrabold text-[#0B3B3B]">{{ stage.label }}</h3>
                    <p class="mt-2 text-sm leading-6">{{ stage.explanation }}</p>
                  </article>
                }
              </div>
              <div class="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold text-[#0B3B3B]" aria-label="Story stage order"><span>Setting</span><span aria-hidden="true">→</span><span>Build-up</span><span aria-hidden="true">→</span><span>Climax</span><span aria-hidden="true">→</span><span>Reaction</span><span aria-hidden="true">→</span><span>Closing</span></div>
              <button type="button" (click)="next()" class="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to the model →</button>
            }
            @case (2) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 3 · Read the model</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">A little accident with the hose</h2>
              <div class="mt-5 space-y-3 leading-7">
                <p class="rounded-lg border-l-4 border-[#0A6B6B] bg-[#F1F8F5] p-4"><span class="mb-1 block text-xs font-extrabold uppercase tracking-wider text-[#0A6B6B]">Setting · teal underline</span><span class="underline decoration-2 decoration-[#0A6B6B] underline-offset-4">Last summer, my brother and I were washing our father's car in the garden.</span></p>
                <p class="rounded-lg border-l-4 border-[#F5A623] bg-[#FFF7E8] p-4"><span class="mb-1 block text-xs font-extrabold uppercase tracking-wider text-[#8A5300]">Build-up · orange highlight</span><span class="bg-[#F5A623]/30">While he was rinsing the roof, I was holding the hose at the other end, not paying attention. Then our little dog ran past, and I turned to see where it had gone.</span></p>
                <p class="rounded-lg bg-[#F7F5F0] p-4"><span class="mb-1 block text-xs font-extrabold uppercase tracking-wider text-[#0B3B3B]">Climax · the twist</span><strong>Suddenly, my brother shouted my name, and I turned around—right into the full blast of water!</strong></p>
                <p class="rounded-lg border-l-4 border-[#0A6B6B] bg-[#F1F8F5] p-4"><span class="mb-1 block text-xs font-extrabold uppercase tracking-wider text-[#0A6B6B]">Reaction · teal</span><span class="text-[#0A6B6B]">We were both soaked from head to toe. My brother laughed and handed me a towel.</span></p>
                <p class="rounded-lg border-l-4 border-[#F5A623] bg-[#FFF7E8] p-4"><span class="mb-1 block text-xs font-extrabold uppercase tracking-wider text-[#8A5300]">Closing · orange underline</span><span class="underline decoration-2 decoration-[#F5A623] underline-offset-4">We still laugh about it today.</span></p>
              </div>
              <p class="mt-5 rounded-xl bg-[#E8F2F0] p-4 text-sm font-semibold leading-6 text-[#0B3B3B]">Notice: Past Continuous for background, Past Simple for main events.</p>
              <button type="button" (click)="next()" class="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to planning →</button>
            }
            @case (3) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 4 · Plan your ideas</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The Simple Planning Chart</h2>
              <p class="mt-2 leading-7">Write one sentence in each row. Your notes are saved on this device.</p>
              <div class="mt-5 overflow-hidden rounded-xl border border-[#D9E1DE]">
                <div class="hidden grid-cols-[minmax(12rem,0.8fr)_2fr] bg-[#E8F2F0] px-4 py-3 text-sm font-bold text-[#0B3B3B] sm:grid"><span>Stage</span><span>Your note</span></div>
                @for (stage of stages; track stage.label) {
                  <label class="grid gap-2 border-t border-[#D9E1DE] p-4 sm:grid-cols-[minmax(12rem,0.8fr)_2fr] sm:items-center">
                    <span class="font-semibold text-[#0B3B3B]">{{ stage.label }} <span class="block text-xs font-normal text-[#5B6B68]">{{ stage.guide }}</span></span>
                    <input type="text" [value]="plan()[stage.label]" (input)="updatePlan(stage.label, $any($event.target).value)" [attr.aria-label]="stage.label + ' note'" maxlength="240" class="min-h-11 w-full rounded-lg border border-[#AAB8B4] bg-white px-3 text-[#243434] placeholder:text-[#687674] focus:border-[#0A6B6B] focus:outline-2 focus:outline-offset-2 focus:outline-[#0A6B6B]" placeholder="Write one sentence…" />
                  </label>
                }
              </div>
              <p class="mt-3 text-sm font-semibold text-[#0A6B6B]">Fill this first. Then your story writes itself.</p>
              <button type="button" (click)="next()" class="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to tenses →</button>
            }
            @case (4) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 5 · Check your tenses</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Tenses Quick Reference</h2>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <article class="rounded-2xl bg-[#E8F2F0] p-5"><h3 class="font-display text-lg font-extrabold text-[#0B3B3B]">Past Continuous</h3><p class="mt-2 leading-6">Background action in progress: <strong>was/were + -ing</strong>.</p><p class="mt-3 rounded-lg bg-white p-3 italic">I was walking home.</p></article>
                <article class="rounded-2xl bg-[#FFF3DB] p-5"><h3 class="font-display text-lg font-extrabold text-[#0B3B3B]">Past Simple</h3><p class="mt-2 leading-6">Main events that are finished.</p><p class="mt-3 rounded-lg bg-white p-3 italic">I dropped my bag.</p></article>
              </div>
              <p class="mt-4 rounded-xl border border-[#D9E8E2] p-4 leading-7"><strong>Use both:</strong> <em>While I was walking, I dropped my bag.</em></p>
              <p class="mt-4 rounded-xl border-l-4 border-[#F5A623] bg-[#FFF7E8] p-4 font-bold text-[#71420C]">Don't switch to present tense. The story is in the past.</p>
              <button type="button" (click)="next()" class="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to practice →</button>
            }
            @case (5) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 6 · Practice the order</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Order the Story</h2>
              <p class="mt-2 leading-7">Click each sentence in the order it should happen. Click a chosen sentence again to remove it.</p>
              <ol class="mt-5 space-y-3">
                @for (sentence of scrambledStory; track sentence.id) {
                  <li><button type="button" (click)="toggleSentence(sentence.id)" [attr.aria-pressed]="orderedIds().includes(sentence.id)" [disabled]="sequenceSubmitted()" class="flex min-h-14 w-full items-start gap-3 rounded-xl border p-4 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-default" [class.border-[#0A6B6B]]="orderedIds().includes(sentence.id)" [class.bg-[#E8F2F0]]="orderedIds().includes(sentence.id)" [class.border-[#D9E1DE]]="!orderedIds().includes(sentence.id)"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A6B6B] text-sm font-bold text-white">{{ orderNumber(sentence.id) || '＋' }}</span><span>{{ sentence.text }}</span></button></li>
                }
              </ol>
              @if (!sequenceSubmitted()) {
                <button type="button" (click)="checkSequence()" [disabled]="orderedIds().length !== 5" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F5A623] px-5 font-bold text-[#2E2718] hover:bg-[#E69A18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-not-allowed disabled:opacity-50">Check the order</button>
              } @else {
                <section class="mt-6 rounded-2xl border border-[#BFD9CF] bg-[#F1F8F5] p-5" aria-live="polite">
                  <h3 class="font-display text-lg font-extrabold text-[#0B3B3B]">{{ sequenceScore() }} / 5 sentences are in the right place</h3>
                  <p class="mt-1 text-sm">Your score was saved if you were signed in. You can keep practicing without saving.</p>
                  <ol class="mt-4 list-decimal space-y-2 pl-5 leading-6">@for (id of correctOrder; track id) { <li>{{ sentenceText(id) }}</li> }</ol>
                  @if (saveStatus() === 'saved') { <p class="mt-3 font-semibold text-[#176346]">✓ Score saved</p> }
                  @if (saveStatus() === 'skipped') { <p class="mt-3 font-semibold text-[#4B5B5B]">✓ Practice complete</p> }
                </section>
                <button type="button" (click)="next()" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Continue to your story →</button>
              }
            }
            @case (6) {
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Step 7 · Write your story</p>
              <h2 class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Independent Writing Task</h2>
              <p class="mt-3 rounded-xl bg-[#E8F2F0] p-4 font-semibold leading-7 text-[#0B3B3B]">{{ writingPrompt() }} Write 8–10 sentences using the five stages. Use your planning chart. Include one surprise or funny moment.</p>
              <div class="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
                <div>
                  <label for="story-draft" class="font-semibold text-[#0B3B3B]">Your story</label>
                  <textarea id="story-draft" [value]="storyText()" (input)="updateStory($any($event.target).value)" rows="11" maxlength="10000" aria-describedby="story-hint story-count" class="mt-2 min-h-64 w-full resize-y rounded-xl border border-[#AAB8B4] bg-white p-4 leading-7 text-[#243434] focus:border-[#0A6B6B] focus:outline-2 focus:outline-offset-2 focus:outline-[#0A6B6B]" placeholder="Write your story in the past tense…"></textarea>
                  <div class="mt-2 flex flex-wrap justify-between gap-2 text-sm"><p id="story-hint">Aim for 8–10 sentences and keep the action in the past.</p><p id="story-count">{{ storyText().length }} / 10,000 characters</p></div>
                  @if (loginRequired()) { <p class="mt-3 rounded-lg bg-[#FFF3DB] p-3 font-semibold text-[#71420C]" role="status">Sign in to submit for AI feedback.</p> }
                  @if (error()) { <p class="mt-3 rounded-lg bg-[#FDECEA] p-3 text-[#7A1810]" role="alert">{{ error() }}</p> }
                  <button type="button" (click)="submitStory()" [disabled]="loading() || storyText().trim().length < 20" [attr.aria-busy]="loading()" class="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623] disabled:cursor-not-allowed disabled:opacity-50">{{ loading() ? 'Reading your story…' : 'Get AI feedback' }}</button>
                </div>
                <aside aria-label="Five story stages reminder" class="rounded-2xl bg-[#F7F5F0] p-4">
                  <h3 class="font-display text-lg font-extrabold text-[#0B3B3B]">Story stages</h3>
                  <ol class="mt-3 space-y-3">@for (stage of stages; track stage.label; let index = $index) { <li class="flex gap-3"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A6B6B] text-xs font-bold text-white">{{ index + 1 }}</span><span><strong class="text-[#0B3B3B]">{{ stage.label }}</strong><span class="block text-sm leading-5">{{ stage.guide }}</span></span></li> }</ol>
                </aside>
              </div>
              @if (feedback(); as result) {
                <section class="mt-7 rounded-2xl border border-[#BFD9CF] bg-[#F1F8F5] p-5 sm:p-6" aria-labelledby="feedback-title" aria-live="polite">
                  <div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wider text-[#0A6B6B]">Your feedback</p><h3 id="feedback-title" class="font-display mt-1 text-xl font-extrabold text-[#0B3B3B]">Good work. Here is your next step.</h3></div><p class="rounded-xl bg-[#0B3B3B] px-4 py-3 text-2xl font-extrabold text-white" aria-label="Score {{ result.score }} out of {{ result.maxScore }}">{{ result.score }} <span class="text-base font-semibold text-white/80">/ {{ result.maxScore }}</span></p></div>
                  <div class="mt-4 grid gap-4 sm:grid-cols-2"><div><h4 class="font-bold text-[#176346]">What worked</h4><ul class="mt-2 list-disc space-y-2 pl-5">@for (item of result.positives; track item) { <li>{{ item }}</li> }</ul></div><div><h4 class="font-bold text-[#71420C]">What to improve</h4><ul class="mt-2 list-disc space-y-2 pl-5">@for (item of result.negatives; track item) { <li>{{ item }}</li> }</ul></div></div>
                  @if (saveStatus() === 'saved') { <p class="mt-4 font-semibold text-[#176346]">✓ Writing score saved</p> }
                </section>
              }
            }
          }
          @if (step() > 0) {
            <button type="button" (click)="goTo(step() - 1)" class="mt-8 inline-flex min-h-11 items-center rounded-sm px-3 font-semibold text-[#0A6B6B] underline underline-offset-4 hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">← Previous step</button>
          }
        </section>
      </div>
    </main>
  `,
})
export class WritingShortStoryComponent implements OnInit {
  readonly unitId = input.required<string>();
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly gate = inject(LoginGateService);
  protected readonly stages = STORY_STAGES;
  protected readonly rollerStages = [
    { ride: 'Flat start', label: 'Setting', explanation: 'Meet the people and learn when and where it happens.' },
    { ride: 'Climb up', label: 'Build-up', explanation: 'Show what was happening before the problem.' },
    { ride: 'Top of the hill', label: 'Climax', explanation: 'Tell the surprising or funny moment.' },
    { ride: 'Ride down', label: 'Reaction', explanation: 'Show how people responded to the moment.' },
    { ride: 'Flat end', label: 'Closing', explanation: 'Finish with one sentence that feels complete.' },
  ];
  protected readonly cardTitles = ['What is a story?', 'Story Roller Coaster', 'Model Story', 'Planning Chart', 'Tenses', 'Order the Story', 'Write your story'];
  protected readonly scrambledStory = SCRAMBLED_STORY;
  protected readonly correctOrder = CORRECT_ORDER;
  protected readonly step = signal(0);
  protected readonly completed = signal<number[]>([]);
  protected readonly completedCount = computed(() => this.completed().length);
  protected readonly progressPercent = computed(() => (this.completedCount() / 7) * 100);
  protected readonly plan = signal<Record<string, string>>({ ...DEFAULT_PLAN });
  protected readonly orderedIds = signal<string[]>([]);
  protected readonly sequenceSubmitted = signal(false);
  protected readonly sequenceScore = signal(0);
  protected readonly saveStatus = signal<SaveChoice | null>(null);
  protected readonly storyText = signal('');
  protected readonly feedback = signal<StoryFeedback | null>(null);
  protected readonly loginRequired = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly unitTitle = computed(() => COURSE_UNITS.find((unit) => unit.id === Number(this.unitId()))?.title ?? `Unit ${this.unitId()}`);
  protected readonly writingPrompt = computed(() => {
    if (Number(this.unitId()) === 1) return 'Prompt: Tell about a time when a young person used a skill or personal quality to help someone.';
    if (Number(this.unitId()) === 2) return 'Prompt: Tell about a funny incident you experienced or heard about.';
    return `Prompt: Tell about one surprising incident connected to ${this.unitTitle()}.`;
  });

  ngOnInit(): void {
    const saved = this.readState();
    this.plan.set(saved.plan);
    this.orderedIds.set(saved.orderedIds);
    this.sequenceSubmitted.set(saved.sequenceSubmitted);
    this.sequenceScore.set(saved.sequenceScore);
    this.storyText.set(saved.storyText);
    this.feedback.set(saved.feedback);
    if (saved.sequenceSubmitted) this.completed.set([0, 1, 2, 3, 4, 5]);
    if (saved.feedback) this.completed.set([0, 1, 2, 3, 4, 5, 6]);
  }

  protected next(): void {
    if (this.step() === 5 && !this.sequenceSubmitted()) return;
    const done = new Set(this.completed());
    done.add(this.step());
    this.completed.set([...done].sort((a, b) => a - b));
    this.step.update((value) => Math.min(6, value + 1));
    this.persist();
  }

  protected goTo(index: number): void {
    if (index <= this.step()) this.step.set(index);
  }

  protected updatePlan(stage: string, value: string): void {
    this.plan.update((current) => ({ ...current, [stage]: value }));
    this.persist();
  }

  protected toggleSentence(id: string): void {
    if (this.sequenceSubmitted()) return;
    this.orderedIds.update((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    this.persist();
  }

  protected orderNumber(id: string): number | null {
    const index = this.orderedIds().indexOf(id);
    return index < 0 ? null : index + 1;
  }

  protected sentenceText(id: string): string {
    return this.scrambledStory.find((sentence) => sentence.id === id)?.text ?? '';
  }

  protected async checkSequence(): Promise<void> {
    if (this.orderedIds().length !== CORRECT_ORDER.length || this.sequenceSubmitted()) return;
    const score = this.orderedIds().reduce((total, id, index) => total + Number(id === CORRECT_ORDER[index]), 0);
    this.sequenceScore.set(score);
    this.sequenceSubmitted.set(true);
    this.completed.update((items) => [...new Set([...items, 5])].sort((a, b) => a - b));
    this.persist();
    try {
      const choice = await this.gate.requestSave({ unitNumber: Number(this.unitId()), skill: 'WRITING', score, maxScore: 5 }, { allowSkip: true });
      this.saveStatus.set(choice);
    } catch {
      this.saveStatus.set('cancelled');
    }
  }

  protected updateStory(value: string): void {
    this.storyText.set(value);
    this.loginRequired.set(false);
    this.persist();
  }

  protected submitStory(): void {
    const text = this.storyText().trim();
    if (text.length < 20 || this.loading()) return;
    if (!this.gate.requireSignInForAi()) {
      this.loginRequired.set(true);
      return;
    }
    this.loginRequired.set(false);
    this.loading.set(true);
    this.error.set('');
    this.http.post<StoryFeedback>('/api/writing/story/feedback', { text, unitNumber: Number(this.unitId()) })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          if (!Array.isArray(result.positives) || !Array.isArray(result.negatives) || !Number.isFinite(result.score) || result.maxScore !== 20) {
            this.error.set('We received feedback in an unexpected format. Please try again.');
            return;
          }
          this.feedback.set(result);
          this.completed.update((items) => [...new Set([...items, 6])].sort((a, b) => a - b));
          this.persist();
          void this.gate.requestSave({ unitNumber: Number(this.unitId()), skill: 'WRITING', score: result.score, maxScore: result.maxScore }, { allowSkip: false })
            .then((choice) => this.saveStatus.set(choice))
            .catch(() => this.error.set('Your feedback is ready, but we could not save the score. Please try again.'));
        },
        error: () => this.error.set('We couldn’t get feedback just now. Please try again in a moment.'),
      });
  }

  private storageKey(): string { return `9issemi.short-story.unit-${this.unitId()}`; }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify({
        plan: this.plan(), orderedIds: this.orderedIds(), sequenceSubmitted: this.sequenceSubmitted(),
        sequenceScore: this.sequenceScore(), storyText: this.storyText(), feedback: this.feedback(),
      }));
    } catch { /* Keep the lesson usable if local storage is unavailable. */ }
  }

  private readState(): { plan: Record<string, string>; orderedIds: string[]; sequenceSubmitted: boolean; sequenceScore: number; storyText: string; feedback: StoryFeedback | null } {
    const empty = { plan: { ...DEFAULT_PLAN }, orderedIds: [] as string[], sequenceSubmitted: false, sequenceScore: 0, storyText: '', feedback: null as StoryFeedback | null };
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (!raw) return empty;
      const saved = JSON.parse(raw);
      return {
        plan: { ...DEFAULT_PLAN, ...(saved.plan ?? {}) },
        orderedIds: Array.isArray(saved.orderedIds) ? saved.orderedIds.filter((id: string) => SCRAMBLED_STORY.some((sentence) => sentence.id === id)) : [],
        sequenceSubmitted: saved.sequenceSubmitted === true,
        sequenceScore: Number.isFinite(saved.sequenceScore) ? saved.sequenceScore : 0,
        storyText: typeof saved.storyText === 'string' ? saved.storyText : '',
        feedback: saved.feedback && Number.isFinite(saved.feedback.score) ? saved.feedback : null,
      };
    } catch { return empty; }
  }
}
