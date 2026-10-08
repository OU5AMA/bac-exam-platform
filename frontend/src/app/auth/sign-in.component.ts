import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthShellComponent } from './auth-shell.component';
import { AuthService, AuthUser } from './auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell>
      <div class="w-full">
        <div class="h-1 w-10 rounded-full bg-[#F5A623]" aria-hidden="true"></div>
        <h1 class="font-display mt-4 text-[2rem] font-extrabold leading-tight tracking-[-0.035em] text-[#0B3B3B] sm:text-4xl">
          Welcome back
        </h1>
        <p class="mt-2 text-[0.9375rem] leading-6 text-[#4B5B5B]">Sign in to pick up where you left off.</p>

        @if (notice(); as text) {
          <div
            role="status"
            class="mt-6 rounded-md border border-[#F5A623]/60 bg-[#FEF3DC] px-4 py-3 text-sm text-[#5A3B00]"
          >
            {{ text }}
          </div>
        }

        @if (serverError(); as message) {
          <div
            role="alert"
            class="mt-6 rounded-md border border-[#B42318]/40 bg-[#FDECEA] px-4 py-3 text-sm text-[#7A1810]"
          >
            {{ message }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="mt-8 space-y-6">
          <div>
            <label for="email" class="auth-label">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              autocomplete="email"
              inputmode="email"
              class="auth-input mt-1.5"
              [attr.aria-invalid]="invalid('email')"
              [attr.aria-describedby]="invalid('email') ? 'email-error' : null"
            />
            @if (invalid('email')) {
              <p id="email-error" class="auth-error">{{ emailMessage() }}</p>
            }
          </div>

          <div>
            <div class="flex items-baseline justify-between">
              <label for="password" class="auth-label">Password</label>
              <a routerLink="/forgot-password" class="auth-link text-sm">Forgot password?</a>
            </div>
            <div class="relative mt-1.5">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                class="auth-input pr-12"
                [attr.aria-invalid]="invalid('password')"
                [attr.aria-describedby]="invalid('password') ? 'password-error' : null"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                [attr.aria-pressed]="showPassword()"
                class="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-[#4B5B5B] hover:text-[#0A6B6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A6B6B]"
              >
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  @if (showPassword()) {
                    <path d="M4 4l16 16" />
                  }
                </svg>
              </button>
            </div>
            @if (invalid('password')) {
              <p id="password-error" class="auth-error">Enter your password.</p>
            }
          </div>

          <button type="submit" class="auth-btn" [disabled]="loading()" [attr.aria-busy]="loading()">
            @if (loading()) {
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.3" stroke-width="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              Signing in…
            } @else {
              Sign in
            }
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-[#4B5B5B]">
          New to 9issemi?
          <a routerLink="/sign-up" class="auth-link">Create an account</a>
        </p>
      </div>
    </app-auth-shell>
  `,
})
export class SignInComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected invalid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected emailMessage(): string {
    return this.form.controls.email.hasError('required')
      ? 'Enter your email address.'
      : 'Enter a valid email address, like name@example.com.';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);
    this.notice.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('input.ng-invalid')?.focus();
      return;
    }

    this.loading.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.onSuccess(user),
        error: (err: HttpErrorResponse) => this.serverError.set(this.messageFor(err)),
      });
  }

  private onSuccess(user: AuthUser): void {
    switch (user.accountStatus) {
      case 'ACTIVE':
        void this.router.navigate(['/dashboard']);
        break;
      case 'PENDING_APPROVAL':
        // Credentials were correct, so this is not an error: the session exists,
        // the account just can't do teacher things yet.
        this.notice.set(
          'Your teacher account is waiting for admin approval. You can sign in again later to check its status.',
        );
        break;
      case 'REJECTED':
        this.notice.set(
          'Your teacher account request was not approved. Contact support if you think this is a mistake.',
        );
        break;
    }
  }

  private messageFor(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return "We can't reach the server. Check your connection and try again.";
    }
    if (err.status === 401 || err.status === 400) {
      return err.error?.message ?? 'Invalid email or password.';
    }
    if (err.status === 403) {
      // Almost always a missing/stale CSRF token.
      return 'We could not verify your session. Refresh the page and try again.';
    }
    return 'Something went wrong on our side. Please try again in a moment.';
  }
}
