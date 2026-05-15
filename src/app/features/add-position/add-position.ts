import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Position } from '../../core/models/position-model';
import { PortfolioService } from '../../core/services/portfolio-service';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-position',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section>
      <form [formGroup]="positionForm" (ngSubmit)="onSubmit()">
        <label for="ticker">Enter ticker:</label>
        <input formControlName="ticker" placeholder="KRKG">
        @if (positionForm.controls.ticker.invalid && positionForm.controls.ticker.touched) {
          <small style="color:red">
            @if (positionForm.controls.ticker.errors?.['required']) { Ticker je obvezen. }
            @if (positionForm.controls.ticker.errors?.['minlength']) { Najmanj 3 znake. }
            @if (positionForm.controls.ticker.errors?.['pattern']) { Samo velike črke. }
          </small>
        }
        <br>
        <label for="amount">Enter amount:</label>
        <input type="number" formControlName="amount" placeholder="10">
        <br>
        <label for="buyPrice">Enter buy price:</label>
        <input type="number" formControlName="buyPrice" step="0.01" placeholder="142.50">
        <br>
        <button type="submit" [disabled]="positionForm.invalid">Add</button>
      </form>
      <div class="add-link">
        <a routerLink="/">← Back</a>
      </div>
    </section>
  `,
  styleUrl: './add-position.css',
})
export class AddPosition {
  route: ActivatedRoute = inject(ActivatedRoute)
  portfolioService = inject(PortfolioService);

  positionForm = new FormGroup({
    ticker: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Z]+$/)]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    buyPrice: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
  })

  onSubmit() {
  if (this.positionForm.invalid) return;
  const { ticker, amount, buyPrice } = this.positionForm.value;
  this.portfolioService.addPosition({
    ticker: ticker!,
    amount: amount!,
    buyPrice: buyPrice!,
    currentPrice: buyPrice!
  });
  this.positionForm.reset();
}

}
