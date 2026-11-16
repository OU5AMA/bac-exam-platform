import { Component, inject } from '@angular/core';
import { LoginGateService } from './login-gate.service';

@Component({
  selector: 'app-login-gate-modal',
  standalone: true,
  template: `
    @if (gate.dialog(); as kind) {
      <div class="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B3B3B]/55 p-0 sm:items-center sm:p-6" (click)="gate.close()">
        <section role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-description" class="w-full max-w-md rounded-t-2xl bg-[#F7F5F0] p-6 shadow-2xl sm:rounded-2xl sm:p-8" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 id="gate-title" class="font-display text-2xl font-extrabold text-[#0B3B3B]">{{ kind === 'ai-feedback' ? 'Sign in to get AI feedback' : 'Save your score?' }}</h2>
              <p id="gate-description" class="mt-3 leading-6 text-[#4B5B5B]">{{ kind === 'ai-feedback' ? "AI grading is available for signed-in students. It's free and takes 20 seconds." : 'Sign in to save this result and collect points. You can keep practicing without an account.' }}</p>
            </div>
            <button type="button" aria-label="Close dialog" (click)="gate.close()" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-[#4B5B5B] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">×</button>
          </div>
          <div class="mt-6 flex flex-col gap-3">
            <button type="button" (click)="gate.signIn()" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">Sign in</button>
            <button type="button" (click)="gate.signUp()" class="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#0A6B6B] bg-white px-5 font-bold text-[#0A6B6B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Sign up</button>
            @if (kind === 'save-score' && gate.allowSkip()) {
              <button type="button" (click)="gate.continueWithoutSaving()" class="inline-flex min-h-12 items-center justify-center rounded-lg px-5 font-semibold text-[#4B5B5B] underline underline-offset-4 hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Continue without saving</button>
            }
          </div>
        </section>
      </div>
    }
  `,
})
export class LoginGateModalComponent {
  protected readonly gate = inject(LoginGateService);
}
