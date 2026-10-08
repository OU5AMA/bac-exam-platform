import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-dashboard-placeholder',
  standalone: true,
  template: `
    <main class="mx-auto max-w-xl p-10">
      <h1 class="font-display text-2xl font-extrabold text-[#0B3B3B]">Signed in</h1>
      @if (auth.currentUser(); as user) {
        <p class="mt-3 text-[#4B5B5B]">
          {{ user.email }} · {{ user.roles.join(', ') }} · {{ user.accountStatus }}
        </p>
      }
      <button type="button" class="auth-btn mt-6 max-w-40" (click)="logout()">Sign out</button>
    </main>
  `,
})
export class DashboardPlaceholderComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.auth.me().subscribe({ error: () => void this.router.navigate(['/sign-in']) });
  }

  protected logout(): void {
    this.auth.logout().subscribe({ complete: () => void this.router.navigate(['/sign-in']) });
  }
}