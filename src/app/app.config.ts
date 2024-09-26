import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment.development';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withNoXsrfProtection } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { loggingInterceptor } from './interceptors/log-interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()), 
        provideClientHydration(), 
        provideAnimations(), 
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
        provideAuth(() => getAuth()),
        provideHttpClient(
            withNoXsrfProtection(),
            withFetch(),
            withInterceptors([HttpErrorInterceptor, loggingInterceptor])
        ),
        // primeng features providers
        MessageService,
        TranslateModule.forRoot({
            defaultLanguage: 'fr',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }).providers!
        
    ]
};

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
