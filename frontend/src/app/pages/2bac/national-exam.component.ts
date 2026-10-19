import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-national-exam',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <div class="mx-auto max-w-5xl">
        <a routerLink="/2-bac" class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to 2 Bac
        </a>
        <header class="mt-8 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">Prepare with confidence</p>
          <h1 class="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-5xl">National Exam Preparation</h1>
          <p class="mt-4 text-base leading-7 sm:text-lg">Build a steady exam routine with resources designed for your 2nd Year Baccalaureate English exam.</p>
        </header>
        <section aria-label="Exam preparation resources" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (resource of resources; track resource.title) {
            <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
              <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F2F0] text-[#0A6B6B]" aria-hidden="true">
                @switch (resource.title) {
                  @case ('Past Papers') { <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 13h8m-8 4h8"/></svg> }
                  @case ('Exam Strategies') { <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m8.5 12 2.3 2.3 4.7-5"/></svg> }
                  @default { <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> }
                }
              </span>
              <p class="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#667575]">Coming soon</p>
              <h2 class="font-display mt-2 text-xl font-bold text-[#0B3B3B]">{{ resource.title }}</h2>
              <p class="mt-2 text-sm leading-6">{{ resource.description }}</p>
            </article>
          }
        </section>
      </div>
    </main>
  `,
})
export class NationalExamComponent {
  protected readonly resources = [
    { title: 'Past Papers', description: 'Review previous national exams and get familiar with the question formats.' },
    { title: 'Exam Strategies', description: 'Learn practical ways to plan your time and approach each section.' },
    { title: 'Mock Exams', description: 'Practice under exam-like conditions and check your readiness.' },
  ];
}
