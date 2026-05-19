import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PortfolioService } from '../../core/services/portfolio-service';
import { StockCard } from '../stock-card/stock-card';
import { RouterLink } from '@angular/router';
import { Position } from '../../core/models/position-model';
import { StockPriceService } from '../../core/services/stock-price-service';

@Component({
  selector: 'app-dashboard',
  imports: [StockCard, RouterLink, CurrencyPipe],
  template: `
    <div class="summary">
      <div class="summary-card">
        <p>Total Value</p>
        <p>{{ totalValue() | currency }}</p>
      </div>
      <div class="summary-card">
        <p>Total PnL</p>
        <p [style.color]="totalPnL() >= 0 ? 'green' : 'red'">{{ totalPnL() | currency }}</p>
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

  totalValue = computed(() =>
    this.positions().reduce((sum, p) => sum + p.currentPrice * p.amount, 0)
  );

  totalPnL = computed(() =>
    this.positions().reduce((sum, p) => sum + (p.currentPrice - p.buyPrice) * p.amount, 0)
  );

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.portfolio.getPositions().subscribe({
      next: (data) => {
        this.positions.set(data);
        this.loadAllPrices(data);
      },
      error: () => {
        this.errorMessage.set('Could not load positions.');
        this.isLoading.set(false);
      }
    });
  }

  private loadAllPrices(positions: Position[]) {
    if (positions.length === 0) {
      this.isLoading.set(false);
      return;
    }

    const requests = positions.map(p => this.priceService.getQuote(p.ticker));

    forkJoin(requests).subscribe({
      next: (quotes) => {
        this.positions.update(current =>
          current.map((p, i) => ({ ...p, currentPrice: quotes[i].c }))
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Failed to fetch live prices. ${err.message}`);
        this.isLoading.set(false);
      }
    });
  }

  onDelete(position: Position) {
    if (!confirm(`Delete ${position.ticker}?`)) return;

    this.portfolio.removePosition(position).subscribe({
      next: () => this.loadPositions(),
      error: (err) => this.errorMessage.set(`Failed to delete position. ${err.message}`)
    });
  }
}
