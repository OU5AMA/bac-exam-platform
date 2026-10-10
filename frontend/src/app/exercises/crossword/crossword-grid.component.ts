import { Component, computed, input } from '@angular/core';

import { Crossword, CrosswordWord, Direction } from './crossword.model';

interface CrosswordCell {
  key: string;
  row: number;
  col: number;
  open: boolean;
  number: number | null;
  words: Partial<Record<Direction, CrosswordWord>>;
}

@Component({
  selector: 'app-crossword-grid',
  standalone: true,
  template: `
    <section aria-label="Crossword grid" class="mt-8 rounded-lg border border-[#E5E7E5] bg-white p-0 sm:p-6">
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
                <div
                  role="gridcell"
                  [attr.aria-label]="cell.open ? 'Row ' + (cell.row + 1) + ', column ' + (cell.col + 1) + ', open cell' : 'Row ' + (cell.row + 1) + ', column ' + (cell.col + 1) + ', blocked cell'"
                  class="relative aspect-square min-w-0 select-none touch-manipulation"
                  [style.background-color]="cell.open ? '#FFFFFF' : '#0B3B3B'"
                  [style.border]="cell.open ? '1px solid #E5E7E5' : '0'"
                >
                  @if (cell.number !== null) {
                    <span class="absolute left-[2px] top-[2px] text-[10px] leading-none text-[#0A6B6B] sm:left-[3px] sm:top-[3px]">{{ cell.number }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class CrosswordGridComponent {
  readonly crossword = input.required<Crossword>();

  readonly layout = computed(() => {
    const puzzle = this.crossword();
    const startCells = new Map<string, { row: number; col: number }>();
    const wordMap = new Map<string, Partial<Record<Direction, CrosswordWord>>>();

    for (const word of puzzle.words) {
      const startKey = `${word.row},${word.col}`;
      startCells.set(startKey, { row: word.row, col: word.col });

      for (let index = 0; index < word.answer.length; index += 1) {
        const row = word.row + (word.direction === 'down' ? index : 0);
        const col = word.col + (word.direction === 'across' ? index : 0);
        const key = `${row},${col}`;
        const words = wordMap.get(key) ?? {};
        words[word.direction] = word;
        wordMap.set(key, words);
      }
    }

    const numberMap = new Map<string, number>();
    [...startCells.entries()]
      .sort(([, first], [, second]) => first.row - second.row || first.col - second.col)
      .forEach(([key], index) => numberMap.set(key, index + 1));

    const cells: CrosswordCell[] = [];
    const rows: CrosswordCell[][] = [];
    for (let row = 0; row < puzzle.grid.rows; row += 1) {
      const rowCells: CrosswordCell[] = [];
      for (let col = 0; col < puzzle.grid.cols; col += 1) {
        const key = `${row},${col}`;
        const words = wordMap.get(key) ?? {};
        const cell: CrosswordCell = {
          key,
          row,
          col,
          open: Boolean(words.across || words.down),
          number: numberMap.get(key) ?? null,
          words,
        };
        cells.push(cell);
        rowCells.push(cell);
      }
      rows.push(rowCells);
    }

    return { rows, cells, cellMap: new Map(cells.map((cell) => [cell.key, cell.open])), numberMap, wordMap };
  });
}
