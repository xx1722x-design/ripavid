'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdWaitTimerProps {
  isOpen: boolean;
  onSkip?: () => void;
  onUpgrade?: () => void;
}

export default function AdWaitTimer({ isOpen, onSkip, onUpgrade }: AdWaitTimerProps) {
  const [remaining, setRemaining] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    // Reset timer when modal opens
    setRemaining(5);

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSkip?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onSkip]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-yellow-500/60 rounded-2xl shadow-2xl shadow-yellow-500/20 max-w-sm w-full p-8"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-yellow-500/50 bg-yellow-900/20 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-300 font-mono">{remaining}</div>
              <div className="text-xs text-yellow-200">seconds</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">☕ Processing Your Download</h2>
          <p className="text-sm text-zinc-300 mb-2">Preparing your file...</p>
          <p className="text-sm text-yellow-300 font-semibold">Starting download in <span className="font-mono font-bold text-yellow-200">{remaining}s</span>...</p>
        </div>

        {/* Upgrade Nudge */}
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-emerald-500/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-zinc-200 mb-3">
            <strong>💡 Did you know?</strong> Just <strong className="text-emerald-300">$4.99/month</strong> (a Starbucks coffee!) gets you:
          </p>
          <ul className="text-xs text-zinc-300 space-y-1 mb-4">
            <li>✓ <strong className="text-emerald-300">No ads</strong> - 1-click instant download</li>
            <li>✓ <strong className="text-emerald-300">Fast speed</strong> - Turbo download mode</li>
            <li>✓ <strong className="text-emerald-300">Ad-free</strong> - Complete freedom</li>
          </ul>
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-105"
          >
            Upgrade to Starter (Skip the wait!)
          </button>
        </div>

        {/* Wait Button - Disabled during countdown */}
        <button
          disabled={true}
          className="w-full py-3 bg-zinc-700/50 text-white font-semibold rounded-lg transition-colors cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Processing... ({remaining}s)
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        </button>

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
    </div>
  );
}
