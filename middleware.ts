import createMiddleware from 'next-intl/middleware';

const locales = [
  'en', 'es', 'fr', 'de', 'pt', 'ja', 'ko',
  'zh-CN', 'zh-TW', 'vi', 'th', 'id', 'ms',
  'tl', 'ar', 'ru', 'hi', 'tr', 'it', 'nl', 'pl'
];

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ]
};
