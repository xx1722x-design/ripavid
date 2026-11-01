'use client';

import { translations } from '../locales';

interface RRRTipBannerProps {
  onClick: () => void;
  language: string;
  onScrollToDownloader?: () => void;
}

export default function RRRTipBanner({ onClick, language, onScrollToDownloader }: RRRTipBannerProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];

  const handleClick = () => {
    onClick();
    // Smooth scroll to downloader after a short delay for visual feedback
    if (onScrollToDownloader) {
      setTimeout(() => onScrollToDownloader(), 300);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 cursor-pointer"
    >
      <div className="relative px-5 sm:px-7 py-4 rounded-xl bg-gradient-to-r from-black via-zinc-900 to-black border border-yellow-400/30 hover:border-yellow-300/50 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl hover:shadow-yellow-500/20">
        {/* Animated neon glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Neon border glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 20px rgba(250, 204, 21, 0.1), 0 0 20px rgba(250, 204, 21, 0.1)'
          }}
        ></div>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-3 flex-wrap text-xs sm:text-sm">
          <span className="text-xl sm:text-2xl animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">💡</span>
          <span className="text-yellow-100 font-semibold leading-relaxed">
            <span className="block sm:inline">Tip: Just add</span>
            <span className="text-yellow-300 font-bold mx-2 bg-yellow-900/30 px-2.5 py-1 rounded-lg inline-block border border-yellow-400/40 group-hover:border-yellow-300/60 transition-colors drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]">
              rrr
            </span>
            <span className="block sm:inline">before youtube.com (or use</span>
            <span className="text-yellow-300 font-bold mx-2 group-hover:text-yellow-200 transition-colors drop-shadow-[0_0_6px_rgba(250,204,21,0.3)]">rrryoutube.com</span>
            <span className="block sm:inline">to import media instantly!</span>
          </span>
          <span className="text-yellow-300 font-bold group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100">
            ✨
          </span>
        </div>
      </div>
    </div>
  );
}
