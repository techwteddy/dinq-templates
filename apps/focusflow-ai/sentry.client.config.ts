import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration(), Sentry.browserTracingIntegration()],
    beforeSend(event) {
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent;
        if (ua.includes('bot') || ua.includes('crawler')) return null;
      }
      return event;
    },
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      'Non-Error promise rejection',
    ],
  });
}
