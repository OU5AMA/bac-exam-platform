import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthShellComponent } from './auth-shell.component';
import { AuthService, AuthUser, UserRole } from './auth.service';

const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell>
      <div class="w-full max-w-md">
        <div class="h-1 w-10 rounded-full bg-[#F5A623]" aria-hidden="true"></div>

        @if (registered(); as user) {
          <!-- Success state -->
          <div class="mt-4" role="status">
            <svg viewBox="0 0 24 24" class="h-12 w-12 text-[#0A6B6B]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M7.5 12.5l3 3 6-6.5" />
            </svg>
            @switch (user.accountStatus) {
              @case ('PENDING_APPROVAL') {
                <h1 class="font-display mt-4 text-[2rem] font-extrabold leading-tight tracking-[-0.035em] text-[#0B3B3B] sm:text-4xl">
                  Request received
                </h1>
                <p class="mt-3 text-[#4B5B5B]">
                  Thanks for signing up, teacher. An admin will review
                  <strong class="font-semibold text-[#12302F]">{{ user.email }}</strong>
                  before you can start teaching. You can sign in at any time to check your status.
                </p>
              }
              @default {
                <h1 class="font-display mt-4 text-[2rem] font-extrabold leading-tight tracking-[-0.035em] text-[#0B3B3B] sm:text-4xl">
                  You're all set
                </h1>
                <p class="mt-3 text-[#4B5B5B]">
                  Your account for
                  <strong class="font-semibold text-[#12302F]">{{ user.email }}</strong>
                  is ready. Sign in to start learning.
                </p>
              }
            }
            <a routerLink="/sign-in" class="auth-btn mt-8 no-underline">Go to sign in</a>
          </div>
        } @else {
          <h1 class="font-display mt-4 text-[2rem] font-extrabold leading-tight tracking-[-0.035em] text-[#0B3B3B] sm:text-4xl">
            Create your account
          </h1>
          <p class="mt-2 text-[0.9375rem] leading-6 text-[#4B5B5B]">Join 9issemi as a student or a teacher.</p>

          @if (serverError(); as message) {
            <div
              role="alert"
              class="mt-6 rounded-md border border-[#B42318]/40 bg-[#FDECEA] px-4 py-3 text-sm text-[#7A1810]"
            >
              {{ message }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="mt-8 space-y-6">
            <fieldset aria-describedby="role-help">
              <legend class="auth-label">I'm joining as</legend>
              <div class="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border border-[#C9D1CF] bg-white p-1">
                @for (option of roleOptions; track option.value) {
                  <div>
                    <input
                      type="radio"
                      [id]="'role-' + option.value"
                      formControlName="role"
                      [value]="option.value"
                      class="peer sr-only"
                    />
                    <label
                      [for]="'role-' + option.value"
                      class="flex cursor-pointer items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-[#2A4545] transition-colors hover:bg-[#EEF3F2] peer-checked:bg-[#0A6B6B] peer-checked:text-white peer-checked:hover:bg-[#0A6B6B] peer-focus-visible:ring-2 peer-focus-visible:ring-[#F5A623] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0A6B6B]"
                    >
                      {{ option.label }}
                    </label>
                  </div>
                }
              </div>
              <p id="role-help" class="auth-help">
                @if (form.controls.role.value === 'TEACHER') {
                  Teacher accounts are reviewed by an admin before you can start teaching.
                } @else {
                  Students can start right after signing up.
                }
              </p>
            </fieldset>

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
              <label for="password" class="auth-label">Password</label>
              <div class="relative mt-1.5">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="new-password"
                  class="auth-input pr-12"
                  [attr.aria-invalid]="invalid('password')"
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="showPassword() ? 'Hide passwords' : 'Show passwords'"
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
              <p id="password-help" [class]="invalid('password') ? 'auth-error' : 'auth-help'">
                {{ invalid('password') ? passwordMessage() : 'At least 8 characters.' }}
              </p>
            </div>

            <div>
              <label for="confirmPassword" class="auth-label">Confirm password</label>
              <input
                id="confirmPassword"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
                class="auth-input mt-1.5"
                [attr.aria-invalid]="confirmInvalid()"
                [attr.aria-describedby]="confirmInvalid() ? 'confirm-error' : null"
              />
              @if (confirmInvalid()) {
                <p id="confirm-error" class="auth-error">{{ confirmMessage() }}</p>
              }
            </div>

            <button type="submit" class="auth-btn" [disabled]="loading()" [attr.aria-busy]="loading()">
              @if (loading()) {
                <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.3" stroke-width="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                </svg>
                Creating account…
              } @else {
                Create account
              }
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-[#4B5B5B]">
            Already have an account?
            <a routerLink="/sign-in" class="auth-link">Sign in</a>
          </p>
        }
      </div>
    </app-auth-shell>
  `,
})
export class SignUpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly roleOptions: { value: UserRole; label: string }[] = [
    { value: 'STUDENT', label: "I'm a student" },
    { value: 'TEACHER', label: "I'm a teacher" },
  ];

  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly registered = signal<AuthUser | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      role: this.fb.nonNullable.control<UserRole>('STUDENT'),
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected invalid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected confirmInvalid(): boolean {
    const control = this.form.controls.confirmPassword;
    const visible = control.touched || this.submitted();
    return visible && (control.invalid || this.form.hasError('passwordMismatch'));
  }

  protected emailMessage(): string {
    const email = this.form.controls.email;
    if (email.hasError('taken')) return 'An account with this email already exists.';
    if (email.hasError('required')) return 'Enter your email address.';
    return 'Enter a valid email address, like name@example.com.';
  }

  protected passwordMessage(): string {
    return this.form.controls.password.hasError('required')
      ? 'Choose a password.'
      : 'Use at least 8 characters.';
  }

  protected confirmMessage(): string {
    return this.form.controls.confirmPassword.hasError('required')
      ? 'Confirm your password.'
      : "Passwords don't match.";
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const { email, password, role } = this.form.getRawValue();
    this.loading.set(true);
    this.auth
      .register({ email, password, role })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.registered.set(user),
        error: (err: HttpErrorResponse) => this.onError(err),
      });
  }

  private onError(err: HttpErrorResponse): void {
    if (err.status === 409) {
      // Field-level error; it clears itself as soon as the user edits the email.
      this.form.controls.email.setErrors({ taken: true });
      this.focusFirstInvalid();
      return;
    }
    if (err.status === 0) {
      this.serverError.set("We can't reach the server. Check your connection and try again.");
    } else if (err.status === 400 && err.error?.message) {
      this.serverError.set(err.error.message);
    } else if (err.status === 403) {
      this.serverError.set('We could not verify your session. Refresh the page and try again.');
    } else {
      this.serverError.set('Something went wrong on our side. Please try again in a moment.');
    }
  }

  private focusFirstInvalid(): void {
    this.host.nativeElement.querySelector<HTMLElement>('input.ng-invalid')?.focus();
  }
}
