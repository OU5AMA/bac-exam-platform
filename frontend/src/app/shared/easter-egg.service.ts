import { Injectable, signal } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class EasterEggService {
  readonly secretFound = signal(false);
  logoClicks = 0;
  private toastTimer?: ReturnType<typeof setTimeout>;

  registerLogoClick(): void {
    this.logoClicks += 1;
    if (this.logoClicks < 5) return;

    this.logoClicks = 0;
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 300, spread: 125, startVelocity: 50, origin: { y: 0.58 }, colors: ['#0A6B6B', '#F5A623', '#1565C0', '#F7F5F0'] });
      window.setTimeout(() => confetti({ particleCount: 140, spread: 150, startVelocity: 35, origin: { y: 0.48 }, colors: ['#0A6B6B', '#F5A623', '#1565C0'] }), 220);
    }
    this.secretFound.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.secretFound.set(false), 6000);
  }

  dismiss(): void {
    this.secretFound.set(false);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = undefined;
  }
}
