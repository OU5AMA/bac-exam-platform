import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="flex min-h-screen items-center bg-[#F7F5F0] px-5 py-12 text-[#344C4B]">
      <section class="mx-auto w-full max-w-xl rounded-2xl border border-[#E5E7E5] bg-white p-7 shadow-sm sm:p-10" aria-labelledby="not-found-title">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-[#0A6B6B]">404 · Page not found</p>
        <h1 id="not-found-title" class="font-display mt-3 text-3xl font-extrabold tracking-tight text-[#0B3B3B]">This page isn’t here.</h1>
        <p class="mt-3 leading-7">The link may be old or incomplete. Choose where you’d like to go next.</p>
        <nav aria-label="Helpful links" class="mt-6 flex flex-wrap gap-3">
          <a routerLink="/2-bac" class="inline-flex min-h-11 items-center rounded-lg bg-[#0A6B6B] px-4 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Browse 2 Bac</a>
          <a routerLink="/" class="inline-flex min-h-11 items-center rounded-lg border border-[#0A6B6B] px-4 font-bold text-[#075B5B] hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Go home</a>
        </nav>
      </section>
    </main>
  `,
})
export class NotFoundComponent {}
