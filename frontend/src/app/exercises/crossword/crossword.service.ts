import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Crossword } from './crossword.model';

const CROSSWORD_FILES: Record<string, string> = {
  'unit-1_easy_1': 'easy-1.json',
  'unit-1_easy_2': 'easy-2.json',
  'unit-1_easy_3': 'easy-3.json',
  'unit-1_easy_4': 'easy-4.json',
  'unit-1_easy_5': 'easy-5.json',
  'unit-1_easy_6': 'easy-6.json',
  'unit-1_easy_7': 'easy-7.json',
  'unit-1_normal_1': 'normal-1.json',
  'unit-1_normal_2': 'normal-2.json',
  'unit-1_normal_3': 'normal-3.json',
  'unit-1_normal_4': 'normal-4.json',
  'unit-1_normal_5': 'normal-5.json',
  'unit-1_hard_1': 'hard-1.json',
};

@Injectable({ providedIn: 'root' })
export class CrosswordService {
  private readonly http = inject(HttpClient);

  loadById(id: string): Observable<Crossword> {
    const file = CROSSWORD_FILES[id];
    if (!file) throw new Error(`Unknown crossword id: ${id}`);
    return this.http.get<Crossword>(`/crosswords/unit-1/${file}`);
  }
}
