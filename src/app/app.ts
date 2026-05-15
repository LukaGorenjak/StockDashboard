import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioService } from './core/services/portfolio-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('stock_dashboard');
}
