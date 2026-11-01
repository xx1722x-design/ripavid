'use client';

interface ProHeroBannerProps {
  onOpenPricingModal?: () => void;
}

export default function ProHeroBanner({ onOpenPricingModal }: ProHeroBannerProps) {
  const handleClick = () => {
    if (onOpenPricingModal) {
      onOpenPricingModal();
    } else {
      // Fallback: Smooth scroll to pricing section
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <button
        onClick={handleClick}
        className="group w-full relative px-4 sm:px-8 py-6 sm:py-8 rounded-xl transition-all duration-300 overflow-hidden border-2 border-cyan-500/50 hover:border-purple-400/80 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-purple-900/40 to-pink-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Enhanced glow effect */}
        <div className="absolute inset-0 rounded-xl blur-2xl bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-300">💎</span>
          <div className="text-center sm:text-left flex-1">
            <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-cyan-300 transition-all">
              View Plans & Features Comparison
            </div>
            <div className="text-sm sm:text-base text-zinc-300 group-hover:text-white transition-colors mt-2">
              Guest vs Free vs Pro • See what you can unlock →
            </div>
          </div>
          <span className="text-2xl sm:text-3xl group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </button>
    </div>
  );
}
