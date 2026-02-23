import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {provideMarkdown} from 'ngx-markdown';
import {provideNativeDateAdapter} from '@cute-widgets/base/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // provideAnimations(),
    provideNativeDateAdapter(),
    provideMarkdown({
      loader: HttpClient,
    }),
  ]
};
