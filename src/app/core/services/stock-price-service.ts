import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinnhubQuote } from '../models/position-model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockPriceService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:5089/api/prices';

  getQuote(ticker: string): Observable<FinnhubQuote> {
    return this.http.get<FinnhubQuote>(`${this.API}/${ticker}`);
  }
}
