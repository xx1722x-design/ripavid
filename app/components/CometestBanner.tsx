'use client';

export default function CometestBanner() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
      <a
        href="https://www.cometest.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:from-purple-500/20 hover:to-pink-500/20 group"
      >
        <span className="text-lg flex-shrink-0">🎮</span>
        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">
          Play Fun Games & Psych Tests
        </span>
        <span className="text-lg flex-shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
      </a>
    </div>
  );
}
