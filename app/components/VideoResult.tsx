'use client';

import { useState, useRef } from 'react';
import { translations } from '../locales';
import TipSlider from './TipSlider';
import AffiliateBanner from './AffiliateBanner';
import LocalizationTools from './LocalizationTools';
import PaymentUpgradeModal from './PaymentUpgradeModal';
import QualityUpgradeModal from './QualityUpgradeModal';
import { useAuth } from '@/app/context/AuthContext';
import { GUMROAD_LINKS } from '@/lib/gumroad-constants';

// 📺 Advertisement Link Pool (Random Rotation Strategy)
// Adsterra pool (5 links)
const ADSTERRA_LINKS = [
  "https://asiafilm.org/4/67f85b9984fffe2cc773a2aa6ba74550",
  "https://asiafilm.org/4/bff26ca04065dbbfa36dcee7776780ab",
  "https://asiafilm.org/4/935a5b936cb4b6c0027a9d48b0051d73",
  "https://asiafilm.org/4/d75b5a9ea5aa11e8f07dbaca14a011c3",
  "https://asiafilm.org/4/2017236decc3fe62e65ec74f66a04c01"
];

// Monetag pool (5 links)
const MONETAG_LINKS = [
  "https://uplcm.com/4/12146496",
  "https://uplcm.com/4/12177679",
  "https://uplcm.com/4/12177680",
  "https://uplcm.com/4/12216208",
  "https://uplcm.com/4/12216212"
];

// Global ad rotation state (tracks which link to show next)
let adRotationIndex = 0;

interface Format {
  quality?: string;
  resolution?: string;
  ext: string;
  url: string;
  isPremium?: boolean;
  filesize?: number;
}

interface VideoResultProps {
  title: string;
  thumbnail?: string;
  duration?: number;
  formats: {
    free: Format[];
    premium: Format[];
  };
  onClose: () => void;
  language?: string;
  originalUrl?: string;
  onError?: (errorMessage: string) => void;
  onShowDailyLimitBanner?: () => void;
}

// 해상도 포맷 파싱 함수 (1920x1080 → 1080p, 720 → 720p)
const parseResolution = (resolution?: string, quality?: string): string => {
  if (!resolution && !quality) return 'Download';

  const text = (resolution || quality || '').toString();

  // 이미 "720p", "1080p" 형태면 앞부분만 추출
  const pFormatMatch = text.match(/^(\d+p)/);
  if (pFormatMatch) {
    return pFormatMatch[1];
  }

  // "(No Audio)" 같은 텍스트 제거
  const cleanText = text.replace(/\s*[\(\[].+[\)\]].*$/, '').trim();

  // "1920x1080" 형태에서 높이(뒤의 숫자) 추출
  const heightMatch = cleanText.match(/x(\d+)/);
  if (heightMatch) {
    return heightMatch[1] + 'p';
  }

  // "1080" 같은 3자리 이상 숫자면 p 붙이기
  const numberMatch = cleanText.match(/(\d{3,})/);
  if (numberMatch) {
    return numberMatch[1] + 'p';
  }

  return cleanText || 'Download';
};

