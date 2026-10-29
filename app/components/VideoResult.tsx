'use client';

import { useState } from 'react';
import { translations } from '../locales';
import TipSlider from './TipSlider';
import AffiliateBanner from './AffiliateBanner';
import { useAuth } from '@/app/context/AuthContext';
import PaddlePaymentModal from './PaddlePaymentModal';

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

export default function VideoResult({ title, thumbnail, duration, formats, onClose, language = 'en', originalUrl = '' }: VideoResultProps) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingHeight, setWaitingHeight] = useState(720);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();

  const t = translations[language as keyof typeof translations] || translations['en'];
  const allFormats = [...formats.free, ...formats.premium];
  const isPro = user?.tier === 'pro';

  // Extract numeric height from resolution string (e.g., "720p" -> 720)
  const getHeightFromResolution = (res: string): number => {
    const match = res.match(/(\d+)p?/);
    return match ? parseInt(match[1], 10) : 720;
  };

  const handleDownloadClick = async (height: number) => {
    // Check if height > 720p and user is not Pro
    if (height > 720 && user?.tier !== 'pro') {
      setShowPaymentModal(true);
      return;
    }

    // For logged-in free users, verify backend tier check
    setIsWaiting(true);
    setWaitingHeight(height);

    try {
      // Verify the download is allowed by making a HEAD request
      const response = await fetch(
        `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`,
        { method: 'HEAD' }
      ).catch(() => null);

      // If 403, show payment modal
      if (response?.status === 403) {
        setIsWaiting(false);
        setShowPaymentModal(true);
        return;
      }

      // Otherwise proceed with download
      const targetUrl = `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`;
      window.location.href = targetUrl;

      // Backup: Reset waiting state after 10 seconds
      setTimeout(() => setIsWaiting(false), 10000);
    } catch (error) {
      console.error('Download verification failed:', error);
      setIsWaiting(false);
      // Proceed with download anyway as fallback
      const targetUrl = `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`;
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-zinc-900 dark:from-zinc-900 light:from-gray-50 to-black dark:to-black light:to-white border border-zinc-700 dark:border-zinc-700 light:border-gray-200 rounded-xl p-8 mt-8 shadow-2xl">
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
              return (
                <button
                  key={`free-${index}`}
                  onClick={() => handleDownloadClick(height)}
                  disabled={isWaiting}
                  className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {resolution}
                </button>
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
              return (
                <button
                  key={`premium-${index}`}
                  onClick={() => {
                    if (isPro) {
                      handleDownloadClick(height);
                    } else {
                      setShowPaymentModal(true);
                    }
                  }}
                  disabled={isWaiting && !isPro}
                  className={`text-xs px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 font-medium ${
                    isPro
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                      : 'bg-red-700/60 hover:bg-red-700 text-white opacity-75 hover:opacity-90'
                  }`}
                >
                  {!isPro && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L9.3 6.6H3.36v3.67h4.89L12 20l3.75-9.73h4.89V6.6h-5.94L12 1z" />
                    </svg>
                  )}
                  {resolution}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 대기 상태 UI */}
      {isWaiting && (
        <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-blue-950/40 border-2 border-blue-500/50 rounded-xl shadow-lg">
          <div className="text-center mb-4">
            <div className="inline-block p-3 bg-blue-900/60 rounded-full mb-3">
              <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-lg font-bold text-blue-300 mb-2">⏳ Preparing video...</p>
            <p className="text-sm text-blue-200">(Takes 1-2 mins, please do not close this window)</p>
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaddlePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          language={language}
        />
      )}
    </div>
  );
}
