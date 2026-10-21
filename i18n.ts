import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = [
  'en', 'es', 'fr', 'de', 'pt', 'ja', 'ko',
  'zh-CN', 'zh-TW', 'vi', 'th', 'id', 'ms',
  'tl', 'ar', 'ru', 'hi', 'tr', 'it', 'nl', 'pl'
] as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      locale,
      messages
    };
  } catch (error) {
    notFound();
  }
});
