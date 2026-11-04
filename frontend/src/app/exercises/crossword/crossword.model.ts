export type Direction = 'across' | 'down';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface CrosswordWord {
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface Crossword {
  id: string;
  title: string;
  subtitle?: string;
  units?: string[];
  difficulty: Difficulty;
  grid: { rows: number; cols: number };
  words: CrosswordWord[];
}

export interface PlacedWord extends CrosswordWord {
  number: number;
  length: number;
  cells: { row: number; col: number }[];
}


export interface CrosswordManifestEntry {
  id: string;
  title: string;
  difficulty: Difficulty;
  file: string;
  wordCount: number;
}

export interface CrosswordManifest {
  unit: string;
  unitTitle: string;
  crosswords: CrosswordManifestEntry[];
}
