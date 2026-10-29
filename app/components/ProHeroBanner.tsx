'use client';

export default function ProHeroBanner() {
  const handleClick = () => {
    // Smooth scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <button
        onClick={handleClick}
        className="group w-full relative px-4 sm:px-8 py-6 sm:py-8 rounded-xl transition-all duration-300 overflow-hidden border-2 border-cyan-500/50 hover:border-cyan-400/80"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl blur-xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-3xl sm:text-4xl">👑</span>
          <div className="text-center sm:text-left">
            <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all">
              1080p & 4K Download Unlimited
            </div>
            <div className="text-sm sm:text-base text-zinc-400 group-hover:text-zinc-300 transition-colors mt-2">
              Unlock the highest quality with Pro Pass • Tap to explore plans
            </div>
          </div>
          <span className="text-3xl sm:text-4xl">⚡</span>
        </div>
      </button>
    </div>
  );
}
