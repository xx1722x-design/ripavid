'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'pt', name: 'Português', countryCode: 'PT' },
  { code: 'ja', name: '日本語', countryCode: 'JP' },
  { code: 'ko', name: '한국어', countryCode: 'KR' },
  { code: 'zh-CN', name: '简体中文', countryCode: 'CN' },
  { code: 'zh-TW', name: '繁體中文', countryCode: 'TW' },
  { code: 'vi', name: 'Tiếng Việt', countryCode: 'VN' },
  { code: 'th', name: 'ไทย', countryCode: 'TH' },
  { code: 'id', name: 'Bahasa Indonesia', countryCode: 'ID' },
  { code: 'ms', name: 'Bahasa Melayu', countryCode: 'MY' },
  { code: 'tl', name: 'Tagalog', countryCode: 'PH' },
  { code: 'ar', name: 'العربية', countryCode: 'SA' },
  { code: 'ru', name: 'Русский', countryCode: 'RU' },
  { code: 'hi', name: 'हिन्दी', countryCode: 'IN' },
  { code: 'tr', name: 'Türkçe', countryCode: 'TR' },
  { code: 'it', name: 'Italiano', countryCode: 'IT' },
  { code: 'nl', name: 'Nederlands', countryCode: 'NL' },
  { code: 'pl', name: 'Polski', countryCode: 'PL' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLanguageChange = (code: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  const menuContent = (
    <div
      className="bg-[#0f172a] border border-zinc-700 rounded-lg shadow-2xl min-w-[280px] max-h-96 overflow-y-auto"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 9999,
      }}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`w-full px-6 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between border-b border-zinc-700 last:border-b-0 ${
            lang.code === locale
              ? 'bg-blue-900/30 text-blue-200'
              : 'text-gray-200 hover:text-white'
          }`}
        >
          <span className="font-semibold text-sm w-8">{lang.countryCode}</span>
          <span className="text-sm flex-1 text-right">{lang.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-blue-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isMounted && isOpen && createPortal(menuContent, document.body)}
    </div>
  );
}
