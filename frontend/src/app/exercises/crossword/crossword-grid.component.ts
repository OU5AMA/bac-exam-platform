import { Component, computed, EventEmitter, input, Output } from '@angular/core';

import { Crossword, Direction, PlacedWord } from './crossword.model';

interface CrosswordCell {
  key: string;
  row: number;
  col: number;
  open: boolean;
  number: number | null;
  words: Partial<Record<Direction, PlacedWord>>;
}

@Component({
  selector: 'app-crossword-grid',
  standalone: true,
  template: `
    <section aria-label="Crossword grid" class="rounded-lg border border-[#E5E7E5] bg-white p-0 sm:p-6">
      <h2 class="sr-only">Crossword grid</h2>
      <div class="flex w-full justify-center">
        <div
          role="grid"
          aria-label="Crossword puzzle grid"
          class="grid w-full"
          [style.grid-template-columns]="'repeat(' + crossword().grid.cols + ', minmax(0, 1fr))'"
          [style.max-width.px]="crossword().grid.cols * 40"
        >
          @for (row of layout().rows; track $index) {
            <div role="row" class="contents">
              @for (cell of row; track cell.key) {
                @if (cell.open) {
                  <button
                    type="button"
                    role="gridcell"
                    [attr.aria-label]="cellLabel(cell)"
                    class="relative flex aspect-square min-w-0 cursor-pointer select-none items-center justify-center p-0 text-base font-bold leading-none text-[#0B3B3B] touch-manipulation focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A6B6B]"
                    [style.background-color]="cellBackground(cell)"
                    [style.color]="cellColor(cell)"
                    [style.border]="'1px solid #E5E7E5'"
                    (click)="selectCell(cell)"
                  >
                    @if (cell.number !== null) {
                      <span class="pointer-events-none absolute left-[2px] top-[2px] text-[10px] font-normal leading-none text-[#0A6B6B] sm:left-[3px] sm:top-[3px]">{{ cell.number }}</span>
                    }
                    {{ filledLetters().get(cell.key) ?? '' }}
                  </button>
                } @else {
                  <div role="gridcell" [attr.aria-label]="'Row ' + (cell.row + 1) + ', column ' + (cell.col + 1) + ', blocked cell'" class="aspect-square min-w-0 bg-[#0B3B3B]"></div>
                }
              }
            </div>
          }
        </div>
      </div>
      <ng-content />
    </section>
  `,
})
export class CrosswordGridComponent {
  readonly crossword = input.required<Crossword>();
  readonly placedWords = input.required<PlacedWord[]>();
  readonly selectedWord = input<PlacedWord | null>(null);
  readonly filledLetters = input.required<Map<string, string>>();
  readonly revealedCells = input.required<Set<string>>();
  readonly checkedCells = input.required<Map<string, 'correct' | 'wrong'>>();

  @Output() readonly wordSelected = new EventEmitter<PlacedWord>();

  readonly layout = computed(() => {
    const puzzle = this.crossword();
    const words = this.placedWords();
    const wordMap = new Map<string, Partial<Record<Direction, PlacedWord>>>();

    for (const word of words) {
      for (const cell of word.cells) {
        const key = `${cell.row},${cell.col}`;
        const crossingWords = wordMap.get(key) ?? {};
        crossingWords[word.direction] = word;
        wordMap.set(key, crossingWords);
      }
    }

    const numberMap = new Map<string, number>();
    for (const word of words) numberMap.set(`${word.row},${word.col}`, word.number);

    const rows: CrosswordCell[][] = [];
    for (let row = 0; row < puzzle.grid.rows; row += 1) {
      const rowCells: CrosswordCell[] = [];
      for (let col = 0; col < puzzle.grid.cols; col += 1) {
        const key = `${row},${col}`;
        const crossingWords = wordMap.get(key) ?? {};
        rowCells.push({
          key,
          row,
          col,
          open: Boolean(crossingWords.across || crossingWords.down),
          number: numberMap.get(key) ?? null,
          words: crossingWords,
        });
      }
      rows.push(rowCells);
    }

    return { rows, wordMap, numberMap };
  });

  cellLabel(cell: CrosswordCell): string {
    const letter = this.filledLetters().get(cell.key);
    const checked = this.checkedCells().get(cell.key);
    return `Row ${cell.row + 1}, column ${cell.col + 1}${letter ? `, letter ${letter}` : ''}${checked ? `, ${checked}` : ''}`;
  }

  cellBackground(cell: CrosswordCell): string {
    const checked = this.checkedCells().get(cell.key);
    if (checked === 'correct') return '#DCF2E8';
    if (checked === 'wrong') return '#FDECEA';
    if (this.revealedCells().has(cell.key)) return '#FDF2DC';
    if (this.selectedWord()?.cells.some(({ row, col }) => row === cell.row && col === cell.col)) return '#E0F2F2';
    return '#FFFFFF';
  }

  cellColor(cell: CrosswordCell): string {
    const checked = this.checkedCells().get(cell.key);
    if (checked === 'correct') return '#0E8A5F';
    if (checked === 'wrong') return '#B42318';
    return '#0B3B3B';
  }

  selectCell(cell: CrosswordCell): void {
    const options = [cell.words.across, cell.words.down].filter((word): word is PlacedWord => Boolean(word));
    if (options.length === 0) return;

    const selected = this.selectedWord();
    const currentIndex = selected ? options.findIndex((word) => this.isSameWord(word, selected)) : -1;
    const word = options.length > 1 && currentIndex >= 0 ? options[(currentIndex + 1) % options.length] : options[0];
    this.wordSelected.emit(word);
  }

  private isSameWord(first: PlacedWord, second: PlacedWord): boolean {
    return first.number === second.number && first.direction === second.direction;
  }
}
