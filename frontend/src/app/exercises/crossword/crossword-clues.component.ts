import { Component, computed, EventEmitter, input, Output, signal } from '@angular/core';

import { Crossword, PlacedWord } from './crossword.model';

@Component({
  selector: 'app-crossword-clues',
  standalone: true,
  template: `
    <aside [attr.aria-label]="'Clues for ' + crossword().title" class="rounded-lg border border-[#E5E7E5] bg-white p-4 sm:p-6">
      <div class="flex items-center justify-between gap-4">
        <h2 class="font-display text-xl font-bold text-[#0B3B3B]">Clues</h2>
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold text-[#0A6B6B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B] lg:hidden"
          [attr.aria-expanded]="expanded()"
          aria-controls="crossword-clue-list"
          (click)="toggleClues()"
        >
          {{ expanded() ? 'Hide clues' : 'Show all clues' }}
        </button>
      </div>

      <div id="crossword-clue-list" class="mt-5 hidden space-y-6 lg:block" [class.hidden]="!expanded()">
        <section aria-labelledby="across-clues-heading">
          <h3 id="across-clues-heading" class="text-sm font-bold uppercase tracking-[0.12em] text-[#4B5B5B]">Across</h3>
          <ul class="mt-2 space-y-1">
            @for (word of wordsByDirection().across; track word.number) {
              <li>
                <button
                  type="button"
                  class="min-h-11 w-full rounded-md px-3 py-2 text-left text-base leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]"
                  [class.font-bold]="isSelected(word)"
                  [style.background-color]="isSelected(word) ? '#E0F2F2' : null"
                  [style.color]="isSelected(word) ? '#0A6B6B' : null"
                  [attr.aria-pressed]="isSelected(word)"
                  (click)="clueSelected.emit(word)"
                >{{ word.number }}. {{ word.clue }}</button>
              </li>
            }
          </ul>
        </section>

        <section aria-labelledby="down-clues-heading">
          <h3 id="down-clues-heading" class="text-sm font-bold uppercase tracking-[0.12em] text-[#4B5B5B]">Down</h3>
          <ul class="mt-2 space-y-1">
            @for (word of wordsByDirection().down; track word.number) {
              <li>
                <button
                  type="button"
                  class="min-h-11 w-full rounded-md px-3 py-2 text-left text-base leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]"
                  [class.font-bold]="isSelected(word)"
                  [style.background-color]="isSelected(word) ? '#E0F2F2' : null"
                  [style.color]="isSelected(word) ? '#0A6B6B' : null"
                  [attr.aria-pressed]="isSelected(word)"
                  (click)="clueSelected.emit(word)"
                >{{ word.number }}. {{ word.clue }}</button>
              </li>
            }
          </ul>
        </section>
      </div>
    </aside>
  `,
})
export class CrosswordCluesComponent {
  readonly crossword = input.required<Crossword>();
  readonly placedWords = input.required<PlacedWord[]>();
  readonly selectedWord = input<PlacedWord | null>(null);
  readonly expanded = signal(false);

  @Output() readonly clueSelected = new EventEmitter<PlacedWord>();

  readonly wordsByDirection = computed(() => {
    const words = this.placedWords();
    return {
      across: words.filter((word) => word.direction === 'across').sort((a, b) => a.number - b.number),
      down: words.filter((word) => word.direction === 'down').sort((a, b) => a.number - b.number),
    };
  });

  isSelected(word: PlacedWord): boolean {
    const selected = this.selectedWord();
    return selected?.number === word.number && selected.direction === word.direction;
  }

  toggleClues(): void {
    this.expanded.update((value) => !value);
  }
}
