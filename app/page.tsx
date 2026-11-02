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
import ErrorBoundary from './components/ErrorBoundary';
// Advertising components removed - using on-click pop-under strategy instead
// import B2BApiCenter from './components/B2BApiCenter';
// [B2B SECTION DISABLED] - B2C 전환 중
import SocialShareBar from './components/SocialShareBar';
import ProHeroBanner from './components/ProHeroBanner';
import ProPricingSection from './components/ProPricingSection';
import RRRTipBanner from './components/RRRTipBanner';
import RRRTrickModal from './components/RRRTrickModal';
import PricingComparisonModal from './components/PricingComparisonModal';
import QuickTagsSection from './components/QuickTagsSection';
import { useAuth } from '@/app/context/AuthContext';
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
  const { user, isGuest } = useAuth() || { user: null, isGuest: true };
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
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [guestDownloadCount, setGuestDownloadCount] = useState(0);
  const [showDailyLimitBanner, setShowDailyLimitBanner] = useState(false);

  // Ref for UrlForm (for smooth scroll from Pricing section)
  const urlFormRef = useRef<HTMLDivElement>(null);
  const scrollToDownloader = () => {
    urlFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Ref for Pricing Section (for smooth scroll from Hero Banner)
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const scrollToPricing = () => {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    try {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('url');
      if (urlParam) {
        const decodedUrl = decodeURIComponent(urlParam);
        // Validate URL format
        if (typeof decodedUrl === 'string' && decodedUrl.trim().length > 0) {
          setInitialUrl(decodedUrl);
        }
      }
    } catch (error) {
      console.error('Error parsing URL parameter:', error);
      setError('Invalid URL parameter provided.');
    }

    return () => window.removeEventListener('languageChanged', handleStorageChange);
  }, []);

  // Fetch guest download count on mount (for non-authenticated users)
  useEffect(() => {
    if (isGuest) {
      fetch('/api/guest-downloads/count')
        .then((res) => res.json())
        .then((data) => setGuestDownloadCount(data.count || 0))
        .catch((err) => {
          console.warn('Failed to fetch guest download count:', err);
          setGuestDownloadCount(0);
        });
    }
  }, [isGuest]);

  // Auto-submit when initialUrl is available (rrr redirect entry)
  useEffect(() => {
    if (initialUrl && !isLoading && !result) {
      // Delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        handleRipVideo(initialUrl);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialUrl]);

  // 1단계 스크롤: VideoResult 컴포넌트가 나타날 때 (화질 탭 영역으로)
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        scrollToVideoResult();
      }, 300);
    }
  }, [result]);

  const handleRipVideo = async (url: string) => {
    try {
      // Validate URL before processing
      if (!url || typeof url !== 'string') {
        setError('Invalid URL provided.');
        return;
      }

      const trimmedUrl = url.trim();
      if (trimmedUrl.length === 0) {
        setError('Please enter a valid URL.');
        return;
      }

      setIsLoading(true);
      setError('');
      setResult(null);
      setOriginalUrl(trimmedUrl);

      try {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: trimmedUrl }),
        });

        // 403 에러 - 인라인 배너로 표시
        if (response.status === 403) {
          console.log('Daily limit exceeded - showing banner');
          setIsLoading(false);
          setShowDailyLimitBanner(true);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // 추가 체크: DAILY_LIMIT_EXCEEDED 문자열도 감지
          if (errorData.error === 'DAILY_LIMIT_EXCEEDED') {
            console.log('DAILY_LIMIT_EXCEEDED detected - showing banner');
            setIsLoading(false);
            setShowDailyLimitBanner(true);
            return;
          }

          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data: VideoData = await response.json();
        setResult(data);
        console.log('Video extracted successfully:', data);
      } catch (err) {
        // 403 에러는 여기서도 걸러내기
        if (err instanceof Error && (err.message.includes('403') || err.message.includes('DAILY_LIMIT_EXCEEDED'))) {
          console.log('403 caught in error handler - showing banner');
          setIsLoading(false);
          setShowDailyLimitBanner(true);
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to extract video. Please try again.');
        console.error('Download error:', err);
      } finally {
        setIsLoading(false);
      }
    } catch (outerErr) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Unexpected error in handleRipVideo:', outerErr);
      setIsLoading(false);
    }
  };

  // Safely initialize translations with proper fallback
  const safeLanguage = (language && typeof language === 'string') ? language : 'en';
  const t = translations[safeLanguage as keyof typeof translations] ?? translations['en'];

  return (
    <ErrorBoundary onError={(error) => setError(`Runtime error: ${error.message}`)}>
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black dark:from-black dark:via-zinc-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100 text-gray-900 dark:text-white light:text-gray-900 transition-colors flex flex-col">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
        </div>


        <main className="relative z-10 flex flex-col items-center justify-start flex-grow px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 md:pt-3 pb-8 sm:pb-12 md:pb-16">
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
        <ProHeroBanner onScrollToPricing={scrollToPricing} />

        {/* RRR Trick Tip Banner */}
        <RRRTipBanner onClick={() => setShowRRRModal(true)} language={language} />

        {/* Platform Selector - with max height to prevent layout shift */}
        <div className="w-full max-w-5xl mx-auto mb-2 overflow-hidden">
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            showLabel={true}
          />
        </div>

        {/* Guest Download Counter (for non-authenticated users) */}
        {isGuest && (
          <div className="w-full max-w-3xl mx-auto mb-4 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <span className="text-xs sm:text-sm text-cyan-300 font-semibold">
                Guest: {guestDownloadCount}/1 used today
              </span>
            </div>
          </div>
        )}

        {/* Daily Limit Exceeded Banner */}
        {showDailyLimitBanner && isGuest && (
          <div className="w-full max-w-3xl mx-auto mb-4 px-4">
            <div className="w-full bg-gradient-to-r from-amber-900/40 to-red-900/40 border-l-4 border-amber-400 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-grow">
                <p className="text-sm sm:text-base text-amber-200 font-semibold mb-2">
                  Daily limit reached! Sign in for 3x more downloads.
                </p>
                <p className="text-xs sm:text-sm text-amber-100/80">
                  Login to get <strong>3 free downloads per day</strong> + save unlimited history!
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <a
                  href="/auth/signup"
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all text-center"
                >
                  Sign Up Free
                </a>
                <a
                  href="/auth/login"
                  className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-xs sm:text-sm rounded-lg transition-all border border-white/20 text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}

        {/* URL Input Form */}
        <div ref={urlFormRef}>
          {/* @ts-ignore */}
          <UrlForm
            onSubmit={handleRipVideo}
            isLoading={isLoading}
            language={language}
            initialUrl={initialUrl}
            autoSubmit={!!initialUrl}
            onError={(errorMessage) => setError(errorMessage)}
          />
        </div>


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
              onError={(errorMessage) => setError(errorMessage)}
              onShowDailyLimitBanner={() => {
                setShowDailyLimitBanner(true);
                fetch('/api/guest-downloads/count')
                  .then((res) => res.json())
                  .then((data) => setGuestDownloadCount(data.count || 3))
                  .catch(() => setGuestDownloadCount(3));
              }}
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
          <div ref={pricingSectionRef}>
            {/* @ts-ignore */}
            <ProPricingSection language={language} onScrollToDownloader={scrollToDownloader} onOpenRRRModal={() => setShowRRRModal(true)} onOpenPricingModal={() => setShowPricingModal(true)} />
          </div>
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
      <RRRTrickModal isOpen={showRRRModal} onClose={() => setShowRRRModal(false)} language={language} />

      {/* Pricing Comparison Modal */}
      <PricingComparisonModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      {/* Quick Tags Section for SEO */}
      <QuickTagsSection />

        {/* Footer */}
        {/* @ts-ignore */}
        <Footer language={language} />
      </div>
    </ErrorBoundary>
  );
}
