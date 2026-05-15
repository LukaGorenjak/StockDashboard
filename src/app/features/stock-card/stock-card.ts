import { Component, input, output } from '@angular/core';
import { Position } from '../../core/models/position-model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stock-card',
  imports: [DecimalPipe],
  template: `
    <div class="card">
      <button class="delete-btn" (click)="delete.emit()">✕</button>
      <h2>{{ position().ticker }}</h2>
      <p>Amount: {{ position().amount | number:"1.0-2" }}</p>
      <p>Buy price: {{ position().buyPrice | number:"1.2-2" }}</p>
      <p>Current price: {{ position().currentPrice | number:"1.2-2" }}</p>
      <p>Total value: {{ position().currentPrice * position().amount | number:"1.2-2" }}</p>
      <p>PnL: {{ (position().currentPrice - position().buyPrice) * position().amount | number:"1.2-2" }}</p>
    </div>
  `,
  styleUrl: './stock-card.css',
})
export class StockCard {
  position = input.required<Position>();
  delete = output<void>();
}
