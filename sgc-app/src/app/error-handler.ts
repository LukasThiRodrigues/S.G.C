import { ErrorHandler, Injectable, inject } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { MonitoringService } from './services/monitoring.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private monitoring = inject(MonitoringService);

    handleError(error: any): void {
        Sentry.captureException(error);

        this.monitoring.logError(error, {
            handler: 'GlobalErrorHandler',
            url: window.location.href,
            timestamp: new Date().toISOString()
        });

        console.error('Error handled by GlobalErrorHandler:', error);
    }
}