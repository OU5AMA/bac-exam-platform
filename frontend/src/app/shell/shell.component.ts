import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-[#F7F5F0] text-[#4B5B5B]">
      <header class="sticky top-0 z-30 border-b border-[#E5E7E5] bg-[#F7F5F0]/95 backdrop-blur">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a routerLink="/dashboard" aria-label="9issemi dashboard" class="inline-flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
            <img src="tiny_logo.png" alt="" class="h-7 w-7 object-contain" />
            <span class="font-display text-xl font-extrabold tracking-[-0.04em] text-[#0B3B3B]">9issemi</span>
          </a>

          <nav aria-label="Dashboard navigation" class="hidden h-full items-center gap-7 md:flex">
            <a routerLink="/dashboard" routerLinkActive="text-[#0A6B6B] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#0A6B6B]" [routerLinkActiveOptions]="{ exact: true }" class="relative inline-flex h-full items-center text-sm font-semibold text-[#4B5B5B] transition-colors hover:text-[#0A6B6B]">Dashboard</a>
            <a href="#" class="inline-flex h-full items-center text-sm font-medium text-[#4B5B5B] transition-colors hover:text-[#0A6B6B]">Classes</a>
            <a href="#" class="inline-flex h-full items-center text-sm font-medium text-[#4B5B5B] transition-colors hover:text-[#0A6B6B]">Exams</a>
            <a href="#" class="inline-flex h-full items-center text-sm font-medium text-[#4B5B5B] transition-colors hover:text-[#0A6B6B]">Progress</a>
          </nav>

          <div #menuBoundary class="relative">
            <button
              #menuButton
              type="button"
              aria-label="Open user menu"
              aria-controls="user-menu"
              [attr.aria-expanded]="menuOpen()"
              (click)="menuOpen.update((open) => !open)"
              class="inline-flex max-w-[min(48vw,20rem)] items-center gap-2 rounded-full border border-[#E5E7E5] bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-[#12302F] transition-colors hover:border-[#0A6B6B]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A6B6B] text-sm font-bold text-white" aria-hidden="true">{{ initial() }}</span>
              <span class="hidden truncate sm:inline">{{ auth.currentUser()?.email }}</span>
              <svg class="h-4 w-4 shrink-0 text-[#4B5B5B]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
            </button>

            @if (menuOpen()) {
              <div id="user-menu" role="menu" aria-label="User account" class="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-[#E5E7E5] bg-white shadow-lg shadow-[#0B3B3B]/10">
                <div class="border-b border-[#E5E7E5] px-4 py-3">
                  <p class="truncate text-sm font-semibold text-[#12302F]">{{ auth.currentUser()?.email }}</p>
                  <p class="mt-1 text-xs font-medium text-[#4B5B5B]">{{ auth.currentUser()?.roles?.[0] ?? 'Member' }}</p>
                </div>
                <div class="p-2">
                  <button type="button" role="menuitem" (click)="signOut()" class="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-semibold text-[#0A6B6B] hover:bg-[#F7F5F0] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A6B6B]">Sign out</button>
                </div>
              </div>
            }
          </div>
        </div>
      </header>

      <main class="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);

  @ViewChild('menuBoundary') private menuBoundary?: ElementRef<HTMLDivElement>;
  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  protected initial(): string {
    return this.auth.currentUser()?.email?.charAt(0).toUpperCase() || '?';
  }

  protected signOut(): void {
    this.auth
      .logout()
      .pipe(finalize(() => this.menuOpen.set(false)))
      .subscribe({ next: () => void this.router.navigate(['/sign-in']) });
  }

  @HostListener('document:click', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.menuBoundary?.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.menuButton?.nativeElement.focus();
    }
  }
}
