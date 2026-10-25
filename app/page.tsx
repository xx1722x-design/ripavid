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
import PlatformSelector from './components/PlatformSelector';
import MarketingCopy from './components/MarketingCopy';

interface Format {
  quality: string;
  ext: string;
  url: string;
}

interface VideoData {
  title: string;
  formats: Format[];
}

interface TranslationContent {
  title: string;
  subtitle: string;
  subtext: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  douyin: string;
  xiaohongshu: string;
  kuaishou: string;
  bilibili: string;
  weibo: string;
  baidu: string;
  pinduoduo: string;
}

const translations: { [key: string]: TranslationContent } = {
  en: {
    title: 'Download Videos Easily',
    subtitle: 'Download videos from YouTube, TikTok, Instagram and more in seconds',
    subtext: 'Fast, simple, and completely free. No sign-up required.',
    youtube: 'Download YouTube Videos & Music in HD',
    instagram: 'Download Instagram Photos & Videos Instantly',
    tiktok: 'Download TikTok Videos Without Watermark',
    douyin: 'Download Douyin Videos Easily',
    xiaohongshu: 'Download Xiaohongshu Photos & Videos',
    kuaishou: 'Download Kuaishou Videos Online',
    bilibili: 'Download Bilibili Videos in HD',
    weibo: 'Download Weibo Videos & Photos',
    baidu: 'Download Baidu Videos & Content',
    pinduoduo: 'Download Pinduoduo Content Easily',
  },
  ko: {
    title: '모든 영상을 쉽게 다운로드하세요',
    subtitle: '유튜브, 틱톡, 인스타그램 등에서 몇 초 만에 영상을 다운로드하세요',
    subtext: '빠르고 간단하며 완전히 무료입니다. 가입 불필요.',
    youtube: 'YouTube 영상 & 음악을 HD로 다운로드',
    instagram: '인스타그램 사진 & 영상 즉시 다운로드',
    tiktok: '틱톡 영상을 워터마크 없이 다운로드',
    douyin: '도우인 영상을 쉽게 다운로드',
    xiaohongshu: '샤오홍슈 사진 & 영상 다운로드',
    kuaishou: '콰이쇼우 영상을 온라인으로 다운로드',
    bilibili: '빌리빌리 영상을 HD로 다운로드',
    weibo: '웨이보 영상 & 사진 다운로드',
    baidu: '바이두 영상 & 콘텐츠 다운로드',
    pinduoduo: '핀둬둬 콘텐츠를 쉽게 다운로드',
  },
  'zh-CN': {
    title: '轻松下载所有视频',
    subtitle: '从YouTube、TikTok、Instagram等多个平台在几秒内下载视频',
    subtext: '快速、简单、完全免费。无需注册。',
    youtube: '下载YouTube视频及音乐（高清）',
    instagram: '即时下载Instagram照片及视频',
    tiktok: '无水印下载TikTok视频',
    douyin: '轻松下载抖音视频',
    xiaohongshu: '下载小红书照片及视频',
    kuaishou: '在线下载快手视频',
    bilibili: '下载B站视频（高清）',
    weibo: '下载微博视频及照片',
    baidu: '下载百度视频及内容',
    pinduoduo: '轻松下载拼多多内容',
  },
  es: {
    title: 'Descarga videos fácilmente',
    subtitle: 'Descarga videos de YouTube, TikTok, Instagram y más en segundos',
    subtext: 'Rápido, simple y completamente gratis. Sin necesidad de registro.',
    youtube: 'Descarga videos y música de YouTube en HD',
    instagram: 'Descarga fotos y videos de Instagram al instante',
    tiktok: 'Descarga videos de TikTok sin marca de agua',
    douyin: 'Descarga videos de Douyin fácilmente',
    xiaohongshu: 'Descarga fotos y videos de Xiaohongshu',
    kuaishou: 'Descarga videos de Kuaishou en línea',
    bilibili: 'Descarga videos de Bilibili en HD',
    weibo: 'Descarga videos y fotos de Weibo',
    baidu: 'Descarga videos y contenido de Baidu',
    pinduoduo: 'Descarga contenido de Pinduoduo fácilmente',
  },
  fr: {
    title: 'Téléchargez facilement tous les vidéos',
    subtitle: 'Téléchargez des vidéos de YouTube, TikTok, Instagram et plus en quelques secondes',
    subtext: 'Rapide, simple et complètement gratuit. Aucune inscription requise.',
    youtube: 'Téléchargez les vidéos et la musique YouTube en HD',
    instagram: 'Téléchargez les photos et vidéos Instagram instantanément',
    tiktok: 'Téléchargez les vidéos TikTok sans filigrane',
    douyin: 'Téléchargez facilement les vidéos Douyin',
    xiaohongshu: 'Téléchargez les photos et vidéos Xiaohongshu',
    kuaishou: 'Téléchargez les vidéos Kuaishou en ligne',
    bilibili: 'Téléchargez les vidéos Bilibili en HD',
    weibo: 'Téléchargez les vidéos et photos Weibo',
    baidu: 'Téléchargez les vidéos et le contenu Baidu',
    pinduoduo: 'Téléchargez facilement le contenu Pinduoduo',
  },
  ja: {
    title: 'すべての動画を簡単にダウンロード',
    subtitle: 'YouTube、TikTok、Instagramなどから数秒で動画をダウンロード',
    subtext: '高速、シンプル、完全無料。登録不要。',
    youtube: 'YouTubeの動画と音楽をHDでダウンロード',
    instagram: 'Instagramの写真と動画を即座にダウンロード',
    tiktok: 'TikTokの動画をウォーターマークなしでダウンロード',
    douyin: 'Douyinの動画を簡単にダウンロード',
    xiaohongshu: '小红书の写真と動画をダウンロード',
    kuaishou: 'Kuaishouの動画をオンラインでダウンロード',
    bilibili: 'BilibiliビデオをHDでダウンロード',
    weibo: 'Weiboの動画と写真をダウンロード',
    baidu: 'Baiduの動画とコンテンツをダウンロード',
    pinduoduo: 'Pinduoduoのコンテンツを簡単にダウンロード',
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
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
        <div className="text-center mb-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {selectedPlatform && (translations[language]?.[selectedPlatform as keyof TranslationContent] as string)
                ? (translations[language]?.[selectedPlatform as keyof TranslationContent] as string)
                : translations[language]?.title || translations['en'].title}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-2">
            {translations[language]?.subtitle || translations['en'].subtitle}
          </p>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-500 light:text-gray-500">
            {translations[language]?.subtext || translations['en'].subtext}
          </p>
        </div>

        {/* Platform Selector */}
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          showLabel={true}
        />

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

        {/* Marketing Copy & Social Sharing */}
        {!result && <MarketingCopy language={language} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
