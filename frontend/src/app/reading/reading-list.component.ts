import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { READING_EXAMS } from './reading.data';

@Component({
  selector: 'app-reading-list', standalone: true, imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac/unit/1" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]"><span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Unit 1</a>
        <header class="mt-8 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">2BAC English · Unit 1</p>
          <h1 class="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-5xl">Reading Practice</h1>
          <p class="mt-4 text-base leading-7 sm:text-lg">Read about life skills and personal development, then check your understanding with exam-style questions. Choose the version that suits your practice needs.</p>
        </header>
        <section aria-labelledby="tasks-heading" class="mt-10">
          <div class="mb-5">
            <h2 id="tasks-heading" class="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B]">Choose a reading task</h2>
            <p class="mt-2 text-sm">Both versions are untimed practice. Your work is saved on this device.</p>
          </div>
          <div class="grid gap-5 md:grid-cols-2">
            @for (exam of exams; track exam.id) {
              <article class="flex h-full flex-col rounded-2xl border border-[#E1E6E3] bg-white p-6 shadow-sm sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-[0.16em]" [class.text-[#0A6B6B]]="exam.version === 'normal'" [class.text-[#6B4E8A]]="exam.version === 'sen'">{{ exam.versionLabel }}</p>
                    <h3 class="font-display mt-2 text-xl font-bold leading-7 text-[#0B3B3B]">{{ exam.title }}</h3>
                  </div>
                  <span class="shrink-0 rounded-full px-3 py-1 text-xs font-bold" [class.bg-[#E8F2F0]]="exam.version === 'normal'" [class.text-[#075B5B]]="exam.version === 'normal'" [class.bg-[#F1ECF7]]="exam.version === 'sen'" [class.text-[#584075]]="exam.version === 'sen'">{{ exam.version === 'sen' ? 'Adapted' : 'Standard' }}</span>
                </div>
                <p class="mt-3 text-sm leading-6">{{ exam.description }}</p>
                <dl class="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#F7F8F6] p-4 text-sm">
                  <div><dt class="text-xs font-semibold text-[#667575]">Estimated time</dt><dd class="mt-1 font-semibold text-[#173E3D]">{{ exam.duration }}</dd></div>
                  <div><dt class="text-xs font-semibold text-[#667575]">Support</dt><dd class="mt-1 font-semibold text-[#173E3D]">{{ exam.supportLevel }}</dd></div>
                </dl>
                <p class="mt-4 text-sm text-[#667575]">{{ exam.unit }}</p>
                <a [routerLink]="['/2-bac/reading', exam.slug]" class="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white transition hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Start Practice <span aria-hidden="true">→</span></a>
              </article>
            }
          </div>
        </section>
        <aside class="mt-8 rounded-xl border border-[#DFE6E3] bg-white/70 p-5 text-sm leading-6" aria-label="Practice information">
          <p class="font-semibold text-[#173E3D]">Practice at your own pace</p>
          <p class="mt-1">You can move between questions, return to the passage, and continue later on this device. Answers are shown after you submit.</p>
        </aside>
      </div>
    </main>
  `,
})
export class ReadingListComponent { protected readonly exams = READING_EXAMS; }
