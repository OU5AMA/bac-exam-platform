import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';

export interface DailyChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface DailyChallenge {
  date: string;
  title: string;
  description: string;
  durationSeconds: number;
  questions: DailyChallengeQuestion[];
  startedAt: string | null;
  completedAt: string | null;
  score: number | null;
  badgeAwarded: boolean;
}

@Injectable({ providedIn: 'root' })
export class DailyChallengeService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly base = '/api/challenges/daily';

  loadToday(): Observable<DailyChallenge> {
    return this.http.get<DailyChallenge>(this.base);
  }

  start(): Observable<DailyChallenge> {
    return this.post('/start', {});
  }

  submit(answers: Record<string, string>): Observable<DailyChallenge> {
    return this.post('/submit', { answers });
  }

  private post(path: string, body: unknown): Observable<DailyChallenge> {
    const csrfReady = /(^|;\s*)XSRF-TOKEN=/.test(this.document.cookie)
      ? of(null)
      : this.http.get('/api/auth/me').pipe(catchError(() => of(null)));
    return csrfReady.pipe(switchMap(() => this.http.post<DailyChallenge>(`${this.base}${path}`, body)));
  }
}
