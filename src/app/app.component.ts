import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExchangeService } from './exchange.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Quotation {
  quote_id: string,
  base_currency: string,
  quote_currency: string,
  base_amount: number,
  quote_amount: number,
  rate: number,
  balam_rate: number,
  fixed_fee: number,
  pct_fee: number,
  status: string,
  expiration_ts: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    ExchangeService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'quotation-front-end';
  quotation = {
    "currencyValueFrom": 3232,
    "currencySelectedFrom": "USD",
    "currencyValueTo": 3232,
    "currencySelectedTo": "COL"
  }

  quotation1: Quotation = {
    base_currency: 'USD',
    base_amount: 10,
    quote_currency: 'COP'
  } as Quotation;

  private quotationSubcription!: Subscription;
  constructor(private exchangeService: ExchangeService) {
  }

  ngOnInit(): void {
    this.exchangeService.getQuotation(this.quotation1.base_currency,
      this.quotation1.base_amount,
      this.quotation1.quote_currency).subscribe((data: any) => {
        console.log("data: ", data['data'])
        this.quotation1 = data['data'];
      });

    // this.quotationSubcription = this.exchangeService.quotationUpdated.subscribe(() => {
    //   this.quotation = this.exchangeService.getQuotation();
    // });
  }

  ngOnDestroy(): void {
    this.quotationSubcription.unsubscribe();
  }

  onSendExchange(form: NgForm) {
    console.log(form)
  }
}
