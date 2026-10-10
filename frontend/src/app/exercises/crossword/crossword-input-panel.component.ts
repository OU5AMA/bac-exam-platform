import { Component, ElementRef, EventEmitter, input, OnChanges, Output, SimpleChanges, ViewChild, signal } from '@angular/core';

import { PlacedWord } from './crossword.model';

@Component({
  selector: 'app-crossword-input-panel',
  standalone: true,
  template: `
    <section class="border-t border-[#E5E7E5] p-4 sm:p-6" aria-label="Answer panel">
      @if (selectedWord(); as word) {
        <h2 class="font-display text-lg font-bold text-[#0A6B6B]">{{ word.number }} {{ word.direction === 'across' ? 'Across' : 'Down' }}</h2>
        <label for="crossword-answer" class="mt-2 block text-base leading-6 text-[#4B5B5B]">{{ word.clue }}</label>

        <div class="mt-4 max-w-xl">
          <input
            #answerInput
            id="crossword-answer"
            class="auth-input text-base uppercase"
            type="text"
            inputmode="text"
            autocapitalize="characters"
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="done"
            [value]="answer()"
            [attr.aria-invalid]="lengthMismatch() !== null"
            [attr.aria-describedby]="lengthMismatch() ? 'crossword-answer-error' : null"
            (input)="updateAnswer($event)"
            (keydown.enter)="confirm()"
          />
          @if (lengthMismatch(); as message) {
            <p id="crossword-answer-error" class="auth-error" role="alert">{{ message }}</p>
          }
        </div>

        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" class="auth-btn min-h-11 w-full max-w-[160px]" (click)="confirm()">Confirm</button>
          <button
            type="button"
            class="min-h-11 w-full max-w-[160px] rounded-[0.625rem] border border-[#0A6B6B] bg-white px-4 py-3 font-semibold text-[#0A6B6B] transition-colors hover:bg-[#E0F2F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]"
            (click)="clueRequested.emit(word)"
          >Clue</button>
        </div>
      } @else {
        <p class="text-base text-[#4B5B5B]">Select a word to begin.</p>
      }
    </section>
  `,
})
export class CrosswordInputPanelComponent implements OnChanges {
  readonly selectedWord = input<PlacedWord | null>(null);
  readonly lengthMismatch = input<string | null>(null);
  readonly answer = signal('');

  @Output() readonly confirmed = new EventEmitter<{ word: PlacedWord; answer: string }>();
  @Output() readonly clueRequested = new EventEmitter<PlacedWord>();

  @ViewChild('answerInput') private answerInput?: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWord']) this.answer.set('');
  }

  updateAnswer(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercase = input.value.toUpperCase();
    input.value = uppercase;
    this.answer.set(uppercase);
  }

  confirm(): void {
    const word = this.selectedWord();
    if (word) this.confirmed.emit({ word, answer: this.answer() });
  }

  focusInput(): void {
    this.answerInput?.nativeElement.focus();
  }
}
