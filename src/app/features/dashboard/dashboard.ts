import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio-service';
import { StockCard } from '../stock-card/stock-card';
import { routes } from '../../app.routes';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Position } from '../../core/models/position-model';

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
  `,
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private portfolio = inject(PortfolioService);

  positions = this.portfolio.getPositions();
  totalValue = this.portfolio.getTotalValue();
  totalPnL = this.portfolio.getTotalPnL();

  onDelete(position: Position) {
     if (!confirm(`Res zbrišem ${position.ticker}?`)) return;
    this.portfolio.removePosition(position);
    this.positions = this.portfolio.getPositions();  
  }
}
