'use client';

import { useRouter } from 'next/navigation';

interface PaymentUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingCredits?: number;
}

export default function PaymentUpgradeModal({ isOpen, onClose, remainingCredits = 0 }: PaymentUpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      {/* Modal Container */}
      <div
        className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-500/30 max-w-lg w-full"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-cyan-500/30 flex items-start justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              ✨ Unlock Premium Downloads
            </h2>
            <p className="text-sm text-cyan-300/80 mt-2">
              {remainingCredits > 0
                ? `You have ${remainingCredits} credit${remainingCredits !== 1 ? 's' : ''} remaining`
                : 'You\'ve run out of free downloads'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-cyan-500/10 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30 border border-cyan-500/20"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-cyan-400 hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Upgrade Options */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* Starter Plan */}
          <button
            onClick={() => router.push('/pricing?plan=starter')}
            className="w-full p-5 bg-gradient-to-r from-green-950/40 to-emerald-950/40 border-2 border-green-500/50 hover:border-green-400/80 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">💚 Starter</h3>
                <p className="text-sm text-zinc-300">Ad-free basic downloads</p>
                <p className="text-xs text-zinc-400 mt-1">Great for casual users</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-300">$4.99</p>
                <p className="text-xs text-zinc-400">/month</p>
              </div>
            </div>
          </button>

          {/* Pro Plan */}
          <button
            onClick={() => router.push('/pricing?plan=pro')}
            className="w-full p-5 bg-gradient-to-r from-violet-950/40 to-pink-950/40 border-2 border-violet-500/50 hover:border-violet-400/80 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">🚀 Pro Pass</h3>
                <p className="text-sm text-zinc-300">Unlimited downloads + AI tools</p>
                <p className="text-xs text-zinc-400 mt-1">Most popular</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-violet-300">$19</p>
                <p className="text-xs text-zinc-400">/month</p>
              </div>
            </div>
          </button>

          {/* MAX Plan - HIGHLIGHTED AS ANCHOR */}
          <button
            onClick={() => router.push('/pricing?plan=max')}
            className="w-full p-5 bg-gradient-to-r from-amber-950/40 to-orange-950/40 border-2 border-amber-500/60 hover:border-amber-400/80 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 ring-2 ring-amber-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-amber-300 mb-1">🌟 MAX (Ultimate)</h3>
                <p className="text-sm text-zinc-300">Everything + Priority Processing</p>
                <p className="text-xs text-amber-400 mt-1">Best value for creators</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-300">$49</p>
                <p className="text-xs text-zinc-400">/month</p>
              </div>
            </div>
          </button>

          {/* Buy Credits */}
          <button
            onClick={() => router.push('/store/credits')}
            className="w-full p-5 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border-2 border-emerald-500/50 hover:border-emerald-400/80 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-emerald-300 mb-1">💳 Buy Credits</h3>
                <p className="text-sm text-zinc-300">One-time purchase for downloads</p>
                <p className="text-xs text-zinc-400 mt-1">Flexible top-up option</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-300">$4.99</p>
                <p className="text-xs text-zinc-400">500 credits</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-6 border-t border-cyan-500/30 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <p className="text-sm text-zinc-300 text-center">
            Need more details?{' '}
            <a href="/pricing" className="text-cyan-300 hover:text-cyan-200 font-bold transition-all">
              View full comparison
            </a>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-zinc-300 hover:text-white transition-all border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg"
          >
            Later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
