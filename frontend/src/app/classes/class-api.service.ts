import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';

export interface ClassSummary {
  id: number;
  name: string;
  joinCode: string;
  memberCount: number;
  maxMembers: number;
  totalPoints: number;
  rank: number;
}

export interface ClassLeaderboardEntry {
  id: number;
  name: string;
  memberCount: number;
  totalPoints: number;
  rank: number;
  currentClass: boolean;
}

export interface LeaderboardResponse {
  topClasses: ClassLeaderboardEntry[];
  myClass: ClassLeaderboardEntry | null;
}

@Injectable({ providedIn: 'root' })
export class ClassApiService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly base = '/api/classes';

  myClass(): Observable<ClassSummary | null> {
    return this.http.get<ClassSummary | null>(`${this.base}/my-class`);
  }

  leaderboard(): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>(`${this.base}/leaderboard`);
  }

  create(name: string): Observable<ClassSummary> {
    return this.post<ClassSummary>('', { name });
  }

  join(joinCode: string): Observable<ClassSummary> {
    return this.post<ClassSummary>('/join', { joinCode });
  }

  private post<T>(path: string, body: unknown): Observable<T> {
    const csrfReady = /(^|;\s*)XSRF-TOKEN=/.test(this.document.cookie)
      ? of(null)
      : this.http.get('/api/auth/me').pipe(catchError(() => of(null)));
    return csrfReady.pipe(switchMap(() => this.http.post<T>(`${this.base}${path}`, body)));
  }
}
