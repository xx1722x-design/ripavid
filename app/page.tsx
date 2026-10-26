'use client';

import { useState, useEffect } from 'react';

// 2x2 그리드 구성을 위한 4개의 추천 상품 데이터 (국내: 쿠팡 / 해외: 아마존)
const affiliateItems = [
  {
    id: 1,
    title: '🔥 Best Gaming Headsets',
    desc: 'Top-rated audio for immersive gaming.',
    coupangUrl: 'https://www.coupang.com/np/search?q=gaming+headset',
    amazonUrl: 'https://www.amazon.com/s?k=gaming+headset'
  },
  {
    id: 2,
    title: '⚡ High-Speed External SSDs',
    desc: 'Secure and fast storage on the go.',
    coupangUrl: 'https://www.coupang.com/np/search?q=external+ssd',
    amazonUrl: 'https://www.amazon.com/s?k=external+ssd'
  },
  {
    id: 3,
    title: '🎧 Wireless Earbuds',
    desc: 'Crystal clear sound & active noise canceling.',
    coupangUrl: 'https://www.coupang.com/np/search?q=wireless+earbuds',
    amazonUrl: 'https://www.amazon.com/s?k=wireless+earbuds'
  },
  {
    id: 4,
    title: '🔋 Fast Charging Power Banks',
    desc: 'Never run out of battery again.',
    coupangUrl: 'https://www.coupang.com/np/search?q=power+bank',
    amazonUrl: 'https://www.amazon.com/s?k=power+bank'
  },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [isKoreanIP, setIsKoreanIP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 접속 국가/언어 환경 감지 (국내 IP 분기용)
  useEffect(() => {
    const userLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
    if (userLang.includes('ko')) {
      setIsKoreanIP(true);
    }
  }, []);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);

    // 1. [수익화 전략] 다운로드 버튼 클릭 시 1회성 제휴 페이지를 새 탭으로 오픈 (IP에 따라 자동 분기)
    const defaultAffiliateUrl = isKoreanIP ? affiliateItems[0].coupangUrl : affiliateItems[0].amazonUrl;
    window.open(defaultAffiliateUrl, '_blank');

    // 2. [핵심 기능] 본래의 백엔드 다운로드 트리거 실행 (302 리다이렉트)
    const targetUrl = `https://snagaclip.com/api/download?url=${encodeURIComponent(url)}`;
    window.location.href = targetUrl;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      {/* 헤더 타이틀 영역 */}
      <div className="w-full max-w-2xl text-center mb-12">
        <div className="mb-6 flex items-center gap-3 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            RipAVid
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
          Download Videos in Seconds
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          High-quality downloads from YouTube, TikTok, Instagram and more. Fast. Free. Reliable.
        </p>
      </div>

      {/* 다운로드 입력 폼 */}
      <form onSubmit={handleDownload} className="w-full max-w-2xl space-y-4 mb-12">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here (YouTube, TikTok, Instagram...)"
            className="flex-1 px-6 py-4 h-14 bg-gray-800 border-2 border-gray-700 hover:border-cyan-500 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                📥 Download Now
              </>
            )}
          </button>
        </div>
      </form>

      {/* 🚀 [2x2 그리드 + IP 자동 분기 제휴 배너 섹션] */}
      <div className="w-full max-w-4xl mx-auto px-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">✨ Recommended Sponsors</span>
            <p className="text-xs text-gray-500 mt-1">Premium tech deals curated for you</p>
          </div>
        </div>

        {/* 2x2 그리드 레이아웃 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {affiliateItems.map((item) => {
            const targetUrl = isKoreanIP ? item.coupangUrl : item.amazonUrl;

            return (
              <a
                key={item.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group cursor-pointer"
              >
                <div className="bg-gray-900/80 hover:bg-gray-800 p-5 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10 hover:shadow-2xl">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-xs text-cyan-400/80 mt-4 font-semibold group-hover:text-cyan-300 flex items-center gap-1">
                    {isKoreanIP ? '🛒 쿠팡에서 보기' : '🛒 View on Amazon'}
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* 공시 문구 */}
        <p className="text-xs text-gray-600 text-center mt-6">
          We may earn a commission from qualifying purchases through our affiliate links.
        </p>
      </div>
    </main>
  );
}
