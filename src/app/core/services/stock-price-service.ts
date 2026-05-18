import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinnhubQuote } from '../models/position-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class StockPriceService {
  private http = inject(HttpClient);
  private readonly API_KEY = environment.finnhubApiKey;
  public readonly URL = "https://finnhub.io/api/v1";

  getQuote(ticker: string): Observable<FinnhubQuote> {
    const url = `${this.URL}/quote?symbol=${ticker}&token=${this.API_KEY}`;
    return this.http.get<FinnhubQuote>(url);
  }
}
