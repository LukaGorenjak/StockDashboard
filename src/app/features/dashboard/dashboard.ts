import { Component, inject, OnInit, signal } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio-service';
import { StockCard } from '../stock-card/stock-card';
import { RouterLink } from '@angular/router';
import { Position } from '../../core/models/position-model';
import { StockPriceService } from '../../core/services/stock-price-service';

@Component({
  selector: 'app-dashboard',
  imports: [StockCard, RouterLink],
  template: `
    <div class="summary">
      <div class="summary-card">
        <p>Total Value</p>
      </div>
      <div class="summary-card">
        <p>Total PnL</p>
      </div>
      <div class="add-link">
        <a routerLink="/add-position">+</a>
      </div>
    </div>
    <div class="cards">
      @for (pos of positions(); track pos.ticker) {
        <app-stock-card
          [position]="pos"
          (delete)="onDelete(pos)">
        </app-stock-card>
      }
    </div>
    @if (isLoading()) {
      <div class="loading">
        <div class="spinner"></div>
        <span>Fetching prices...</span>
      </div>
    }
    @if (errorMessage()) {
      <p style="color: red">{{ errorMessage() }}</p>
    }
  `,
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private portfolio = inject(PortfolioService);
  private priceService = inject(StockPriceService);

  positions = signal<Position[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.portfolio.getPositions().subscribe({
      next: (data) => {
        this.positions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load positions.');
        this.isLoading.set(false);
      }
    });
  }

  onDelete(position: Position) {
    if (!confirm(`Delete ${position.ticker}?`)) return;

    this.portfolio.removePosition(position).subscribe({
      next: () => this.loadPositions(),
      error: () => this.errorMessage.set('Failed to delete position.')
    });
  }

  refreshPrice(ticker: string) {
    this.priceService.getQuote(ticker).subscribe({
      next: (quote) => {
        this.positions.update(positions =>
          positions.map(p => p.ticker === ticker ? { ...p, currentPrice: quote.c } : p)
        );
      },
      error: () => this.errorMessage.set(`Failed to fetch price for ${ticker}`)
    });
  }
}
