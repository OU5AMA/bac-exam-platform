import { Component, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section aria-labelledby="dashboard-title">
      @if (auth.currentUser(); as user) {
        <div class="mb-8">
          <p class="text-sm font-semibold text-[#0A6B6B]">Your learning space</p>
          <h1 id="dashboard-title" class="font-display mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Welcome back</h1>
          <p class="mt-2 text-base text-[#4B5B5B]">{{ user.email }}</p>
        </div>

        @if (user.accountStatus === 'PENDING_APPROVAL') {
          <div role="status" class="mb-8 rounded-xl border border-[#F5A623]/50 bg-[#F5A623]/10 px-5 py-4 text-sm leading-6 text-[#4B5B5B] sm:px-6">
            <p class="font-semibold text-[#12302F]">Your teacher account is awaiting admin approval.</p>
            <p class="mt-1">You'll be able to create and manage exams once approved.</p>
          </div>
        } @else if (user.accountStatus === 'REJECTED') {
          <div role="alert" class="mb-8 rounded-xl border border-[#B42318]/40 bg-[#FDECEA] px-5 py-4 text-sm leading-6 text-[#7A1810] sm:px-6">
            Your account request was not approved. Contact support if you think this is a mistake.
          </div>
        }

        <div class="grid gap-4 md:grid-cols-3 md:gap-5">
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your exams</h2>
              <span class="rounded-full bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5B5B]">Coming soon</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#4B5B5B]">Exams assigned to you will appear here.</p>
          </article>
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your progress</h2>
              <span class="rounded-full bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5B5B]">Coming soon</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#4B5B5B]">Track your results over time.</p>
          </article>
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your class</h2>
              <span class="rounded-full bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5B5B]">Coming soon</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#4B5B5B]">See who else is learning with you.</p>
          </article>
        </div>
      }
    </section>
  `,
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
}
