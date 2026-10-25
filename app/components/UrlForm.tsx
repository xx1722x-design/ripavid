'use client';

import { useState, FormEvent } from 'react';

interface UrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

type Platform = 'auto' | 'douyin' | 'xiaohongshu' | 'youtube' | 'instagram';

const PLATFORMS: Record<Platform, { label: string; icon: string; placeholder: string }> = {
  auto: { label: '자동 감지', icon: '🔍', placeholder: '링크를 붙여넣으세요...' },
  douyin: { label: '도우인/틱톡', icon: '🎵', placeholder: 'Douyin/TikTok 링크를 붙여넣으세요...' },
  xiaohongshu: { label: '샤오홍슈', icon: '❤️', placeholder: 'Xiaohongshu 링크를 붙여넣으세요...' },
  youtube: { label: '유튜브', icon: '▶️', placeholder: 'YouTube 링크를 붙여넣으세요...' },
  instagram: { label: '인스타그램', icon: '📷', placeholder: 'Instagram 링크를 붙여넣으세요...' },
};

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState<Platform>('auto');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('유효한 URL을 입력하세요');
      return;
    }

    try {
      await onSubmit(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Platform Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.entries(PLATFORMS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setPlatform(key as Platform)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              platform === key
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-200/50 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-zinc-300 dark:text-zinc-300 light:text-gray-700 hover:border-zinc-600 dark:hover:border-zinc-600 light:hover:border-gray-400'
            }`}
          >
            <span className="mr-1">{value.icon}</span>
            {value.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={PLATFORMS[platform].placeholder}
            disabled={isLoading}
            className="w-full px-8 py-6 bg-zinc-900 dark:bg-zinc-900 light:bg-white border-2 border-zinc-700 dark:border-zinc-700 light:border-gray-300 rounded-xl text-lg md:text-xl dark:text-white light:text-gray-900 placeholder-zinc-500 dark:placeholder-zinc-500 light:placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                다운로드 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1v2.5" />
                </svg>
                다운로드
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
