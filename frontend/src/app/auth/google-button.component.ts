import { Component } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-google-button',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="signIn()"
      class="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 py-3 text-sm font-medium text-[#1F1F1F] shadow-sm transition-colors hover:bg-[#F8FAFD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] active:bg-[#F1F4F9]"
    >
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/>
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/>
        <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z"/>
        <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z"/>
      </svg>
      <span>Sign in with Google</span>
    </button>
  `,
})
export class GoogleButtonComponent {
  protected signIn(): void {
    window.location.href = `${environment.oauthBase}/oauth2/authorization/google`;
  }
}
