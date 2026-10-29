'use client';

import { useState, FormEvent, useEffect } from 'react';
import { translations } from '../locales';

interface UrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  language?: string;
  initialUrl?: string;
  autoSubmit?: boolean;
}

type Platform = 'auto' | 'douyin' | 'xiaohongshu' | 'youtube' | 'instagram';

const PLATFORM_LABELS: Record<Platform, { icon: string }> = {
  auto: { icon: '🔍' },
  douyin: { icon: '🎵' },
  xiaohongshu: { icon: '❤️' },
  youtube: { icon: '▶️' },
  instagram: { icon: '📷' },
};

export default function UrlForm({ onSubmit, isLoading, language = 'en', initialUrl = '', autoSubmit = false }: UrlFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState<Platform>('auto');
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const t = translations[language as keyof typeof translations] || translations['en'];

  // Auto-submit if initialUrl is provided
  useEffect(() => {
    if (initialUrl && !hasAutoSubmitted && autoSubmit) {
      setUrl(initialUrl);
      // Delay auto-submit by 100ms to match spec
      const timer = setTimeout(() => {
        setHasAutoSubmitted(true);
        // Create a synthetic form submission
        handleAutoSubmit(initialUrl);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialUrl, autoSubmit, hasAutoSubmitted]);

  const handleAutoSubmit = async (urlToSubmit: string) => {
    setError('');

    if (!urlToSubmit.trim()) {
      setError(t.error);
      return;
    }

    try {
      new URL(urlToSubmit);
    } catch {
      setError('Invalid URL format');
      return;
    }

    try {
      await onSubmit(urlToSubmit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video. Please try again.');
    }
  };

  const PLATFORMS: Record<Platform, string> = {
    auto: t.autoDetect,
    douyin: 'Douyin',
    xiaohongshu: 'Xiaohongshu',
    youtube: 'YouTube',
    instagram: 'Instagram',
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError(t.error);
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Invalid URL format');
      return;
    }

    try {
      await onSubmit(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Platform Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.entries(PLATFORMS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPlatform(key as Platform)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              platform === key
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-200/50 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-zinc-300 dark:text-zinc-300 light:text-gray-700 hover:border-zinc-600 dark:hover:border-zinc-600 light:hover:border-gray-400'
            }`}
          >
            <span className="mr-1">{PLATFORM_LABELS[key as Platform].icon}</span>
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.pasteLink}
            disabled={isLoading}
            className="w-full px-6 py-4 sm:px-8 sm:py-6 h-14 sm:h-16 bg-zinc-800 dark:bg-zinc-800 light:bg-white border-2 border-zinc-600 dark:border-zinc-600 light:border-gray-300 rounded-xl text-base sm:text-lg md:text-xl font-semibold text-gray-100 dark:text-white light:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 light:placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.downloadingText}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1v2.5" />
                </svg>
                {t.download}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 dark:bg-red-900/20 light:bg-red-100/50 border border-red-500/50 dark:border-red-500/50 light:border-red-300 text-red-200 dark:text-red-200 light:text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
