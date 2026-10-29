'use client';

interface RRRTipBannerProps {
  onClick: () => void;
}

export default function RRRTipBanner({ onClick }: RRRTipBannerProps) {
  return (
    <div
      onClick={onClick}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 cursor-pointer"
    >
      <div className="relative px-4 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-cyan-900/30 border border-cyan-500/40 hover:border-cyan-400/60 transition-all duration-300 group overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm">
          <span className="text-lg animate-bounce">💡</span>
          <span className="text-cyan-300 font-medium">
            Tip: Just add
            <span className="text-cyan-400 font-bold mx-1 bg-cyan-950/50 px-1.5 py-0.5 rounded inline-block">
              rrr
            </span>
            before youtube.com (or use
            <span className="text-cyan-400 font-bold mx-1">rrryoutube.com</span>
            ) to download instantly!
          </span>
          <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
            See how it works ✨
          </span>
        </div>
      </div>
    </div>
  );
}
