'use client';

import { useRouter } from 'next/navigation';

interface DailyLimitPaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyLimitPaywall({ isOpen, onClose }: DailyLimitPaywallProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
      {/* Fade-in animation */}
      <div
        className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-2 border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header with Icon */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-b border-amber-500/30 px-6 sm:px-8 py-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-2">
            Daily Limit Reached
          </h2>
          <p className="text-sm text-zinc-300">
            You've used all 3 free downloads for today
          </p>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-8 space-y-6">
          {/* Limit Info */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <p className="text-zinc-300 mb-3 font-semibold">
              🎬 Free User Limit:
            </p>
            <p className="text-sm text-zinc-400">
              Non-members can download <span className="text-amber-300 font-bold">3 videos per day</span>. Come back tomorrow, or sign up now for unlimited access!
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-cyan-300">✨ Sign up for Free to get:</p>
            <ul className="text-sm text-zinc-300 space-y-1 ml-4">
              <li>✓ Unlimited downloads</li>
              <li>✓ Lifetime download history</li>
              <li>✓ Personal dashboard</li>
              <li>✓ No ads or interruptions</li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="px-6 sm:px-8 py-6 border-t border-zinc-700/30 space-y-3">
          <button
            onClick={handleSignUp}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Sign Up for Free
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors font-medium"
          >
            Come Back Tomorrow
          </button>
        </div>

        {/* Footer Info */}
        <div className="px-6 sm:px-8 py-4 bg-zinc-800/30 border-t border-zinc-700/20 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <a href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign in
            </a>
          </p>
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
