import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private initialized = false;

  initialize(dsn: string, isProduction: boolean = false) {
    if (this.initialized || !isProduction) return;

    Sentry.init({
      dsn: dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost', /\.seusite\.com$/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    this.initialized = true;
    console.log('Sentry monitoring initialized');
  }

  logError(error: Error, context?: any) {
    if (this.initialized) {
      Sentry.captureException(error, { extra: context });
    }
    console.error('Application Error:', error, context);
  }

  logInfo(message: string, context?: any) {
    if (this.initialized) {
      Sentry.captureMessage(message, { extra: context });
    }
    console.log('Application Info:', message, context);
  }

  setUser(user: { id: string; email: string; name: string }) {
    if (this.initialized) {
      Sentry.setUser(user);
    }
  }
}