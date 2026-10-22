'use client';

import { useState, useEffect } from 'react';
import UrlForm from './components/UrlForm';
import VideoResult from './components/VideoResult';
import SocialProofTicker from './components/SocialProofTicker';
import QuickTutorial from './components/QuickTutorial';
import FeaturesGrid from './components/FeaturesGrid';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LanguageSwitcher from './components/LanguageSwitcher';

interface Format {
  quality: string;
  ext: string;
  url: string;
}

interface VideoData {
  title: string;
  formats: Format[];
}

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    title: 'Download Videos Easily',
    subtitle: 'Download videos from Douyin, Xiaohongshu, YouTube and more in seconds',
    subtext: 'Fast, simple, and completely free. No sign-up required.',
  },
  ko: {
    title: '모든 영상을 쉽게 다운로드하세요',
    subtitle: '도우인, 샤오홍슈, 유튜브 등에서 몇 초 만에 영상을 다운로드하세요',
    subtext: '빠르고 간단하며 완전히 무료입니다. 가입 불필요.',
  },
  'zh-CN': {
    title: '轻松下载所有视频',
    subtitle: '从抖音、小红书、YouTube 等多个平台在几秒内下载视频',
    subtext: '快速、简单、完全免费。无需注册。',
  },
  es: {
    title: 'Descarga videos fácilmente',
    subtitle: 'Descarga videos de Douyin, Xiaohongshu, YouTube y más en segundos',
    subtext: 'Rápido, simple y completamente gratis. Sin necesidad de registro.',
  },
  fr: {
    title: 'Téléchargez facilement tous les vidéos',
    subtitle: 'Téléchargez des vidéos de Douyin, Xiaohongshu, YouTube et plus en quelques secondes',
    subtext: 'Rapide, simple et complètement gratuit. Aucune inscription requise.',
  },
  ja: {
    title: 'すべての動画を簡単にダウンロード',
    subtitle: 'Douyin、Xiaohongshu、YouTubeなどから数秒で動画をダウンロード',
    subtext: '高速、シンプル、完全無料。登録不要。',
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const saved = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(saved);
  }, []);

  const handleRipVideo = async (url: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://snagaclip.com';
      const response = await fetch(`${apiUrl}/api/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data: VideoData = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rip video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black dark:from-black dark:via-zinc-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100 text-gray-900 dark:text-white light:text-gray-900 overflow-hidden transition-colors">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Header with Theme Toggle and Language Switcher */}
      <header className="fixed top-0 right-0 z-50 pr-4 sm:pr-8 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
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
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {translations[language]?.title || translations['en'].title}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-2">
            {translations[language]?.subtitle || translations['en'].subtitle}
          </p>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-500 light:text-gray-500">
            {translations[language]?.subtext || translations['en'].subtext}
          </p>
        </div>

        {/* URL Input Form */}
        <UrlForm onSubmit={handleRipVideo} isLoading={isLoading} />

        {/* API Error Display */}
        {error && (
          <div className="w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 mt-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium">오류</p>
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
            formats={result.formats}
            onClose={() => setResult(null)}
          />
        )}

        {/* Social Proof Ticker */}
        {!result && <SocialProofTicker />}

        {/* Quick Tutorial */}
        {!result && <QuickTutorial />}

        {/* Features Grid */}
        {!result && <FeaturesGrid />}

        {/* FAQ Accordion */}
        {!result && <FaqAccordion />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
