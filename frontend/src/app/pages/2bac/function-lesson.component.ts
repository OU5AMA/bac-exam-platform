import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

interface OpinionFeedback {
  positives: string[];
  negatives: string[];
  score: number;
}

@Component({
  selector: 'app-function-lesson',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#344747] sm:px-8 sm:py-12">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac/unit/1" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Unit 1</a>
        <header class="mt-6 rounded-3xl bg-[#0B3B3B] p-6 text-white sm:p-10">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#BDE3D6]">Unit 1 · Function</p>
          <h1 class="font-display mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Expressing Opinion: How to build a strong argument.</h1>
          <p class="mt-4 max-w-2xl text-base leading-7 text-white/85">Share your view clearly, support it with reasons, and connect your ideas so your reader can follow your argument.</p>
        </header>

        <section aria-labelledby="guide-heading" class="mt-8">
          <h2 id="guide-heading" class="font-display text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">The guide</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <article class="rounded-2xl border border-[#D9E8E2] bg-white p-6">
              <p class="text-xs font-bold uppercase tracking-widest text-[#0A6B6B]">Rule 1</p><h3 class="font-display mt-2 text-xl font-bold text-[#0B3B3B]">The starter</h3>
              <p class="mt-3 leading-7">Introduce your point of view with a clear opening phrase.</p>
              <ul class="mt-3 list-disc space-y-2 pl-5 leading-6"><li><em>In my opinion,</em> community service benefits everyone.</li><li><em>I believe that</em> young people can make a difference.</li><li><em>From my point of view,</em> volunteering is valuable.</li><li><em>Personally, I think</em> every student should try it.</li></ul>
            </article>
            <article class="rounded-2xl border border-[#D9E8E2] bg-white p-6">
              <p class="text-xs font-bold uppercase tracking-widest text-[#0A6B6B]">Rule 2</p><h3 class="font-display mt-2 text-xl font-bold text-[#0B3B3B]">Agree or disagree</h3>
              <p class="mt-3 leading-7">Respond to an idea politely, then explain your position.</p>
              <div class="mt-3 space-y-3 rounded-xl bg-[#E8F2F0] p-4 leading-6"><p><strong>I agree with this statement because...</strong> it helps young people learn responsibility.</p><p><strong>I disagree with this idea. In fact, I believe...</strong> students also need time to rest.</p></div>
            </article>
            <article class="rounded-2xl border border-[#D9E8E2] bg-white p-6">
              <p class="text-xs font-bold uppercase tracking-widest text-[#0A6B6B]">Rule 3</p><h3 class="font-display mt-2 text-xl font-bold text-[#0B3B3B]">Support your argument</h3>
              <p class="mt-3 leading-7">Defend your opinion with a reason or example. Connect ideas so the paragraph flows.</p>
              <div class="mt-4 flex flex-wrap gap-2">@for (connector of connectors; track connector) { <span class="rounded-full bg-[#FFF0D5] px-3 py-2 text-sm font-bold text-[#71420C]">{{ connector }}</span> }</div>
            </article>
            <article class="rounded-2xl border border-[#D9E8E2] bg-white p-6">
              <p class="text-xs font-bold uppercase tracking-widest text-[#0A6B6B]">Rule 4</p><h3 class="font-display mt-2 text-xl font-bold text-[#0B3B3B]">Check verb forms</h3>
              <ul class="mt-3 list-disc space-y-2 pl-5 leading-6"><li>After <strong>suggest</strong>, use the bare infinitive: <em>I suggest we volunteer</em>. You can also say <em>I suggest volunteering</em>.</li><li>After a preposition, use the gerund: <em>by helping</em>, <em>interested in volunteering</em>.</li></ul>
            </article>
          </div>
        </section>

        <section aria-labelledby="practice-heading" class="mt-10 rounded-3xl border border-[#E9C98F] bg-white p-6 shadow-sm sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#A25B0A]">Practice with feedback</p><h2 id="practice-heading" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B] sm:text-3xl">Your Turn to Write</h2></div><span class="rounded-full bg-[#FFF0D5] px-3 py-2 text-sm font-semibold text-[#71420C]">3–5 sentences</span></div>
          <p class="mt-5 rounded-xl bg-[#FBF7EF] p-4 leading-7">Some people believe that young people should spend their free time volunteering for community service. Do you agree or disagree? Write a short paragraph (3–5 sentences) expressing your opinion and giving at least one reason.</p>
          <label for="opinion-response" class="mt-5 block text-sm font-bold text-[#0B3B3B]">Your paragraph</label>
          <textarea id="opinion-response" name="opinion-response" [(ngModel)]="text" maxlength="4000" rows="7" aria-describedby="writing-hint" placeholder="In my opinion, ..." class="mt-2 min-h-48 w-full resize-y rounded-xl border border-[#AAB8B4] bg-white p-4 leading-7 text-[#243434] placeholder:text-[#687674] focus:border-[#0A6B6B] focus:outline-2 focus:outline-offset-2 focus:outline-[#0A6B6B]"></textarea>
          <div class="mt-2 flex flex-wrap justify-between gap-2 text-sm text-[#5A6967]"><p id="writing-hint">Include an opinion starter and at least one supporting reason.</p><p>{{ text.length }} / 4000</p></div>
          @if (error()) { <p class="mt-4 rounded-xl border border-[#D9958C] bg-[#FFF0ED] p-4 text-sm font-medium text-[#7B261C]" role="alert">{{ error() }}</p> }
          <button type="button" (click)="getFeedback()" [disabled]="loading() || !text.trim()" [attr.aria-busy]="loading()" class="mt-5 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0A6B6B] px-6 py-3 font-bold text-white transition hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B] disabled:cursor-not-allowed disabled:bg-[#879794]">
            @if (loading()) { <span class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span><span>Getting feedback…</span> } @else { <span>Get Feedback</span> }
          </button>
        </section>

        @if (feedback(); as result) {
          <section aria-labelledby="feedback-heading" aria-live="polite" class="mt-8">
            <div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Your feedback</p><h2 id="feedback-heading" class="font-display mt-2 text-2xl font-extrabold text-[#0B3B3B]">A strong next step</h2></div><p class="rounded-2xl bg-[#0B3B3B] px-5 py-3 text-2xl font-extrabold text-white" aria-label="Score {{ result.score }} out of 10">{{ result.score }}<span class="text-base font-semibold text-white/80"> / 10</span></p></div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-6">
              <article class="rounded-2xl border border-[#A7D5B1] bg-[#EFF9F0] p-6"><h3 class="text-lg font-bold text-[#185C2C]">What you did well</h3><ul class="mt-3 list-disc space-y-2 pl-5 leading-6 text-[#234D2D]">@for (item of result.positives; track $index) { <li>{{ item }}</li> }</ul></article>
              <article class="rounded-2xl border border-[#E9C596] bg-[#FFF5E8] p-6"><h3 class="text-lg font-bold text-[#78420E]">How to improve</h3><ul class="mt-3 list-disc space-y-2 pl-5 leading-6 text-[#5C3D20]">@for (item of result.negatives; track $index) { <li>{{ item }}</li> }</ul></article>
            </div>
          </section>
        }
      </div>
    </main>
  `,
})
export class FunctionLessonComponent {
  private readonly http = inject(HttpClient);
  protected readonly connectors = ['because', 'since', 'for example', 'moreover', 'therefore'];
  protected text = '';
  protected readonly loading = signal(false);
  protected readonly feedback = signal<OpinionFeedback | null>(null);
  protected readonly error = signal('');

  protected getFeedback(): void {
    const text = this.text.trim();
    if (!text || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.feedback.set(null);
    this.http.post<OpinionFeedback>('/api/function/opinion/feedback', { text })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (!Array.isArray(response.positives) || !Array.isArray(response.negatives) || !Number.isFinite(response.score)) {
            this.error.set('We received feedback in an unexpected format. Please try again.');
            return;
          }
          this.feedback.set(response);
        },
        error: () => this.error.set('We couldn’t get feedback just now. Please try again in a moment.'),
      });
  }
}
