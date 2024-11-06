# Quotation Currencies

This apps is for quotation currencies from USD to MXN and COP.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## How does It work?
This app utilizes the following components:

- Balam Quotation API: Retrieves the current currency exchange rates.

- Credentials API: Supplies the API key and endpoint URL required for secure access to the Balam Quotation API, ensuring sensitive information such as the API key is protected and managed safely.

- Session Storage: Temporarily caches the fetched exchange rates locally, allowing for efficient currency conversion calculations and reducing redundant API calls. This helps minimize load on the API and improves the app's performance.


