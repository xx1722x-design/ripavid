// Import all language translations
import { enTranslations } from './en';
import { koTranslations } from './ko';
import { jaTranslations } from './ja';
import { zhCNTranslations } from './zh-CN';
import { zhTWTranslations } from './zh-TW';
import { esTranslations } from './es';
import { frTranslations } from './fr';
import { deTranslations } from './de';
import { ptTranslations } from './pt';
import { itTranslations } from './it';
import { arTranslations } from './ar';
import { ruTranslations } from './ru';
import { trTranslations } from './tr';
import { nlTranslations } from './nl';
import { plTranslations } from './pl';
import { viTranslations } from './vi';
import { thTranslations } from './th';
import { idTranslations } from './id';
import { msTranslations } from './ms';
import { tlTranslations } from './tl';
import { hiTranslations } from './hi';

// Export all translations as a single object
export const translations = {
  en: enTranslations,
  ko: koTranslations,
  ja: jaTranslations,
  'zh-CN': zhCNTranslations,
  'zh-TW': zhTWTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  pt: ptTranslations,
  it: itTranslations,
  ar: arTranslations,
  ru: ruTranslations,
  tr: trTranslations,
  nl: nlTranslations,
  pl: plTranslations,
  vi: viTranslations,
  th: thTranslations,
  id: idTranslations,
  ms: msTranslations,
  tl: tlTranslations,
  hi: hiTranslations,
};

// Export translation keys type
export type TranslationKey = keyof typeof translations;

// Helper function to get translations for a specific language
export function getTranslations(language: string) {
  return translations[language as TranslationKey] || translations['en'];
}
