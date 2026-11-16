import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth.service';

export interface ProgressPayload {
  unitNumber: number;
  skill: string;
  score: number;
  maxScore: number;
}

export type SaveChoice = 'saved' | 'skipped' | 'cancelled';
export type LoginGateKind = 'save-score' | 'ai-feedback';

@Injectable({ providedIn: 'root' })
export class LoginGateService {
  readonly dialog = signal<LoginGateKind | null>(null);
  readonly allowSkip = signal(false);

  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private pendingPayload = signal<ProgressPayload | null>(this.readPending());
  private resolveSave: ((choice: SaveChoice) => void) | null = null;
  private savingPending = false;

  constructor() {
    effect(() => {
      if (!this.auth.currentUser() || !this.pendingPayload() || this.savingPending) return;
      const payload = this.pendingPayload();
      if (payload) void this.savePending(payload);
    });
  }

  async requestSave(payload: ProgressPayload, options: { allowSkip: boolean }): Promise<SaveChoice> {
    if (this.auth.currentUser()) {
      await firstValueFrom(this.http.post('/api/progress/save', payload));
      return 'saved';
    }

    this.setPending(payload);
    this.allowSkip.set(options.allowSkip);
    this.dialog.set('save-score');
    return new Promise((resolve) => { this.resolveSave = resolve; });
  }

  requireSignInForAi(): boolean {
    if (this.auth.currentUser()) return true;
    this.allowSkip.set(false);
    this.dialog.set('ai-feedback');
    return false;
  }

  continueWithoutSaving(): void {
    this.clearPending();
    this.dialog.set(null);
    this.allowSkip.set(false);
    this.resolveSave?.('skipped');
    this.resolveSave = null;
  }

  close(): void {
    this.dialog.set(null);
    this.allowSkip.set(false);
    if (this.pendingPayload()) {
      this.clearPending();
      this.resolveSave?.('cancelled');
      this.resolveSave = null;
    }
  }

  signIn(): void { this.goToAuth('/sign-in'); }
  signUp(): void { this.goToAuth('/sign-up'); }

  private goToAuth(path: string): void {
    const returnUrl = this.safeReturnUrl(this.router.url);
    this.dialog.set(null);
    void this.router.navigate([path], { queryParams: { returnUrl } });
  }

  private async savePending(payload: ProgressPayload): Promise<void> {
    this.savingPending = true;
    try {
      await firstValueFrom(this.http.post('/api/progress/save', payload));
      this.clearPending();
      this.resolveSave?.('saved');
      this.resolveSave = null;
    } catch {
      this.clearPending();
      this.resolveSave?.('cancelled');
      this.resolveSave = null;
    } finally {
      this.savingPending = false;
    }
  }

  private setPending(payload: ProgressPayload): void {
    this.pendingPayload.set(payload);
    try { globalThis.sessionStorage?.setItem('9issemi.pending-progress', JSON.stringify(payload)); } catch { /* Storage may be unavailable. */ }
  }

  private clearPending(): void {
    this.pendingPayload.set(null);
    try { globalThis.sessionStorage?.removeItem('9issemi.pending-progress'); } catch { /* Storage may be unavailable. */ }
  }

  private readPending(): ProgressPayload | null {
    try {
      const raw = globalThis.sessionStorage?.getItem('9issemi.pending-progress');
      if (!raw) return null;
      const value = JSON.parse(raw) as ProgressPayload;
      return Number.isInteger(value.unitNumber) && typeof value.skill === 'string'
        && Number.isFinite(value.score) && Number.isFinite(value.maxScore) ? value : null;
    } catch { return null; }
  }

  private safeReturnUrl(value: string): string {
    return value.startsWith('/') && !value.startsWith('//') ? value : '/2-bac';
  }
}
