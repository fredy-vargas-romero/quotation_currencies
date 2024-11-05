import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { QuotationService } from './quotation.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Quotation } from './quotation.interface';
import { ModuleConfigService } from './module-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    QuotationService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  quotationForm;
  showLoader = false;
  showFormLoader = false;
  currenciesAvailable;
  baseCurrencySelected;
  quoteCurrencySelected;
  quotation1: Quotation = {} as Quotation;

  constructor( private moduleConfig: ModuleConfigService,private quotationService: QuotationService) {
    this.currenciesAvailable = this.moduleConfig.currenciesAvailable;
    this.baseCurrencySelected = Object.values(this.currenciesAvailable.base)[0];
    this.quoteCurrencySelected = Object.values(this.currenciesAvailable.quote)[0];

    this.quotationForm = new FormGroup({
      base_amount: new FormControl(this.moduleConfig.baseCurrency.minAmount, 
        [ Validators.required, 
          Validators.min(this.moduleConfig.baseCurrency.minAmount), 
          Validators.max(this.moduleConfig.baseCurrency.maxAmount)
        ]
      ),
      base_currency: new FormControl(this.moduleConfig.baseCurrencyDefault),
      quote_currency: new FormControl(this.moduleConfig.quoteCurrencyDefault, [Validators.required]),
    })

    this.showFormLoader = true;
  }

  loadQuotation() {
    if (!this.quotationForm.valid) {
      return;
    }

    let base_currency = this.quotationForm.get("base_currency")?.value!;
    let base_amount = this.quotationForm.get("base_amount")?.value!;
    let quote_currency = this.quotationForm.get("quote_currency")?.value!;
    this.showLoader = true;

    this.quotationService.getQuotation(
      base_currency,
      base_amount,
      quote_currency).then((data: any) => {
        console.log("call API");
        console.log("data: ", data)
        this.quotation1 = data;
        this.showLoader = false;
        this.showFormLoader = false;
      }).catch((error) => {
        console.log(error)
      });
  }

  async ngOnInit(): Promise<void> {
    await this.quotationService.init();

    this.loadQuotation();

    this.quotationForm.get('base_amount')?.valueChanges.subscribe((data: any) => {
      if (this.quotationForm.get('base_amount')?.valid) {
        this.quotationForm.updateValueAndValidity();
        this.loadQuotation();
      }
    })

    this.quotationForm.get('quote_currency')?.valueChanges.subscribe((currency) => {
      this.quoteCurrencySelected = this.currenciesAvailable.quote[currency as keyof typeof this.currenciesAvailable.quote]
      this.loadQuotation();
    })
  }

  onSendExchange() {
    console.log(this.quotationForm.value)
  }
}
