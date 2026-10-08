import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

export type UserRole = 'STUDENT' | 'TEACHER';
export type AccountStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';

export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
  accountStatus: AccountStatus;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  // Relative URL on purpose: Angular only attaches the X-XSRF-TOKEN header to
  // same-origin (relative) requests. In dev this works via proxy.conf.json.
  private readonly base = '/api/auth';

  readonly currentUser = signal<AuthUser | null>(null);

  register(payload: RegisterPayload): Observable<AuthUser> {
    return this.ensureCsrfCookie().pipe(
      switchMap(() => this.http.post<AuthUser>(`${this.base}/register`, payload)),
    );
  }

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.ensureCsrfCookie().pipe(
      switchMap(() => this.http.post<AuthUser>(`${this.base}/login`, payload)),
      tap((user) => this.currentUser.set(user)),
    );
  }

  logout(): Observable<void> {
    return this.ensureCsrfCookie().pipe(
      switchMap(() => this.http.post<void>(`${this.base}/logout`, null)),
      tap(() => this.currentUser.set(null)),
    );
  }

  me(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(`${this.base}/me`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  /**
   * The backend only issues the XSRF-TOKEN cookie once it has seen a request.
   * A visitor landing straight on /sign-in has no cookie yet, so the first
   * POST would be rejected with 403. If the cookie is missing, make one cheap
   * GET first (its 401 is expected and ignored) so the cookie is set.
   */
  private ensureCsrfCookie(): Observable<unknown> {
    if (/(^|;\s*)XSRF-TOKEN=/.test(this.document.cookie)) {
      return of(null);
    }
    return this.http.get(`${this.base}/me`).pipe(
      map(() => null),
      catchError(() => of(null)),
    );
  }
}