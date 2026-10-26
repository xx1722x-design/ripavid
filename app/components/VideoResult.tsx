'use client';

import { translations } from '../locales';

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
  const t = translations[language as keyof typeof translations] || translations['en'];
  const allFormats = [...formats.free, ...formats.premium];

  // Extract numeric height from resolution string (e.g., "720p" -> 720)
  const getHeightFromResolution = (res: string): number => {
    const match = res.match(/(\d+)p?/);
    return match ? parseInt(match[1], 10) : 720;
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
              const proxyUrl = `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`;
              return (
                <a
                  key={`free-${index}`}
                  href={proxyUrl}
                  download
                  className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {resolution}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Video-Only Formats Section (1080p and above - NO AUDIO) */}
      {formats.premium && formats.premium.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-sm font-semibold text-red-300 mb-3">🔇 Video Only (No Audio):</p>
          <p className="text-xs text-red-200 mb-3 italic">High-quality formats without audio. Requires audio editing or additional processing.</p>
          <div className="flex flex-wrap gap-2">
            {formats.premium.map((format, index) => {
              const resolution = parseResolution(format.resolution, format.quality);
              const height = getHeightFromResolution(resolution);
              const proxyUrl = `/api/download-stream?url=${encodeURIComponent(originalUrl)}&height=${height}`;
              return (
                <a
                  key={`premium-${index}`}
                  href={proxyUrl}
                  download
                  className="text-xs bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-2 font-medium opacity-75"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1V4a1 1 0 011-1h5a1 1 0 011 1v1m5-1a1 1 0 011 1v1m0 0a1 1 0 001 1h1a1 1 0 001-1m-1-1v-4a1 1 0 00-1-1h-4.586a1 1 0 00-.707.293l-3.414 3.414a1 1 0 00-.293.707V15a1 1 0 001 1h1m8-1a1 1 0 01-1 1m0 0H9m3 0a1 1 0 01-1-1" />
                  </svg>
                  {resolution}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Info & Tips Box - DRAMATICALLY ENLARGED FOR CUSTOMER RETENTION */}
      <div className="space-y-4">
        {/* Download Time Warning - HUGE TEXT TO PREVENT ABANDONMENT */}
        <div className="p-6 bg-blue-900/30 dark:bg-blue-900/30 light:bg-blue-100/70 border-2 border-blue-500/50 dark:border-blue-500/50 light:border-blue-400 rounded-lg shadow-lg">
          <p className="text-lg lg:text-xl font-bold text-blue-200 dark:text-blue-200 light:text-blue-800 leading-relaxed whitespace-pre-wrap">
            ⏱️ <span className="text-red-400 dark:text-red-400 light:text-red-600 animate-pulse">최대 90초 대기</span> - <span className="text-yellow-300 dark:text-yellow-300 light:text-yellow-600 font-extrabold">창을 닫지 마세요!</span>
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
    </div>
  );
}
