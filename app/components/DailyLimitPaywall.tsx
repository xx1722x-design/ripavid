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

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Modal Container (Neon Black Punk Style) */}
      <div
        className="w-full max-w-md bg-gradient-to-br from-zinc-900/95 via-black to-zinc-900/95 border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-500/20 relative text-center"
        style={{
          animation: 'pulseGlow 4s infinite ease-in-out, fadeInScale 0.4s ease-out',
          boxShadow: '0 0 40px rgba(0, 242, 254, 0.15), 0 0 80px rgba(79, 172, 254, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition duration-200"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/40">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.72-7 8.77V12H5V6.3l7-3.11v8.8z" />
          </svg>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Daily Limit Reached
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          You've used your <span className="text-cyan-400 font-semibold">3 free guest downloads</span> for today. Sign up for a free account to get unlimited downloads and higher resolutions!
        </p>

        {/* Feature Checklist */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-xs text-gray-300">
          <div className="flex items-center space-x-2.5">
            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Unlimited Daily Video Downloads</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Full HD 1080p, 2K & 4K Quality</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Instant "rrr" Shortcut Access</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSignUp}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-105 duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75C2.51 1.5 1.5 2.51 1.5 3.75v12.5c0 1.24 1.01 2.25 2.25 2.25h12.5c1.24 0 2.25-1.01 2.25-2.25V9.5" />
              <path d="M10 7v6M7 10h6" />
            </svg>
            <span>Sign Up Free (Unlimited)</span>
          </button>
          <button
            onClick={handleSignIn}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition duration-200 text-xs flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Already have an account? Sign In</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 242, 254, 0.15), 0 0 40px rgba(79, 172, 254, 0.1); }
          50% { box-shadow: 0 0 40px rgba(0, 242, 254, 0.25), 0 0 80px rgba(79, 172, 254, 0.15); }
        }
        @keyframes fadeInScale {
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
