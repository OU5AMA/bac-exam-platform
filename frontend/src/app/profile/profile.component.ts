import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { AVATAR_OPTIONS, avatarName, isAvatarEmoji } from '../shared/avatar-options';

type PreferredLanguage = 'en' | 'fr' | 'ar';

const MAX_SOURCE_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_AVATAR_DIMENSION = 300;

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <section aria-labelledby="profile-title">
      <header class="mb-8">
        <p class="text-sm font-semibold text-[#0A6B6B]">Your account</p>
        <h1 id="profile-title" class="font-display mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Profile</h1>
        <p class="mt-2 max-w-2xl leading-7">Manage your personal details, learning avatar, and language preference.</p>
      </header>

      @if (auth.currentUser(); as user) {
        <div class="grid gap-5 lg:grid-cols-2">
          <section aria-labelledby="personal-info-title" class="rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-7">
            <h2 id="personal-info-title" class="font-display text-xl font-extrabold text-[#0B3B3B]">Personal information</h2>
            <dl class="mt-5 space-y-4">
              <div>
                <dt class="text-xs font-bold uppercase tracking-wide text-[#647171]">Display name</dt>
                <dd class="mt-1">
                  <div class="flex min-h-11 items-center gap-2">
                    <span class="break-words text-base font-semibold text-[#12302F]">{{ user.displayName || 'Add a display name' }}</span>
                    <button type="button" [attr.aria-label]="editingDisplayName() ? 'Close display name editor' : 'Edit display name'" aria-controls="display-name-editor" [attr.aria-expanded]="editingDisplayName()" (click)="toggleDisplayNameEdit(user.displayName)" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0A6B6B] transition-colors hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">
                      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.8 3.2 4 4M3 17l3.7-.8L16.5 6.4a1.8 1.8 0 0 0-2.6-2.6L4.1 13.6 3 17Z" /></svg>
                    </button>
                  </div>
                  <div id="display-name-editor" [hidden]="!editingDisplayName()" class="mt-3">
                    <div class="flex flex-col gap-3 sm:flex-row">
                      <input id="display-name" type="text" maxlength="80" autocomplete="name" [value]="displayNameDraft()" (input)="displayNameDraft.set($any($event.target).value)" [attr.aria-describedby]="displayNameError() ? 'display-name-error' : null" [attr.aria-invalid]="displayNameError() ? 'true' : null" class="min-h-11 min-w-0 flex-1 rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15" />
                      <div class="flex gap-2">
                        <button type="button" [disabled]="savingDisplayName() || !displayNameDraft().trim() || displayNameDraft().trim() === (user.displayName ?? '')" (click)="saveDisplayName()" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A6B6B] px-4 text-sm font-bold text-white transition-colors hover:bg-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-not-allowed disabled:opacity-50">{{ savingDisplayName() ? 'Saving…' : 'Save' }}</button>
                        <button type="button" [disabled]="savingDisplayName()" (click)="cancelDisplayNameEdit(user.displayName)" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#C9D1CF] bg-white px-4 text-sm font-bold text-[#173E3D] hover:bg-[#F7F5F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:opacity-50">Cancel</button>
                      </div>
                    </div>
                    @if (displayNameError()) { <p id="display-name-error" class="mt-2 text-sm font-semibold text-[#A61B1B]" role="alert">{{ displayNameError() }}</p> }
                  </div>
                  @if (displayNameMessage()) { <p class="mt-2 text-sm font-semibold text-[#0E7A55]" role="status">{{ displayNameMessage() }}</p> }
                </dd>
              </div>
              <div><dt class="text-xs font-bold uppercase tracking-wide text-[#647171]">Username</dt><dd class="mt-1 break-words text-base font-semibold text-[#12302F]">@{{ user.username }}</dd></div>
              <div><dt class="text-xs font-bold uppercase tracking-wide text-[#647171]">Email</dt><dd class="mt-1 break-words text-base font-semibold text-[#12302F]">{{ user.email }}</dd></div>
            </dl>
          </section>

          <section aria-labelledby="avatar-title" class="rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-7">
            <h2 id="avatar-title" class="font-display text-xl font-extrabold text-[#0B3B3B]">Profile picture</h2>
            <div class="mt-5 flex flex-wrap items-center gap-4">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E7E5] bg-[#FFF7E5] text-3xl text-[#0A6B6B]">
                @if (isAvatarEmoji(user.profilePictureUrl)) {
                  <span role="img" [attr.aria-label]="avatarName(user.profilePictureUrl) + ' avatar'">{{ user.profilePictureUrl }}</span>
                } @else if (user.profilePictureUrl) {
                  <img [src]="user.profilePictureUrl" alt="Current profile picture" class="h-full w-full object-cover" />
                } @else {
                  <span aria-hidden="true" class="font-bold">{{ user.username.charAt(0).toUpperCase() }}</span>
                }
              </div>
              <div>
                <input #pictureInput id="profile-picture-file" type="file" accept="image/png,image/jpeg,image/gif" [disabled]="pictureUploading()" (change)="handlePictureChange($event)" class="sr-only" />
                <button type="button" [disabled]="pictureUploading()" (click)="pictureInput.click()" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] bg-white px-4 text-sm font-bold text-[#075B5B] transition-colors hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-wait disabled:opacity-60">{{ pictureUploading() ? 'Uploading…' : 'Upload picture' }}</button>
                <p class="mt-2 text-xs leading-5 text-[#667575]">PNG, JPEG, or GIF. Maximum size 10 MB.</p>
              </div>
            </div>
            @if (pictureMessage()) { <p class="mt-3 text-sm font-semibold text-[#0E7A55]" role="status">{{ pictureMessage() }}</p> }
            @if (pictureError()) { <p class="mt-3 text-sm font-semibold text-[#A61B1B]" role="alert">{{ pictureError() }}</p> }

            <h3 class="mt-6 text-sm font-bold text-[#0B3B3B]">Or choose a learning avatar</h3>
            <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Choose a profile avatar">
              @for (avatar of avatarOptions; track avatar.emoji) {
                <button type="button" (click)="selectAvatar(avatar.emoji, avatar.label)" [attr.aria-pressed]="user.profilePictureUrl === avatar.emoji" [attr.aria-label]="avatar.label + ' avatar'" class="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-[#DDE6E1] bg-[#FAFCFB] text-3xl transition hover:border-[#0A6B6B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] aria-pressed:border-[#0A6B6B] aria-pressed:bg-[#E8F2F0]"><span aria-hidden="true">{{ avatar.emoji }}</span><span class="text-xs font-semibold text-[#4B5B5B]">{{ avatar.label }}</span></button>
              }
            </div>
            <p class="mt-3 text-xs leading-5 text-[#667575]">Emoji choices apply for this session. Uploaded photos are saved to your account.</p>
          </section>

          <section aria-labelledby="language-title" class="rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
            <h2 id="language-title" class="font-display text-xl font-extrabold text-[#0B3B3B]">Language preference</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6">Choose your preferred language. This setting is saved on this device; interface translations are not enabled yet.</p>
            <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label for="preferred-language" class="text-sm font-semibold text-[#173E3D]">Preferred language</label>
              <select id="preferred-language" [value]="preferredLanguage()" (change)="saveLanguage($any($event.target).value)" class="min-h-11 w-full max-w-sm rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm font-semibold text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15">
                <option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option>
              </select>
            </div>
            @if (languageMessage()) { <p class="mt-3 text-sm font-semibold text-[#0E7A55]" role="status">{{ languageMessage() }}</p> }
          </section>
        </div>
      } @else {
        <p class="rounded-xl border border-[#E5E7E5] bg-white p-5 text-sm" role="status">Loading your profile…</p>
      }
    </section>
  `,
})
export class ProfileComponent {
  protected readonly auth = inject(AuthService);
  protected readonly avatarOptions = AVATAR_OPTIONS;
  protected readonly isAvatarEmoji = isAvatarEmoji;
  protected readonly avatarName = avatarName;
  protected readonly pictureUploading = signal(false);
  protected readonly pictureMessage = signal('');
  protected readonly pictureError = signal('');
  protected readonly preferredLanguage = signal<PreferredLanguage>('en');
  protected readonly languageMessage = signal('');
  protected readonly displayNameDraft = signal('');
  protected readonly editingDisplayName = signal(false);
  protected readonly savingDisplayName = signal(false);
  protected readonly displayNameMessage = signal('');
  protected readonly displayNameError = signal('');

  constructor() {
    this.displayNameDraft.set(this.auth.currentUser()?.displayName ?? '');
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'en' || savedLanguage === 'fr' || savedLanguage === 'ar') {
      this.preferredLanguage.set(savedLanguage);
    }
  }

  protected selectAvatar(emoji: string, label: string): void {
    this.auth.currentUser.update((user) => user ? { ...user, profilePictureUrl: emoji } : null);
    this.pictureMessage.set(`${label} avatar selected for this session.`);
    this.pictureError.set('');
  }

  protected saveLanguage(value: string): void {
    if (value !== 'en' && value !== 'fr' && value !== 'ar') return;
    this.preferredLanguage.set(value);
    localStorage.setItem('preferredLanguage', value);
    this.languageMessage.set('Language preference saved on this device.');
  }

  protected saveDisplayName(): void {
    const displayName = this.displayNameDraft().trim();
    this.displayNameMessage.set('');
    this.displayNameError.set('');
    if (!displayName) {
      this.displayNameError.set('Enter a display name.');
      return;
    }
    if (displayName.length > 80) {
      this.displayNameError.set('Display names must be 80 characters or fewer.');
      return;
    }

    this.savingDisplayName.set(true);
    this.auth.updateDisplayName(displayName)
      .pipe(finalize(() => this.savingDisplayName.set(false)))
      .subscribe({
        next: () => {
          this.displayNameDraft.set(displayName);
          this.displayNameMessage.set('Display name updated.');
          this.editingDisplayName.set(false);
        },
        error: () => this.displayNameError.set('Could not update your display name. Please try again.'),
      });
  }

  protected beginDisplayNameEdit(displayName?: string): void {
    this.displayNameDraft.set(displayName ?? '');
    this.displayNameError.set('');
    this.displayNameMessage.set('');
    this.editingDisplayName.set(true);
  }

  protected cancelDisplayNameEdit(displayName?: string): void {
    this.displayNameDraft.set(displayName ?? '');
    this.displayNameError.set('');
    this.editingDisplayName.set(false);
  }

  protected toggleDisplayNameEdit(displayName?: string): void {
    if (this.editingDisplayName()) {
      this.cancelDisplayNameEdit(displayName);
    } else {
      this.beginDisplayNameEdit(displayName);
    }
  }

  protected handlePictureChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    this.pictureMessage.set('');
    this.pictureError.set('');
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
      this.pictureError.set('Choose a PNG, JPEG, or GIF image.');
      return;
    }
    if (file.size === 0 || file.size > MAX_SOURCE_IMAGE_BYTES) {
      this.pictureError.set('Choose an image under 10 MB. It will be resized before upload.');
      return;
    }

    this.pictureUploading.set(true);
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      this.pictureUploading.set(false);
      this.pictureError.set('The image could not be opened. Please try another file.');
    };
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (!image.naturalWidth || !image.naturalHeight) {
        this.pictureUploading.set(false);
        this.pictureError.set('The image could not be opened. Please try another file.');
        return;
      }
      const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        this.pictureUploading.set(false);
        this.pictureError.set('The image could not be prepared. Please try another file.');
        return;
      }

      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let resizedImage: string;
      try {
        resizedImage = canvas.toDataURL('image/jpeg', 0.8);
      } catch {
        this.pictureUploading.set(false);
        this.pictureError.set('The image could not be compressed. Please try another file.');
        return;
      }

      this.auth.updateProfilePicture(resizedImage)
        .pipe(finalize(() => this.pictureUploading.set(false)))
        .subscribe({
          next: () => this.pictureMessage.set('Profile picture updated.'),
          error: () => this.pictureError.set('Upload failed. Please try again.'),
        });
    };
    image.src = objectUrl;
  }
}
