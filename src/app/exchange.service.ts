import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs"

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {
    apiUrl = 'https://api.balampay.com';
    // apiUrl = 'https://api.balampay.com/sandbox/quotes?amount=100&base_currency=USD&quote_currency=COP';

    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders()
            .set('Accept', 'application/json')
            .set('x-api-key', 'rfa3aMb7Rl6TP09jcG6D23E4yZvmp04s9aw9E4vA');
    }

    getQuotation(base_currency: string, base_amount: number, quote_currency: string): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/sandbox/quotes?amount=${base_amount}&base_currency=${base_currency}&quote_currency=${quote_currency}`, {'headers':this.headers});
    }


    quotation = {
        "currencyValueFrom": 3232,
        "currencySelectedFrom": "USD",
        "currencyValueTo": 3232,
        "currencySelectedTo": "COL"
    }

    quotationUpdated = new Subject()

    changeQuotation(quotation: any) {
        this.quotation = quotation;
        this.quotationUpdated.next(this.quotation)
    }

    // getQuotation() {
    //     return { ... this.quotation };
    // }
}