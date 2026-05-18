import { Injectable } from '@angular/core';
import { Position } from '../models/position-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly STORAGE_KEY = "portfolio-positions";
  private positions: Position[] = [];

  updateCurrentPrice(ticker: string, newPrice: number): void {
    const position = this.positions.find(p => p.ticker === ticker);
    if (!position) return;

    position.currentPrice = newPrice
    this.saveToStorage();
  }

  private loadFromStorage(): Position[] {
    const raw = localStorage.getItem(this.STORAGE_KEY)
    return raw ? JSON.parse(raw) : [];
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.positions))
  }

  private removeFromStorage(position: Position): void {
    const index = this.positions.indexOf(position);
    if (index !== -1) this.positions.splice(index, 1);
    this.saveToStorage()
  }

  getPositions(): Position[] {
    this.positions = this.loadFromStorage();
    return this.positions;
  }

  getTotalValue(): number {
    return this.positions.reduce(
      (total, position) => total + position.currentPrice * position.amount, 0
    );
  }

  getTotalCost(): number {
    return this.positions.reduce(
      (total, position) => total + position.buyPrice * position.amount, 0
    );
  }

  getTotalPnL(): number {
    return this.getTotalValue() - this.getTotalCost();
  }

  getPositionPnL(p: Position): number {
    return (p.currentPrice - p.buyPrice) * p.amount;
  }

  addPosition(position: Position): void {
    this.positions.push(position);
    this.saveToStorage()
  }

  removePosition(position: Position): void {
    const index = this.positions.indexOf(position);
    if (index !== -1) this.positions.splice(index, 1);
    this.removeFromStorage(position);
  }

  constructor(private http: HttpClient) {
    this.positions = this.loadFromStorage();
  }
}
