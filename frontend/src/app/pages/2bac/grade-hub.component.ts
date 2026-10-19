import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COURSE_UNITS } from './unit-data';

@Component({
  selector: 'app-grade-hub',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <div class="mx-auto max-w-7xl">
        <a routerLink="/" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Home
        </a>

        <header class="mt-8 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">Your learning path</p>
          <h1 class="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-5xl">2nd Year Baccalaureate</h1>
          <p class="mt-4 max-w-2xl text-base leading-7 sm:text-lg">Choose a unit to build your English skills, or prepare for the national exam with a focused study plan.</p>
        </header>

        <a routerLink="/2-bac/national-exam" class="group mt-8 flex flex-col gap-5 rounded-2xl border border-[#0A6B6B]/20 bg-[#0B3B3B] p-6 text-white shadow-sm transition hover:border-[#F5A623] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <span class="flex items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F5A623]" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2Z"/><path d="M9 8h6M9 12h6"/></svg>
            </span>
            <span>
              <span class="block text-xs font-bold uppercase tracking-[0.16em] text-[#F5D18B]">Plan ahead</span>
              <span class="font-display mt-1 block text-2xl font-bold">National Exam Prep</span>
              <span class="mt-2 block max-w-xl text-sm leading-6 text-white/80">Past papers, exam strategies, and practice to help you feel ready.</span>
            </span>
          </span>
          <span class="inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-white px-4 text-sm font-bold text-[#0B3B3B] transition group-hover:bg-[#F5F5F5] sm:self-center">Explore prep <span aria-hidden="true">→</span></span>
        </a>

        <section aria-labelledby="units-title" class="mt-12">
          <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6B6B]">Ticket 2 English</p>
              <h2 id="units-title" class="font-display mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B] sm:text-3xl">Study by unit</h2>
            </div>
            <p class="text-sm">Choose one of the 10 course units.</p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (unit of units; track unit.id) {
              <a [routerLink]="['/2-bac/unit', unit.id]" class="group flex min-h-36 items-start gap-4 rounded-2xl border border-[#E5E7E5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0A6B6B]/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] sm:p-6">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F2F0] text-sm font-extrabold text-[#0A6B6B]">{{ unit.id.toString().padStart(2, '0') }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Unit {{ unit.id }}</span>
                  <span class="font-display mt-2 block text-lg font-bold leading-6 text-[#0B3B3B]">{{ unit.title }}</span>
                  <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0A6B6B]">Explore unit <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span></span>
                </span>
              </a>
            }
          </div>
        </section>
      </div>
    </main>
  `,
})
export class GradeHubComponent {
  protected readonly units = COURSE_UNITS;
}
