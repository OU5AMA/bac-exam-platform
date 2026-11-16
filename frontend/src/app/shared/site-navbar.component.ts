import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { EasterEggService } from './easter-egg.service';

@Component({
  selector: 'app-site-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header #navbarHeader [class.-translate-y-full]="navHidden()" [attr.inert]="navHidden() ? '' : null" class="sticky top-0 z-40 border-b border-[#E5E7E5] bg-[#F7F5F0]/95 text-[#4B5B5B] backdrop-blur transition-transform duration-300 ease-out motion-reduce:transition-none">
      <div class="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 lg:px-12">
        <a routerLink="/" (click)="easterEgg.registerLogoClick()" aria-label="9issemi home" class="inline-flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <img src="tiny_logo.png" alt="" class="h-9 w-auto object-contain" />
          <span class="font-display text-lg font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-xl">9issemi</span>
        </a>

        <nav aria-label="Main navigation" class="flex items-center gap-2 sm:gap-5">
          <a routerLink="/2-bac" routerLinkActive="text-[#0A6B6B]" [routerLinkActiveOptions]="{ exact: false }" class="inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] sm:px-3">Courses</a>
          <a routerLink="/2-bac/reading" routerLinkActive="text-[#0A6B6B]" class="hidden min-h-11 items-center rounded-sm px-3 text-sm font-semibold hover:text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] sm:inline-flex">Reading</a>
        </nav>

        <div #accountBoundary class="relative flex shrink-0 items-center gap-2">
          @if (auth.currentUser(); as user) {
            <button #accountButton type="button" (click)="menuOpen.update((open) => !open)" [attr.aria-label]="'Open account menu for ' + accountName()" aria-controls="account-menu" [attr.aria-expanded]="menuOpen()" [attr.title]="accountName()" class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#E5E7E5] bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-[#12302F] transition-colors hover:border-[#0A6B6B]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A6B6B] px-1 text-xs font-extrabold text-white" aria-hidden="true">{{ accountAbbreviation() }}</span>
              @if (accountName().length <= 14) { <span class="hidden max-w-40 truncate sm:inline">{{ accountName() }}</span> }
              <svg class="h-4 w-4 shrink-0 text-[#4B5B5B] transition-transform" [class.rotate-180]="menuOpen()" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
            </button>
            @if (menuOpen()) {
              <div id="account-menu" class="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E5E7E5] bg-white shadow-xl shadow-[#0B3B3B]/15">
                <nav aria-label="Account" class="p-2">
                  <a routerLink="/profile" (click)="closeMenu()" class="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A6B6B]">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F2F0] text-xs font-extrabold text-[#0A6B6B]" aria-hidden="true">{{ accountAbbreviation() }}</span>
                    <span class="min-w-0"><span class="block truncate font-bold text-[#0B3B3B]">{{ accountName() }}</span><span class="block text-xs text-[#667575]">Profile</span></span>
                  </a>
                  <a routerLink="/dashboard" (click)="closeMenu()" class="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[#173E3D] hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A6B6B]">Dashboard</a>
                </nav>
                <div class="border-t border-[#E5E7E5] px-4 py-3">
                  <label for="navbar-language" class="block text-sm font-bold text-[#0B3B3B]">Language</label>
                  <select id="navbar-language" [value]="preferredLanguage()" (change)="saveLanguage($any($event.target).value)" class="mt-2 min-h-11 w-full rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm font-semibold text-[#173E3D] focus:border-[#0A6B6B] focus:outline-2 focus:outline-offset-2 focus:outline-[#0A6B6B]">
                    <option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option>
                  </select>
                  <p class="mt-2 text-xs leading-5 text-[#667575]">Preference is saved on this device. Interface translations are not enabled yet.</p>
                  @if (languageMessage()) { <p class="mt-2 text-xs font-semibold text-[#176346]" role="status">{{ languageMessage() }}</p> }
                </div>
                <div class="border-t border-[#E5E7E5] p-2">
                  <button type="button" (click)="signOut()" class="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold text-[#0A6B6B] hover:bg-[#F1F8F5] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A6B6B]">Sign out</button>
                </div>
              </div>
            }
          } @else {
            <a routerLink="/sign-in" class="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-[#0A6B6B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Sign in</a>
            <a routerLink="/sign-up" class="hidden min-h-10 items-center rounded-lg bg-[#0A6B6B] px-4 text-sm font-bold text-white hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623] sm:inline-flex">Sign up</a>
          }
        </div>
      </div>
    </header>

    @if (easterEgg.secretFound()) {
      <div class="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-[#F5C56D] bg-[#0B3B3B] px-5 py-4 text-white shadow-xl" role="status" aria-live="polite">
        <p class="font-semibold">🤫 You found the secret! +50 Bonus Points!</p>
        <button type="button" (click)="easterEgg.dismiss()" aria-label="Dismiss secret found message" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">×</button>
      </div>
    }
  `,
})
export class SiteNavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly easterEgg = inject(EasterEggService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  protected readonly navHidden = signal(false);
  private lastScrollY = 0;
  protected readonly menuOpen = signal(false);
  protected readonly preferredLanguage = signal<'en' | 'fr' | 'ar'>(this.readPreferredLanguage());
  protected readonly languageMessage = signal('');
  protected readonly accountName = computed(() => {
    const user = this.auth.currentUser();
    return user?.displayName?.trim() || user?.username || 'Account';
  });
  protected readonly accountAbbreviation = computed(() => {
    const words = this.accountName().trim().split(/\s+/).filter(Boolean);
    if (words.length > 1) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    return words[0].slice(0, 2).toUpperCase();
  });

  @ViewChild('accountBoundary') private accountBoundary?: ElementRef<HTMLDivElement>;
  @ViewChild('accountButton') private accountButton?: ElementRef<HTMLButtonElement>;

  constructor() {
    this.auth.me().pipe(catchError(() => of(null))).subscribe();
  }

  @ViewChild('navbarHeader') private navbarHeader?: ElementRef<HTMLElement>;

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    const currentY = Math.max(0, this.document.defaultView?.scrollY ?? 0);
    if (currentY <= 72) {
      this.navHidden.set(false);
      this.lastScrollY = currentY;
      return;
    }

    if (this.navbarHeader?.nativeElement.contains(this.document.activeElement)) {
      this.navHidden.set(false);
      this.lastScrollY = currentY;
      return;
    }

    const movement = currentY - this.lastScrollY;
    if (Math.abs(movement) < 8) return;
    this.navHidden.set(movement > 0);
    this.lastScrollY = currentY;
  }

  protected signOut(): void {
    this.closeMenu();
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/sign-in']),
    });
  }

  protected closeMenu(): void { this.menuOpen.set(false); }

  protected saveLanguage(value: string): void {
    if (value !== 'en' && value !== 'fr' && value !== 'ar') return;
    this.preferredLanguage.set(value);
    this.languageMessage.set('Language preference saved on this device.');
    try { localStorage.setItem('preferredLanguage', value); } catch { /* Keep the selected value for this session. */ }
  }

  private readPreferredLanguage(): 'en' | 'fr' | 'ar' {
    try {
      const value = localStorage.getItem('preferredLanguage');
      return value === 'fr' || value === 'ar' ? value : 'en';
    } catch { return 'en'; }
  }

  @HostListener('document:click', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.accountBoundary?.nativeElement.contains(event.target as Node)) this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.accountButton?.nativeElement.focus();
  }
}
