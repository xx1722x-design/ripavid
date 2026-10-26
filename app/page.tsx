'use client';

import { useState, useEffect } from 'react';
import UrlForm from './components/UrlForm';
import VideoResult from './components/VideoResult';
import SocialProofTicker from './components/SocialProofTicker';
import QuickTutorial from './components/QuickTutorial';
import FeaturesGrid from './components/FeaturesGrid';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import PlatformSelector from './components/PlatformSelector';
import MarketingCopy from './components/MarketingCopy';
import AdsterraBanner from './components/AdsterraBanner';
import AffiliateBanners from './components/AffiliateBanners';
import { translations, getTranslations } from './locales';

interface Format {
  quality?: string;
  resolution?: string;
  ext: string;
  url: string;
  isPremium?: boolean;
  filesize?: number;
}

interface VideoData {
  title: string;
  thumbnail?: string;
  duration?: number;
  formats: {
    free: Format[];
    premium: Format[];
  };
}

// Translations are now imported from app/locales/index.ts
// All 21 languages are centralized there

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';

    const saved = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(saved);

    // Listen for language changes from LanguageSwitcher
    const handleStorageChange = () => {
      const updated = localStorage.getItem('selectedLanguage') || 'en';
      setLanguage(updated);
    };

    window.addEventListener('languageChanged', handleStorageChange);
    return () => window.removeEventListener('languageChanged', handleStorageChange);
  }, []);

  const handleRipVideo = async (url: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setOriginalUrl(url);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: VideoData = await response.json();
      setResult(data);
      console.log('Video extracted successfully:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract video. Please try again.');
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const t = translations[language as keyof typeof translations] || translations['en'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black dark:from-black dark:via-zinc-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100 text-gray-900 dark:text-white light:text-gray-900 overflow-hidden transition-colors">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Header with Language Switcher */}
      <header className="fixed top-0 right-0 z-50 pr-4 sm:pr-8 pt-4 sm:pt-6">
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 md:pt-32 pb-0">
        {/* Logo / Branding */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
            ⚡
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            RipAVid
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {selectedPlatform && t[selectedPlatform as keyof typeof t]
                ? t[selectedPlatform as keyof typeof t]
                : t.title}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-2">
            {t.subtitle}
          </p>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-500 light:text-gray-500">
            {t.subtext}
          </p>
        </div>

        {/* Platform Selector */}
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          showLabel={true}
        />

        {/* URL Input Form */}
        {/* @ts-ignore */}
        <UrlForm onSubmit={handleRipVideo} isLoading={isLoading} language={language} />

        {/* API Error Display */}
        {error && (
          <div className="w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 mt-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-200 hover:text-red-100 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Video Result */}
        {result && (
          <VideoResult
            title={result.title}
            thumbnail={result.thumbnail}
            duration={result.duration}
            formats={result.formats as any}
            onClose={() => setResult(null)}
            language={language}
            originalUrl={originalUrl}
          />
        )}

        {/* Affiliate Banners (Language-based smart switching) */}
        <AffiliateBanners language={language} />

        {/* Social Proof Ticker */}
        {!result && <SocialProofTicker />}

        {/* Quick Tutorial */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <QuickTutorial language={language} />
          </>
        )}

        {/* Features Grid */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <FeaturesGrid language={language} />
          </>
        )}

        {/* FAQ Accordion */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <FaqAccordion language={language} />
          </>
        )}

        {/* Marketing Copy & Social Sharing */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <MarketingCopy language={language} />
          </>
        )}

        {/* Adsterra Native Banner Advertisement */}
        <AdsterraBanner />
      </main>

      {/* Footer */}
      {/* @ts-ignore */}
      <Footer language={language} />
    </div>
  );
}
