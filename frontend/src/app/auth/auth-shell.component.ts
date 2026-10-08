import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  template: `
    <div class="flex min-h-screen flex-col bg-[#F7F5F0] lg:grid lg:grid-cols-[5fr_6fr]">
      <!-- Brand panel -->
      <aside
        class="relative isolate flex min-h-[112px] flex-col items-center justify-center gap-2 overflow-hidden px-5 py-3 text-[#F7F5F0] sm:min-h-[128px] sm:px-8 sm:py-4 lg:min-h-screen lg:items-start lg:justify-between lg:px-14 lg:py-12"
        style="background:
          radial-gradient(circle at 100% 0%, rgba(33,150,243,.45), transparent 50%),
          radial-gradient(circle at 90% 100%, rgba(245,166,35,.35), transparent 45%),
          linear-gradient(160deg, #084F4F 0%, #0A6B6B 38%, #1565C0 88%);"
      >
        <!-- Decorative layer: dot grid, rising arc + arrowhead, stars, faint cap -->
        <svg
          class="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern id="auth-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="#F7F5F0" fill-opacity="0.10" />
            </pattern>
            <linearGradient id="auth-arc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#2196F3" stop-opacity="0" />
              <stop offset="0.55" stop-color="#2196F3" stop-opacity="0.55" />
              <stop offset="1" stop-color="#F5A623" />
            </linearGradient>
            <path
              id="auth-star"
              d="M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z"
            />
          </defs>

          <rect width="600" height="800" fill="url(#auth-dots)" />

          <path
            d="M -40 720 C 140 560, 340 560, 520 220"
            fill="none"
            stroke="url(#auth-arc)"
            stroke-width="10"
            stroke-linecap="round"
          />
          <polygon points="506.7,211.1 536,196 533.3,228.9" fill="#F5A623" />

          <use href="#auth-star" transform="translate(470 120) scale(1.6)" fill="#F5A623" />
          <use href="#auth-star" transform="translate(90 250) scale(0.9)" fill="#F7F5F0" fill-opacity="0.7" />
          <use href="#auth-star" transform="translate(545 440) scale(0.7)" fill="#F5A623" fill-opacity="0.8" />
          <use href="#auth-star" transform="translate(300 80) scale(0.6)" fill="#F7F5F0" fill-opacity="0.5" />

          <g
            transform="translate(130 600) scale(2.2)"
            fill="none"
            stroke="#F7F5F0"
            stroke-opacity="0.16"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          >
            <path d="M0 -30 L60 -8 L0 14 L-60 -8 Z" />
            <path d="M-34 4 V26 C-34 40 34 40 34 26 V4" />
            <path d="M60 -8 V30" />
          </g>
        </svg>

        <div class="relative z-10 hidden max-w-md lg:block">
          <h2 class="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] xl:text-5xl">
            Your class, <span class="text-[#F5A623]">wherever</span> you are.
          </h2>
          <p class="mt-5 max-w-sm text-base leading-7 text-[#F7F5F0]/90 xl:text-lg">
            Practice, track your progress, and learn alongside your teachers, all in one place.
          </p>
        </div>

        <p
          class="relative z-10 mt-0 flex items-center gap-2.5 text-[9px] font-semibold uppercase leading-4 tracking-[0.2em] sm:text-[11px] sm:tracking-[0.28em] lg:mt-0"
        >
          <svg aria-hidden="true" viewBox="-12 -12 24 24" class="h-3 w-3 shrink-0 fill-[#F5A623]">
            <path d="M0 -10 L2.6 -2.6 L10 0 L2.6 2.6 L0 10 L-2.6 2.6 L-10 0 L-2.6 -2.6 Z" />
          </svg>
          My class. Learn. Grow. Shine.
        </p>
      </aside>

      <!-- Form side -->
      <main class="flex flex-1 items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
        <div class="w-full max-w-md">
          <ng-content />
        </div>
      </main>
    </div>
  `,
})
export class AuthShellComponent {}
