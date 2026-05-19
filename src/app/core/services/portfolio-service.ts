import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position-model';


@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);

  // Replace 5095 with your actual http port
  private readonly API = 'http://localhost:5089/api/positions';

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(this.API);
  }

  addPosition(position: Position): Observable<Position> {
    return this.http.post<Position>(this.API, position);
  }

  removePosition(position: Position): Observable<void> {
    return this.http.delete<void>(`${this.API}/${position.ticker}`);
  }

  // updateCurrentPrice(ticker: string, price: number): Observable<void> {
  //   // You'll implement this properly in Phase 4 when Finnhub moves to backend
  //   // For now just a placeholder so StockPriceService doesn't break
  //   return this.http.patch<void>(`${this.API}/${ticker}/price`, { currentPrice: price });
  // }

  getTotalValue(): number {
    // Placeholder implementation, replace with actual logic in Phase 4
    return 0;
  }

  getTotalPnL(): number {
    // Placeholder implementation, replace with actual logic in Phase 4
    return 0;
  }

}