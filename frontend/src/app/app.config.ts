// src/app/app.config.ts
import { ApplicationConfig } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
    // Add other providers here if needed, such as provideRouter([])
  ]
};