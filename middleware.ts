import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/lib/i18n/config';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default intlMiddleware;

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
