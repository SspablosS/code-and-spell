import * as Sentry from '@sentry/node';
import { env } from './env';

export function initSentry() {
  if (!env.SENTRY_DSN_SERVER) {
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN_SERVER,
    environment: env.NODE_ENV,
    sampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}