export default function VideoResult({ title, thumbnail, duration, formats, onClose, language = 'en', originalUrl = '', onError, onShowDailyLimitBanner }: VideoResultProps) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingHeight, setWaitingHeight] = useState(720);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [loadingQuality, setLoadingQuality] = useState<string | null>(null);
  const [hoveredResolution, setHoveredResolution] = useState<string | null>(null);
  const [lastDownloadTime, setLastDownloadTime] = useState(0);
  const [showQualityUpgrade, setShowQualityUpgrade] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const waitingContainerRef = useRef<HTMLDivElement>(null);
  const { user, isGuest } = useAuth();

  // Safely initialize translations with proper fallback
  const safeLanguage = (language && typeof language === 'string') ? language : 'en';
  const t = translations[safeLanguage as keyof typeof translations] ?? translations['en'];

  // 📺 Advertisement Rotation Helper - Distributes ad pool across downloads
  const getNextAdLink = (pool: string[]): string => {
    const link = pool[adRotationIndex % pool.length];
    adRotationIndex++; // Increment for next call
    return link;
  };

  // Extract numeric height from resolution string (e.g., "720p" -> 720) - DEFINE FIRST
  const getHeightFromResolution = (res: string): number => {
    const match = res.match(/(\d+)p?/);
    return match ? parseInt(match[1], 10) : 720;
  };

  // Prepare formats and derived values
  const allFormats = [...formats.free, ...formats.premium];
  const isPro = user?.tier === 'pro';

  // Calculate credits required for video download based on resolution
  const getDownloadCredits = (height: number): number => {
    if (height >= 2160) return 20; // 4K = 20 credits
    if (height >= 1080) return 10; // 1080p/2K = 10 credits
    return 10; // 720p = 10 credits (default)
  };

  // Calculate credits for AI features
  const SUBTITLE_EXTRACTION_CREDITS = 50; // AI 자막 추출
  const TRANSLATION_CREDITS = 30; // 다국어 번역 (총 -80)
  const TOTAL_AI_FEATURES_CREDITS = SUBTITLE_EXTRACTION_CREDITS + TRANSLATION_CREDITS;

  // Find the maximum resolution available - NOW SAFE TO CALL getHeightFromResolution
  const getMaxResolution = (): number => {
    let maxHeight = 0;
    allFormats.forEach((format) => {
      const resolution = parseResolution(format.resolution, format.quality);
      const height = getHeightFromResolution(resolution);
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    return maxHeight;
  };

  const maxResolution = getMaxResolution();

  const executeDownload = async (height: number, resolution: string) => {
    setIsWaiting(true);
    setWaitingHeight(height);
    setLoadingQuality(resolution);

    // Smooth scroll to "Preparing video..." container
    setTimeout(() => {
      if (waitingContainerRef.current) {
        waitingContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    try {
      // ⚡ CREDIT VALIDATION - Skip for Free/Guest users (Unlimited downloads policy)
      // Free/Guest users get UNLIMITED downloads - no credit checking needed
      const isFreeOrGuest = user?.tier === 'free' || user?.isGuest === true;

      if (isFreeOrGuest) {
        // ✅ FREE/GUEST: Skip all credit checks - unlimited downloads
        console.log('[VideoResult] Free/Guest user detected - skipping credit validation (unlimited downloads)');
      } else {
        // 💳 PAID USERS: Perform credit deduction
        try {
          const creditsRequired = getDownloadCredits(height);
          const creditDeductRes = await fetch('/api/credits/deduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: creditsRequired, reason: `Video download (${resolution})` })
          });

          // ONLY BLOCK on 402 (user actually can't afford this download)
          if (creditDeductRes.status === 402) {
            const creditData = await creditDeductRes.json().catch(() => ({}));
            console.log('[VideoResult] 402 Payment Required - blocking download:', creditData);

            // Show login/payment prompt for guests or payment upgrade for free users
            if (creditData.shouldPromptLogin) {
              onShowDailyLimitBanner?.();
            } else {
              setShowPaymentModal(true);
            }
            return; // ABORT - legitimate payment block
          }

          // ALL OTHER STATUSES (including 500): Log but DON'T block
          if (creditDeductRes.ok) {
            const creditData = await creditDeductRes.json().catch(() => ({}));
            console.log('[VideoResult] Credits deducted successfully. Remaining:', creditData.remainingCredits);
          } else {
            // 500, 503, or any server error: Log as warning but continue
            console.warn(`[VideoResult] Credit API returned ${creditDeductRes.status} (non-fatal):`, {
              status: creditDeductRes.status,
              statusText: creditDeductRes.statusText,
              action: 'Ignoring error and proceeding with download (Paid user)'
            });
          }
        } catch (creditError) {
          // Network error, timeout, or any exception: Log but NEVER block download
          console.warn('[VideoResult] Credit system unavailable (non-fatal):', {
            error: creditError instanceof Error ? creditError.message : String(creditError),
            action: 'Proceeding with download - credit service down'
          });
        }
      }

      // ✅ SIMPLE & STABLE: Quick verification then direct download
      // Verify the download is allowed by making a HEAD request with 60-second timeout
      let response: Response | null = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        try {
          response = await fetch(
            `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`,
            {
              method: 'HEAD',
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error('Download preparation timed out. Please try again.');
          }
          const errorMsg = fetchError instanceof Error ? fetchError.message : 'Network request failed';
          throw new Error(`Connection error: ${errorMsg}`);
        }
      } catch (fetchError) {
        throw fetchError;
      }

      // If not ok, handle errors
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // JSON parse failed, use status message
        }
        throw new Error(errorMessage);
      }

      // Otherwise proceed with download + open Monetag ad in new tab
      const targetUrl = `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`;
      console.log('[VideoResult] Download verified. Triggering direct download:', { targetUrl });

      window.location.href = targetUrl;

      // 📺 MONETIZATION: Show ads ONLY for Free/Guest users (YouTube Premium model)
      const isUserFreeOrGuest = user?.tier === 'free' || user?.isGuest === true;
      if (isUserFreeOrGuest) {
        console.log('[VideoResult] Free/Guest user - opening rotated ad pool (Adsterra + Monetag)');
        // Get next ad links from rotation pool
        const adsterraLink = getNextAdLink(ADSTERRA_LINKS);
        const monetagLink = getNextAdLink(MONETAG_LINKS);

        console.log('[Ad Pool] Rotation index:', { adRotationIndex, adsterraLink, monetagLink });

        // Stagger ad pop-unders (100ms apart) for better UX
        // Pop-under strategy: opens in background, doesn't interrupt download
        window.open(adsterraLink, '_blank');
        setTimeout(() => {
          window.open(monetagLink, '_blank');
        }, 100);
      } else {
        console.log('[VideoResult] Paid user detected - skipping ads (Ad-Free guarantee)');
      }

      // ⏱️ Clear loading state with slight delay to ensure ad popups complete
      // (window.location.href and window.open() are non-blocking, so we need a brief wait)
      setTimeout(() => {
        console.log('[VideoResult] Download complete. Resetting UI state.');
        setIsWaiting(false);
        setLoadingQuality(null);
      }, 1500); // 1.5 seconds to ensure all async operations (download + ads) finish

    } catch (error) {
      console.error('Download verification failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare download. Please try again.';

      // CRITICAL: Display error on screen so user sees what went wrong
      setDownloadError(`❌ Download Error: ${errorMessage}`);
      console.error('[VideoResult] Error trap caught:', { error, message: errorMessage });

      // Also call parent error handler for logging
      onError?.(errorMessage);

      // Error case: Reset immediately since download won't happen
      setIsWaiting(false);
      setLoadingQuality(null);

    } finally {
      // CRITICAL: Only handle cleanup that's needed for both paths
      // Success path: 8-second timeout handles reset
      // Error path: Immediately reset above
      // So finally block doesn't need to do anything
    }
  };

  const handleDownloadClick = async (height: number, resolution: string) => {
    // Debounce rapid clicks (1.5 second cooldown)
    const now = Date.now();
    if (now - lastDownloadTime < 1500) {
      console.warn('[BotDefense] Rapid click detected. Ignoring request.');
      return;
    }
    setLastDownloadTime(now);

    // Prevent clicking while download is in progress
    if (isWaiting) {
      console.warn('[VideoResult] Download already in progress. Ignoring click.');
      return;
    }

    // Check if height > 720p and user is not Pro/Starter/Max
    // Free/Guest users capped at 720p - show upgrade modal for higher quality
    if (height > 720 && user?.tier !== 'pro' && user?.tier !== 'starter' && user?.tier !== 'max') {
      setShowQualityUpgrade(true);
      return;
    }

    // All users (Free/Guest/Starter/Pro/Max): Execute download immediately
    // No waiting timers - simple, fast, reliable
    await executeDownload(height, resolution);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ERROR BANNER - Display download errors prominently */}
      {downloadError && (
        <div className="w-full mb-6 p-4 bg-gradient-to-r from-red-900/60 to-red-800/60 border-2 border-red-500/70 rounded-lg shadow-lg shadow-red-500/20 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-red-200 font-semibold text-sm">{downloadError}</p>
            <p className="text-red-300 text-xs mt-1">Please try again or use a different quality.</p>
          </div>
          <button
            onClick={() => setDownloadError(null)}
            className="ml-4 text-red-300 hover:text-red-100 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full bg-gradient-to-br from-zinc-900 dark:from-zinc-900 light:from-gray-50 to-black dark:to-black light:to-white border border-zinc-700 dark:border-zinc-700 light:border-gray-200 rounded-xl p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-2 break-words">
            {title || 'Video Ready'}
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
            {allFormats.length} format{allFormats.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-zinc-400 dark:text-zinc-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Recommended Formats Section (720p and below - WITH AUDIO) */}
      {formats.free && formats.free.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-2 border-emerald-500/50 rounded-lg shadow-lg">
          <p className="text-sm font-bold text-emerald-300 mb-3">✨ RECOMMENDED (With Audio):</p>
          <div className="flex flex-wrap gap-2">
            {formats.free.map((format, index) => {
              const resolution = parseResolution(format.resolution, format.quality);
              const height = getHeightFromResolution(resolution);
              const isLoadingThisQuality = loadingQuality === resolution;
              const isDisabled = height > maxResolution;
              return (
                <div key={`free-${index}`} className="relative group">
                  <button
                    onClick={async () => !isDisabled && await handleDownloadClick(height, resolution)}
                    disabled={isWaiting || isDisabled}
                    className={`text-xs font-bold px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-md transform ${
                      isDisabled
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed'
                        : isLoadingThisQuality
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 scale-110'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:scale-105'
                    } text-white ${isWaiting && !isLoadingThisQuality && !isDisabled ? 'opacity-50 cursor-not-allowed disabled:hover:scale-100' : !isDisabled && 'hover:shadow-lg'}`}
                  >
                    {isLoadingThisQuality && !isDisabled && (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    {!isLoadingThisQuality && !isDisabled && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    {resolution}
                  </button>
                  {isDisabled && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t.resolutionNotAvailable?.replace('{resolution}', `${maxResolution}p`) || `This resolution is not available because the original video was uploaded in ${maxResolution}p.`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Premium Formats Section (1080p and above - Pro only) */}
      {formats.premium && formats.premium.length > 0 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          isPro
            ? 'bg-purple-900/20 border-purple-500/50'
            : 'bg-red-900/20 border-red-500/30'
        }`}>
          <p className={`text-sm font-semibold mb-3 ${isPro ? 'text-purple-300' : 'text-red-300'}`}>
            {isPro ? '👑 Pro Pass Quality' : '🔒 Pro Pass Quality'}
          </p>
          <p className={`text-xs mb-3 italic ${isPro ? 'text-purple-200' : 'text-red-200'}`}>
            {isPro
              ? '1080p and higher quality formats'
              : 'Upgrade to Pro Pass to download 1080p and higher quality.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {formats.premium.map((format, index) => {
              const resolution = parseResolution(format.resolution, format.quality);
              const height = getHeightFromResolution(resolution);
              const isDisabled = height > maxResolution;
              const isLoadingThisQuality = loadingQuality === resolution;
              return (
                <div key={`premium-${index}`} className="relative group">
                  <button
                    onClick={async () => {
                      if (isDisabled) return;
                      if (isPro) {
                        await handleDownloadClick(height, resolution);
                      } else {
                        setShowPaymentModal(true);
                      }
                    }}
                    disabled={(isWaiting && !isPro) || isDisabled}
                    className={`text-xs px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 font-medium ${
                      isDisabled
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed'
                        : isPro
                        ? `bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white ${isLoadingThisQuality ? 'scale-110' : 'hover:scale-105'}`
                        : 'bg-red-700/60 hover:bg-red-700 text-white opacity-75 hover:opacity-90'
                    }`}
                  >
                    {isPro && isLoadingThisQuality && !isDisabled && (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    {!isPro && !isDisabled && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L9.3 6.6H3.36v3.67h4.89L12 20l3.75-9.73h4.89V6.6h-5.94L12 1z" />
                      </svg>
                    )}
                    {resolution}
                  </button>
                  {isDisabled && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t.resolutionNotAvailable?.replace('{resolution}', `${maxResolution}p`) || `This resolution is not available because the original video was uploaded in ${maxResolution}p.`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Localization Tools Section */}
      {!isWaiting && originalUrl && (
        <LocalizationTools
          videoUrl={originalUrl}
          videoTitle={title}
          language={language || 'en'}
        />
      )}

      {/* 대기 상태 UI */}
      {isWaiting && (
        <div
          ref={waitingContainerRef}
          className="w-full max-w-2xl mx-auto mt-6 p-8 bg-gradient-to-br from-blue-950/60 to-blue-900/60 border-4 border-blue-400/80 rounded-xl shadow-2xl"
        >
          {/* Step-by-Step Process Guide */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-blue-200 mb-6 text-center">Download Process</h3>

            <div className="space-y-4">
              {/* Step 1 - Completed */}
              <div className="flex items-center gap-4 p-3 bg-blue-800/40 rounded-lg border border-green-500/50">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500/80 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-300">Step 1: Click Quality</p>
                  <p className="text-xs text-green-200">{loadingQuality} selected ✓</p>
                </div>
              </div>

              {/* Step 2 - Current */}
              <div className="flex items-center gap-4 p-3 bg-blue-600/40 rounded-lg border border-blue-400/80 animate-pulse">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500/80 rounded-full animate-spin">
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-400 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-300">Step 2: Preparing Download</p>
                  <p className="text-xs text-blue-200">Server preparing your file...</p>
                </div>
              </div>

              {/* Step 3 - Upcoming */}
              <div className="flex items-center gap-4 p-3 bg-blue-800/30 rounded-lg border border-blue-500/30 opacity-60">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-700/60 rounded-full">
                  <span className="text-sm font-bold text-blue-300">🔄</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-300">Step 3: Browser Processing</p>
                  <p className="text-xs text-blue-200">Tab will show loading icon</p>
                </div>
              </div>

              {/* Step 4 - Final */}
              <div className="flex items-center gap-4 p-3 bg-blue-800/30 rounded-lg border border-blue-500/30 opacity-60">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-700/60 rounded-full">
                  <span className="text-sm font-bold text-blue-300">📥</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-300">Step 4: Download Starts</p>
                  <p className="text-xs text-blue-200">File saves automatically</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6 py-4 border-t border-blue-500/30">
            <p className="text-xl lg:text-2xl font-bold text-blue-200 mb-2 animate-pulse">
              ⏳ Please wait...
            </p>
            <p className="text-xs text-blue-300">Do not close this window</p>
          </div>

          {/* 가치 제공형 슬라이드 */}
          <TipSlider />

          {/* 제휴 배너 */}
          <AffiliateBanner />
        </div>
      )}

      {/* Info & Tips Box - DRAMATICALLY ENLARGED FOR CUSTOMER RETENTION */}
      {!isWaiting && (
        <div className="space-y-4">
        {/* Download Time Warning - HUGE TEXT TO PREVENT ABANDONMENT */}
        <div className="p-6 bg-blue-900/30 dark:bg-blue-900/30 light:bg-blue-100/70 border-2 border-blue-500/50 dark:border-blue-500/50 light:border-blue-400 rounded-lg shadow-lg">
          <p className="text-lg lg:text-xl font-bold text-blue-200 dark:text-blue-200 light:text-blue-800 leading-relaxed whitespace-pre-wrap">
            ⏱️ <span className="text-red-400 dark:text-red-400 light:text-red-600 animate-pulse">{t.downloadWaitMaxTime}</span> - <span className="text-yellow-300 dark:text-yellow-300 light:text-yellow-600 font-extrabold">{t.downloadWaitWarning}</span>
          </p>
          <p className="text-base lg:text-lg font-semibold text-blue-200 dark:text-blue-200 light:text-blue-700 leading-relaxed mt-3">
            {t.downloadTip}
          </p>
        </div>

        {/* Codec Compatibility Warning - BOLD & CLEAR */}
        <div className="p-6 bg-amber-900/30 dark:bg-amber-900/30 light:bg-amber-100/70 border-2 border-amber-500/50 dark:border-amber-500/50 light:border-amber-400 rounded-lg shadow-lg">
          <p className="text-lg lg:text-xl font-bold text-amber-200 dark:text-amber-200 light:text-amber-800 leading-relaxed">
            {t.codecWarning}
          </p>
        </div>
      </div>
      )}

      {/* Payment Upgrade Modal - Shown when credits insufficient */}
      <PaymentUpgradeModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        remainingCredits={remainingCredits}
      />

      {/* Quality Upgrade Modal - Show when user tries to download 1080p+ without Starter */}
      <QualityUpgradeModal
        isOpen={showQualityUpgrade}
        onClose={() => setShowQualityUpgrade(false)}
        onContinue={async () => {
          setShowQualityUpgrade(false);
          await handleDownloadClick(720, '720p');
        }}
        onUpgrade={() => {
          setShowQualityUpgrade(false);
          console.log('[VideoResult] Quality upgrade attempted → redirecting to Gumroad');
          window.location.href = GUMROAD_LINKS.STARTER_MONTHLY;
        }}
      />
      </div>
    </div>
  );
}
