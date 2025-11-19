import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MonitoringService } from './app/services/monitoring.service';
import { App } from './app/app';
import { environment } from './environments/environment.prod';
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: environment.sentry.dsn,
  sendDefaultPii: true
});

const monitoring = new MonitoringService();

if (environment.production) {
  monitoring.initialize(environment.sentry.dsn, true);
}

bootstrapApplication(App, appConfig)
  .catch((err) => {
    monitoring.logError(err, { context: 'bootstrap' });
  });