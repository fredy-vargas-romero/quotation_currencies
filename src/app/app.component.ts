import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ExchangeService } from './exchange.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Quotation } from './quotation.interface';

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
    ExchangeService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  quotationForm;
  showLoader = false;
  showFormLoader = false;

  constructor(private exchangeService: ExchangeService) {
    this.quotationForm = new FormGroup({
      base_amount: new FormControl(3, [Validators.required, Validators.min(3), Validators.max(999)]),
      base_currency: new FormControl('USD'),
      quote_currency: new FormControl('COP', [Validators.required]),
    })

    this.showFormLoader = true;
  }

  quotation1: Quotation = {} as Quotation;

  loadQuotation() {
    if (!this.quotationForm.valid) {
      return;
    }

    let base_currency = this.quotationForm.get("base_currency")?.value!;
    let base_amount = this.quotationForm.get("base_amount")?.value!;
    let quote_currency = this.quotationForm.get("quote_currency")?.value!;

    
    this.showLoader = true;

    this.exchangeService.getQuotation(
      base_currency,
      base_amount,
      quote_currency).then((data: any) => {
        console.log("call API");
        console.log("data: ", data)
        this.quotation1 = data;
        this.showLoader = false;
        this.showFormLoader = false;
      }).catch((error)=>{
        console.log(error)
      });
  }

  async ngOnInit(): Promise<void> {
    await this.exchangeService.init();
    
    this.loadQuotation();

    this.quotationForm.get('base_amount')?.valueChanges.subscribe((data:any) => {
      if (this.quotationForm.get('base_amount')?.valid) {
        this.quotationForm.updateValueAndValidity();
        this.loadQuotation();
      }
    })

    this.quotationForm.get('quote_currency')?.valueChanges.subscribe((data) => {
      this.loadQuotation();
    })
  }

  onSendExchange() {
    console.log(this.quotationForm.value)
  }
}
