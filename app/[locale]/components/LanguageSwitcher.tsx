'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: '🇺🇸 English' },
  { code: 'es', name: '🇪🇸 Español' },
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'de', name: '🇩🇪 Deutsch' },
  { code: 'pt', name: '🇵🇹 Português' },
  { code: 'ja', name: '🇯🇵 日本語' },
  { code: 'ko', name: '🇰🇷 한국어' },
  { code: 'zh-CN', name: '🇨🇳 简体中文' },
  { code: 'zh-TW', name: '🇹🇼 繁體中文' },
  { code: 'vi', name: '🇻🇳 Tiếng Việt' },
  { code: 'th', name: '🇹🇭 ไทย' },
  { code: 'id', name: '🇮🇩 Bahasa Indonesia' },
  { code: 'ms', name: '🇲🇾 Bahasa Melayu' },
  { code: 'tl', name: '🇵🇭 Tagalog' },
  { code: 'ar', name: '🇸🇦 العربية' },
  { code: 'ru', name: '🇷🇺 Русский' },
  { code: 'hi', name: '🇮🇳 हिन्दी' },
  { code: 'tr', name: '🇹🇷 Türkçe' },
  { code: 'it', name: '🇮🇹 Italiano' },
  { code: 'nl', name: '🇳🇱 Nederlands' },
  { code: 'pl', name: '🇵🇱 Polski' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-blue-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-lg z-50 min-w-max max-h-96 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${
                lang.code === locale
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 font-semibold'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
