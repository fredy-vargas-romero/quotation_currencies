import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ModuleConfigService {
    currenciesAvailable = {
        base: {
            'USD': {
                "currency": 'USD',
                "flagUrl": "images/us-flag.png"
            }
        },
        quote: {
            'COP': {
                "currency": 'COP',
                "flagUrl": "images/col-flag.png"
            },
            'MXN': {
                "currency": 'MXN',
                "flagUrl": "images/mx-flag.png"
            }
        }
    };

    baseCurrency = {
        'minAmount': 3,
        'maxAmount': 999
    };

    baseCurrencyDefault = 'USD';
    quoteCurrencyDefault = 'COP';

    urlApiCredencials = "https://us-east1-superb-cubist-440816-v8.cloudfunctions.net/function-get-balam-credentials";

    timeoutQuotationMinutes = 10;
}