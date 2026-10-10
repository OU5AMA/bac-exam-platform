import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#F7F5F0] text-[#4B5B5B]">
      <header class="sticky top-0 z-20 border-b border-[#E5E7E5] bg-[#F7F5F0]/95 backdrop-blur">
        <nav aria-label="Main navigation" class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a routerLink="/" aria-label="9issemi home" class="inline-flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
            <img src="tiny_logo.svg" alt="" class="h-9 w-9 object-contain" />
            <span class="font-display text-xl font-extrabold tracking-[-0.04em] text-[#0B3B3B]">9issemi</span>
          </a>
          <div class="flex items-center gap-3 sm:gap-6">
            <a routerLink="/sign-in" class="hidden whitespace-nowrap rounded-sm text-sm font-semibold text-[#4B5B5B] transition-colors hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B] sm:inline">Sign in</a>
            <a routerLink="/sign-up" class="auth-btn w-auto px-5 py-2.5 text-sm">Get started</a>
          </div>
        </nav>
      </header>

      <main>
        <section aria-labelledby="hero-title" class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-24">
          <div class="max-w-2xl">
            <p class="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">
              <span class="h-2 w-2 rounded-full bg-[#F5A623]" aria-hidden="true"></span>
              One place for your class to grow
            </p>
            <h1 id="hero-title" class="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#0B3B3B] sm:text-5xl lg:text-6xl">
              Your class, <span class="text-[#0A6B6B]">wherever</span> you are.
            </h1>
            <p class="mt-6 max-w-xl text-base leading-7 text-[#4B5B5B] sm:text-lg sm:leading-8">
              9issemi brings students and teachers together to practice, teach, and follow progress in one clear, welcoming space.
            </p>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a routerLink="/sign-up" class="auth-btn w-auto px-6 sm:max-w-[220px]">Get started</a>
              <a routerLink="/sign-in" class="inline-flex min-h-12 items-center gap-2 self-start whitespace-nowrap rounded-sm px-2 font-semibold text-[#0A6B6B] underline decoration-[#0A6B6B]/40 underline-offset-4 hover:decoration-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">
                Sign in <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div class="relative mx-auto flex min-h-[300px] w-full max-w-xl items-center justify-center overflow-hidden rounded-[2rem] border border-[#E5E7E5] bg-white p-8 shadow-[0_24px_70px_rgba(11,59,59,0.08)] sm:min-h-[380px] sm:p-12">
            <div class="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#2196F3]/10 blur-3xl" aria-hidden="true"></div>
            <div class="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#F5A623]/10 blur-3xl" aria-hidden="true"></div>
            <div class="relative flex flex-col items-center text-center">
              <div class="flex h-44 w-44 items-center justify-center rounded-[2rem] bg-[#F7F5F0] ring-1 ring-[#E5E7E5] sm:h-52 sm:w-52">
                <img src="tiny_logo.png" alt="9issemi graduation cap and open book mark" class="h-36 w-36 object-contain sm:h-44 sm:w-44" />
              </div>
              <p class="font-display mt-6 text-2xl font-extrabold tracking-[-0.04em] text-[#0B3B3B]">Learn. Grow. Shine.</p>
              <p class="mt-2 text-sm text-[#4B5B5B]">Your class has a place to thrive.</p>
            </div>
            <svg class="absolute right-8 top-8 h-7 w-7 text-[#F5A623]" viewBox="-12 -12 24 24" fill="currentColor" aria-hidden="true"><path d="M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z" /></svg>
            <svg class="absolute bottom-10 right-12 h-4 w-4 text-[#0A6B6B]/50" viewBox="-12 -12 24 24" fill="currentColor" aria-hidden="true"><path d="M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z" /></svg>
          </div>
        </section>

        <section aria-labelledby="benefits-title" class="border-y border-[#E5E7E5] bg-white/60">
          <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div class="mb-10 max-w-xl">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0A6B6B]">Made for the whole classroom</p>
              <h2 id="benefits-title" class="font-display mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#0B3B3B] sm:text-4xl">A better rhythm for learning</h2>
            </div>
            <div class="grid gap-5 md:grid-cols-3 md:gap-6">
              <article class="rounded-2xl border border-[#E5E7E5] bg-[#F7F5F0] p-6 sm:p-8">
                <svg class="h-10 w-10 text-[#0A6B6B]" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 8.5A3.5 3.5 0 0 1 10.5 5H19v27h-8.5A3.5 3.5 0 0 0 7 35.5v-27ZM33 8.5A3.5 3.5 0 0 0 29.5 5H21v27h8.5a3.5 3.5 0 0 1 3.5 3.5v-27Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="m14 15 2.2 2.2L21 12" stroke="#F5A623" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <h3 class="font-display mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Practice at your pace</h3>
                <p class="mt-3 text-sm leading-6">Take exams when you’re ready, then see your results and keep moving forward.</p>
              </article>
              <article class="rounded-2xl border border-[#E5E7E5] bg-[#F7F5F0] p-6 sm:p-8">
                <svg class="h-10 w-10 text-[#0A6B6B]" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M6 31V9m0 22h29M12 25l7-8 6 4 9-11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 10h6v6" stroke="#F5A623" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <h3 class="font-display mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Teach with insight</h3>
                <p class="mt-3 text-sm leading-6">Create exams and get a clearer view of how your students are progressing.</p>
              </article>
              <article class="rounded-2xl border border-[#E5E7E5] bg-[#F7F5F0] p-6 sm:p-8">
                <svg class="h-10 w-10 text-[#0A6B6B]" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="15" cy="13" r="5" stroke="currentColor" stroke-width="2.2"/><circle cx="27" cy="15" r="4" stroke="currentColor" stroke-width="2.2"/><path d="M5 33v-3a10 10 0 0 1 20 0v3H5Zm21-11a8 8 0 0 1 9 8v3h-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="m29 4 1.3 2.7L33 8l-2.7 1.3L29 12l-1.3-2.7L25 8l2.7-1.3L29 4Z" fill="#F5A623"/></svg>
                <h3 class="font-display mt-6 text-xl font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Learn together</h3>
                <p class="mt-3 text-sm leading-6">Keep your class connected in one place to learn, share progress, and grow.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-[#E5E7E5]">
        <div class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <a routerLink="/" class="inline-flex items-center gap-3 self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
            <img src="tiny_logo.png" alt="" class="h-6 w-6 object-contain" />
            <span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4B5B5B]">My class. Learn. Grow. Shine.</span>
          </a>
          <nav aria-label="Footer navigation" class="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <a routerLink="/sign-in" class="rounded-sm hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Sign in</a>
            <a routerLink="/sign-up" class="rounded-sm hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Sign up</a>
            <a href="mailto:hello@9issemi.ma" class="rounded-sm hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {}
