import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

import { AuthService, AuthUser } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StreakService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly auth = inject(AuthService);

  recordActivity(): void {
    const csrfReady = /(^|;\s*)XSRF-TOKEN=/.test(this.document.cookie)
      ? of(null)
      : this.http.get('/api/auth/me').pipe(catchError(() => of(null)));

    csrfReady.pipe(
      switchMap(() => this.http.post<AuthUser>('/api/progress/activity', {})),
    ).subscribe({
      next: (user) => this.auth.currentUser.set(user),
      error: () => undefined,
    });
  }

  recordProgress(unitNumber: number, skill: string, score: number, maxScore: number): void {
    const csrfReady = /(^|;\s*)XSRF-TOKEN=/.test(this.document.cookie)
      ? of(null)
      : this.http.get('/api/auth/me').pipe(catchError(() => of(null)));

    csrfReady.pipe(
      switchMap(() => this.http.post('/api/progress/save', { unitNumber, skill, score, maxScore })),
      switchMap(() => this.auth.me()),
    ).subscribe({ error: () => undefined });
  }
}
