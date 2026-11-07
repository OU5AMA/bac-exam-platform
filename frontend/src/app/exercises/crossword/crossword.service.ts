import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Crossword } from './crossword.model';

@Injectable({ providedIn: 'root' })
export class CrosswordService {
  private readonly http = inject(HttpClient);

  loadById(id: string): Observable<Crossword> {
    const match = id.match(/^unit-(\d+)_(easy|normal|hard)_(\d+)$/);
    if (!match) throw new Error(`Unknown crossword id: ${id}`);
    const [, unitId, difficulty, number] = match;
    return this.http.get<Crossword>(`/crosswords/unit-${unitId}/${difficulty}-${number}.json`);
  }
}
