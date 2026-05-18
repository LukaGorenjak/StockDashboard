import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio-service';
import { StockCard } from '../stock-card/stock-card';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Position } from '../../core/models/position-model';
import { StockPriceService } from '../../core/services/stock-price-service';

@Component({
  selector: 'app-dashboard',
  imports: [StockCard, CurrencyPipe, RouterOutlet, RouterLink],
  template: `
    <div class="summary">
      <div class="summary-card">
        <p>Total Value</p>
        <span>{{ totalValue | currency }}</span>
      </div>
      <div class="summary-card">
        <p>Total PnL</p>
        <span>{{ totalPnL | currency }}</span>
      </div>
      <div class="add-link">
        <a routerLink="/add-position">+</a>
      </div>
    </div>
    <div class="cards">
      @for (pos of positions; track pos.ticker) {
        <app-stock-card
          [position]="pos"
          (delete)="onDelete(pos)">
        </app-stock-card>
      }
    </div>
    @if (isLoading) {
      <div class="loading">
        <div class="spinner"></div>
        <span>Fetching prices...</span>
      </div>
    }
    @if (errorMessage) {
      <p style="color: red">{{ errorMessage }}</p>
    }
  `,
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private portfolio = inject(PortfolioService);
  private priceService = inject(StockPriceService);

  positions = this.portfolio.getPositions();
  private loadingCount = 0;
  isLoading = false;
  errorMessage = '';

  totalValue = this.portfolio.getTotalValue();
  totalPnL = this.portfolio.getTotalPnL();

  ngOnInit() {
    for (const pos of this.positions) {
      this.refreshPrice(pos.ticker);
    }
  }

  onDelete(position: Position) {
    if (!confirm(`Res zbrišem ${position.ticker}?`)) return;
    this.portfolio.removePosition(position);
    this.positions = this.portfolio.getPositions();
    this.totalValue = this.portfolio.getTotalValue();
    this.totalPnL = this.portfolio.getTotalPnL();
  }

  refreshPrice(ticker: string) {
    this.loadingCount++;
    this.isLoading = true;
    this.errorMessage = '';

    this.priceService.getQuote(ticker).subscribe({
      next: (quote) => {
        this.portfolio.updateCurrentPrice(ticker, quote.c);
        this.positions = this.portfolio.getPositions();
        this.totalValue = this.portfolio.getTotalValue();
        this.totalPnL = this.portfolio.getTotalPnL();
        this.isLoading = --this.loadingCount > 0;
      },
      error: (err) => {
        this.errorMessage = `Failed to fetch ${ticker}: ${err.message}`;
        this.isLoading = --this.loadingCount > 0;
        console.error(err);
      }
    });
  }
}
