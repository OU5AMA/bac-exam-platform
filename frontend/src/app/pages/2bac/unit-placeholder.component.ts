import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unit-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-12 lg:px-12">
      <section class="mx-auto max-w-3xl rounded-2xl border border-[#E5E7E5] bg-white p-6 shadow-sm sm:p-8">
        <a routerLink="/2-bac/unit/1" class="inline-flex min-h-11 items-center font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">← Back to Unit 1</a>
        <h1 class="font-display mt-6 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B]">{{ title }}</h1>
        <p class="mt-3 leading-7">{{ description }}</p>
        <p class="mt-6 rounded-xl bg-[#E8F2F0] p-4 text-sm font-semibold text-[#0A6B6B]" role="status">Coming soon</p>
      </section>
    </main>
  `,
})
export class UnitPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.data['title'] as string;
  protected readonly description = this.route.snapshot.data['description'] as string;
}
