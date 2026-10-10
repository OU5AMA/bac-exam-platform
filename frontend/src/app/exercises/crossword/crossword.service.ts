import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Crossword, Difficulty } from './crossword.model';

@Injectable({ providedIn: 'root' })
export class CrosswordService {
  private readonly http = inject(HttpClient);

  load(difficulty: Difficulty): Observable<Crossword> {
    return this.http.get<Crossword>(`/crosswords/2bac-unit1-vocabulary-${difficulty}.json`);
  }
}
