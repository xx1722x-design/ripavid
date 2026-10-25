'use client';

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
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [language, setLanguage] = useState('en');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(saved);
  }, []);

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    localStorage.setItem('selectedLanguage', code);
    setIsOpen(false);

    // Dispatch custom event for language change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('languageChanged'));
    }
  };

  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) {
        calculatePosition();
      }
    }

    if (isOpen) {
      // Delay to ensure event listeners are attached after DOM is ready
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  const menuContent = (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className="bg-[#0f172a] border border-zinc-700 rounded-xl shadow-2xl min-w-[300px] max-h-[480px] overflow-y-auto pointer-events-auto backdrop-filter-none"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 99999,
        backdropFilter: 'none',
      }}
    >
      <div className="sticky top-0 bg-[#0f172a] border-b border-zinc-700 px-6 py-3 z-10">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Select Language</p>
      </div>
      <div className="divide-y divide-zinc-700">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLanguageChange(lang.code);
            }}
            className={`w-full px-6 py-3 text-left transition-all duration-150 flex items-center justify-between select-none pointer-events-auto hover:bg-zinc-800/80 ${
              lang.code === language
                ? 'bg-blue-900/40 text-blue-200 border-l-2 border-blue-500'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="font-mono text-xs font-bold w-10 text-zinc-500">{lang.countryCode}</span>
            <span className="text-sm flex-1 ml-2">{lang.name}</span>
            {lang.code === language && (
              <span className="text-blue-400 font-bold text-lg leading-none">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-blue-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors select-none pointer-events-auto"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isMounted && isOpen && createPortal(menuContent, document.body)}
    </div>
  );
}
