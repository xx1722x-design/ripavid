'use client';

import { useState, useEffect, useRef } from 'react';
import UrlForm from './components/UrlForm';
import VideoResult from './components/VideoResult';
import SocialProofTicker from './components/SocialProofTicker';
import QuickTutorial from './components/QuickTutorial';
import FeaturesGrid from './components/FeaturesGrid';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import PlatformSelector from './components/PlatformSelector';
import MarketingCopy from './components/MarketingCopy';
// Advertising components removed - using on-click pop-under strategy instead
// import B2BApiCenter from './components/B2BApiCenter';
// [B2B SECTION DISABLED] - B2C 전환 중
import SocialShareBar from './components/SocialShareBar';
import ProHeroBanner from './components/ProHeroBanner';
import ProPricingSection from './components/ProPricingSection';
import RRRTipBanner from './components/RRRTipBanner';
import RRRTrickModal from './components/RRRTrickModal';
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [initialUrl, setInitialUrl] = useState('');
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || 'en';
    }
    return 'en';
  });
  const [showRRRModal, setShowRRRModal] = useState(false);

  // Ref for UrlForm (for smooth scroll from Pricing section)
  const urlFormRef = useRef<HTMLDivElement>(null);
  const scrollToDownloader = () => {
    urlFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Ref for VideoResult (for smooth scroll when formats appear)
  const videoResultRef = useRef<HTMLDivElement>(null);
  const scrollToVideoResult = () => {
    videoResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // [B2B DISABLED] Ref for B2B API Center section (for smooth scroll)
  // const b2bSectionRef = useRef<HTMLDivElement>(null);
  // const scrollToB2B = () => {
  //   b2bSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // };

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

    // Detect URL parameter for auto-redirect UX
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setInitialUrl(decodeURIComponent(urlParam));
    }

    return () => window.removeEventListener('languageChanged', handleStorageChange);
  }, []);

  // 1단계 스크롤: VideoResult 컴포넌트가 나타날 때 (화질 탭 영역으로)
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        scrollToVideoResult();
      }, 300);
    }
  }, [result]);

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


      <main className="relative z-10 flex flex-col items-center justify-start min-h-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6 pb-0">
        {/* Logo / Branding */}
        <div className="mb-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
            ⚡
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            RipAVid
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {selectedPlatform && t[selectedPlatform as keyof typeof t]
                ? t[selectedPlatform as keyof typeof t]
                : t.title}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-1">
            {t.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-500">
            {t.subtext}
          </p>
        </div>

        {/* [B2B DISABLED] API / Enterprise CTA Button - Premium Floating Card
        <div className="mb-6 w-full max-w-3xl">
          <button
            onClick={scrollToB2B}
            className="group w-full relative px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 overflow-hidden border-2 border-cyan-500/50 dark:border-cyan-500/50 light:border-cyan-400/30 hover:border-cyan-400/80 dark:hover:border-cyan-400/80 light:hover:border-cyan-400/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl blur-xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🚀</span>
              <div className="text-center sm:text-left">
                <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-cyan-300 transition-all">
                  API / Enterprise Solutions
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-600 mt-0.5">
                  Unlimited API • Global infrastructure • 24/7 support
                </div>
              </div>
              <span className="text-xl sm:text-2xl">💼</span>
            </div>
          </button>
        </div>
        */}

        {/* Pro Hero Banner */}
        <ProHeroBanner />

        {/* RRR Trick Tip Banner */}
        <RRRTipBanner onClick={() => setShowRRRModal(true)} />

        {/* Platform Selector - with max height to prevent layout shift */}
        <div className="w-full max-w-5xl mx-auto mb-2 overflow-hidden">
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            showLabel={true}
          />
        </div>

        {/* URL Input Form */}
        <div ref={urlFormRef}>
          {/* @ts-ignore */}
          <UrlForm
            onSubmit={handleRipVideo}
            isLoading={isLoading}
            language={language}
            initialUrl={initialUrl}
            autoSubmit={!!initialUrl}
          />
        </div>

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
          <div ref={videoResultRef}>
            <VideoResult
              title={result.title}
              thumbnail={result.thumbnail}
              duration={result.duration}
              formats={result.formats as any}
              onClose={() => setResult(null)}
              language={language}
              originalUrl={originalUrl}
            />
          </div>
        )}

        {/* Social Share Bar - Viral Share Promotion */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <SocialShareBar language={language} />
          </>
        )}


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

        {/* Divider */}
        {!result && (
          <div className="w-full max-w-5xl mx-auto my-16 border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200"></div>
        )}

        {/* [B2B API CENTER DISABLED] - B2C 전환 중
        {!result && (
          <div ref={b2bSectionRef} className="w-full">
            <B2BApiCenter language={language} />
          </div>
        )}
        */}

        {/* FAQ Accordion */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <FaqAccordion language={language} />
          </>
        )}

        {/* Pro Pricing Section */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <ProPricingSection language={language} onScrollToDownloader={scrollToDownloader} />
          </>
        )}

        {/* Marketing Copy & Social Sharing */}
        {!result && (
          <>
            {/* @ts-ignore */}
            <MarketingCopy language={language} />
          </>
        )}

      </main>

      {/* RRR Trick Modal */}
      <RRRTrickModal isOpen={showRRRModal} onClose={() => setShowRRRModal(false)} />

      {/* Footer */}
      {/* @ts-ignore */}
      <Footer language={language} />
    </div>
  );
}
