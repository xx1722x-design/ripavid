import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = [
  'en', 'es', 'fr', 'de', 'pt', 'ja', 'ko',
  'zh-CN', 'zh-TW', 'vi', 'th', 'id', 'ms',
  'tl', 'ar', 'ru', 'hi', 'tr', 'it', 'nl', 'pl'
];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
