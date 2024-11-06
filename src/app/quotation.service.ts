import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom, Observable, of } from "rxjs"
import { Quotation } from './quotation.interface';
import { iCredencial } from './credentials.interface';
import { ModuleConfigService } from './module-config.service';

@Injectable({
    providedIn: 'root'
})
export class QuotationService {
    balamApiUrl:string='';
    headers = new HttpHeaders();
    quotation = {} as Quotation;
    
    constructor(private http: HttpClient, private moduleConfig: ModuleConfigService ) { }

    init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getApiCredencials().subscribe({
                next: (response: iCredencial) => {
                    this.headers = new HttpHeaders()
                    .set('x-api-key', response.xApiKey);
                    
                    this.balamApiUrl = response.apiUrl
                    
                    resolve();
                },
                error: (error) => {
                    console.error('Error loading credentials:', error);
                    reject();
                }
            });
        });
    }

    private getApiCredencials(): Observable<any> {
        let urlApi = this.moduleConfig.urlApiCredencials;
        return this.http.get(urlApi);
    }

    private getQuotationFromApi(base_currency: string, base_amount: number, quote_currency: string): Observable<any> {
        return this.http.get<iCredencial>(`${this.balamApiUrl}/sandbox/quotes?amount=${base_amount}&base_currency=${base_currency}&quote_currency=${quote_currency}`, { 'headers': this.headers });
    }

    saveQuotationLocally(quotation: any) {
        let timeoutQuotation = this.moduleConfig.timeoutQuotationMinutes;
        let quotationSessionObject = {
            quotation: quotation,
            timeout: Date.now() + (timeoutQuotation * 60 * 1000)
        }
        let keySessionObject = "quotation-" + quotation['base_currency'] + "-" + quotation['quote_currency'];
        sessionStorage.setItem(keySessionObject, btoa(JSON.stringify(quotationSessionObject)));
    }

    getQuotationLocally(keySessionObject: string) {
        let quotationSessionObject = sessionStorage.getItem(keySessionObject) == null ? {} : JSON.parse(atob(sessionStorage.getItem(keySessionObject)!));
        let timeoutNow = Date.now();
        return quotationSessionObject['timeout'] > timeoutNow ? quotationSessionObject['quotation'] : null;
    }

    private calculateQuotation(base_amount: number) {
        let quote_amount = (base_amount - (this.quotation.fixed_fee - this.quotation.pct_fee / 100)) * this.quotation.balam_rate;
        let newQuotation: Quotation = { ... this.quotation };

        newQuotation.base_amount = base_amount;
        newQuotation.quote_amount = parseFloat(quote_amount.toFixed(2));

        return newQuotation;
    }

    async getQuotation(base_currency: string, base_amount: number, quote_currency: string): Promise<Quotation> {
        let keySessionObject = "quotation-" + base_currency + "-" + quote_currency;
        let serverError = false;
        this.quotation = this.getQuotationLocally(keySessionObject);

        if (this.quotation == null) {
            try {
                let result = await lastValueFrom(this.getQuotationFromApi(base_currency, base_amount, quote_currency));
                this.quotation = result['data'];
                this.saveQuotationLocally(result['data']);
            } catch {
                serverError = true;
            }
        }

        return new Promise((resolve, reject) => {
            if (!serverError) {
                let newQuotation = this.calculateQuotation(base_amount);
                resolve(newQuotation)
            } else {
                reject({
                    error_message: 'Server error for getting quotations'
                });
            }
        })
    }

}