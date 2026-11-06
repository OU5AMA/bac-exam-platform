import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ClassApiService, ClassSummary } from './class-api.service';

@Component({
  selector: 'app-class-panel',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section aria-labelledby="my-class-heading" class="mt-8">
      <div class="mb-4">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">Learn together</p>
        <h2 id="my-class-heading" class="font-display mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B]">My Class</h2>
      </div>

      @if (loading()) {
        <div class="rounded-2xl border border-[#E1E7E3] bg-white p-6 text-sm text-[#4B5B5B]" role="status" aria-live="polite">
          <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0A6B6B] border-r-transparent align-[-3px]" aria-hidden="true"></span>
          Loading your class…
        </div>
      } @else if (classInfo(); as info) {
        <article class="rounded-2xl border border-[#D9E8E2] bg-white p-5 shadow-sm sm:p-6">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <h3 class="font-display text-xl font-extrabold text-[#0B3B3B]">{{ info.name }}</h3>
              <p class="mt-2 text-sm text-[#4B5B5B]">{{ info.memberCount }}/{{ info.maxMembers }} students · Rank #{{ info.rank }}</p>
              <p class="mt-1 text-sm font-semibold text-[#0A6B6B]">Avg. {{ info.averagePoints }} pts/student</p>
              <p class="mt-1 text-xs text-[#667575]">{{ info.totalPoints }} total class points</p>
              <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-[#667575]">Class code: <span class="select-all rounded bg-[#F1F6F3] px-2 py-1 font-mono text-sm text-[#12302F]">{{ info.joinCode }}</span></p>
            </div>
            <a routerLink="/leaderboard" class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white transition hover:bg-[#075B5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">View class leaderboard</a>
          </div>
        </article>
      } @else {
        <article class="rounded-2xl border border-[#D9E8E2] bg-white p-5 shadow-sm sm:p-6">
          <h3 class="font-display text-lg font-extrabold text-[#0B3B3B]">You are not in a class yet.</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-[#4B5B5B]">Create a class for your friends or join one with a class code. Classes can have up to 20 students.</p>
          <div class="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" (click)="openDialog('create')" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#075B5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Create a class</button>
            <button type="button" (click)="openDialog('join')" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] bg-white px-5 text-sm font-bold text-[#075B5B] hover:bg-[#E8F2F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Join a class</button>
          </div>
        </article>
      }

      @if (error()) { <p class="mt-3 rounded-lg bg-[#FDECEA] px-4 py-3 text-sm font-semibold text-[#7A1810]" role="alert">{{ error() }} <button type="button" (click)="loadClass()" class="ml-2 underline underline-offset-2">Try again</button></p> }

      <dialog #classDialog aria-labelledby="class-dialog-title" (close)="clearDialog()" class="w-[min(92vw,30rem)] rounded-2xl border border-[#D9E8E2] p-0 shadow-2xl backdrop:bg-[#0B3B3B]/50">
        <div class="p-6 sm:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">My Class</p>
              <h2 id="class-dialog-title" class="font-display mt-2 text-xl font-extrabold text-[#0B3B3B]">{{ dialogMode() === 'create' ? 'Create a class' : 'Join a class' }}</h2>
            </div>
            <button type="button" (click)="closeDialog()" aria-label="Close dialog" class="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-[#536361] hover:bg-[#F1F6F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">×</button>
          </div>
          <form class="mt-5" (ngSubmit)="submit()">
            @if (dialogMode() === 'create') {
              <label for="class-name" class="block text-sm font-semibold text-[#173E3D]">Class name</label>
              <input id="class-name" name="className" [(ngModel)]="name" maxlength="100" required autocomplete="off" placeholder="e.g. 2Bac SM-A" class="mt-2 min-h-11 w-full rounded-lg border border-[#C9D1CF] px-3 text-sm text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15" />
            } @else {
              <label for="join-code" class="block text-sm font-semibold text-[#173E3D]">6-character class code</label>
              <input id="join-code" name="joinCode" [(ngModel)]="joinCode" minlength="6" maxlength="7" required autocomplete="off" autocapitalize="characters" placeholder="ABC-123" class="mt-2 min-h-11 w-full rounded-lg border border-[#C9D1CF] px-3 font-mono text-sm uppercase tracking-wider text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15" />
            }
            @if (error()) { <p class="mt-3 text-sm font-semibold text-[#A61B1B]" role="alert">{{ error() }}</p> }
            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" (click)="closeDialog()" class="min-h-11 rounded-lg border border-[#C9D1CF] px-4 text-sm font-bold text-[#173E3D] hover:bg-[#F6F8F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Cancel</button>
              <button type="submit" [disabled]="saving()" class="min-h-11 rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#075B5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] disabled:cursor-wait disabled:opacity-60">{{ saving() ? 'Please wait…' : dialogMode() === 'create' ? 'Create class' : 'Join class' }}</button>
            </div>
          </form>
        </div>
      </dialog>
    </section>
  `,
})
export class ClassPanelComponent implements OnInit {
  private readonly api = inject(ClassApiService);
  @ViewChild('classDialog') private readonly classDialog?: ElementRef<HTMLDialogElement>;
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly classInfo = signal<ClassSummary | null>(null);
  protected readonly error = signal('');
  protected readonly dialogMode = signal<'create' | 'join'>('create');
  protected name = '';
  protected joinCode = '';

  ngOnInit(): void { this.loadClass(); }

  protected loadClass(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.myClass().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (value) => this.classInfo.set(value),
      error: () => this.error.set('We could not load your class right now.'),
    });
  }

  protected openDialog(mode: 'create' | 'join'): void {
    this.dialogMode.set(mode);
    this.error.set('');
    this.classDialog?.nativeElement.showModal();
  }

  protected closeDialog(): void { this.classDialog?.nativeElement.close(); }
  protected clearDialog(): void { this.error.set(''); }

  protected submit(): void {
    if (this.saving()) return;
    this.error.set('');
    const request = this.dialogMode() === 'create'
      ? this.api.create(this.name.trim())
      : this.api.join(this.joinCode.trim());
    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (value) => {
        this.classInfo.set(value);
        this.name = '';
        this.joinCode = '';
        this.closeDialog();
      },
      error: (err: { error?: { message?: string } }) => this.error.set(err.error?.message ?? 'We could not complete that request. Check the details and try again.'),
    });
  }
}
