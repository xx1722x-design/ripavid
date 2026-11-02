'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AdWaitTimerProps {
  isOpen: boolean;
  onSkip?: () => void;
  onUpgrade?: () => void;
}

export default function AdWaitTimer({ isOpen, onSkip, onUpgrade }: AdWaitTimerProps) {
  const [remaining, setRemaining] = useState(10);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      hasExecutedRef.current = false;
      return;
    }

    // Reset timer to 10 seconds when modal opens
    setRemaining(10);
    hasExecutedRef.current = false;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const newValue = prev - 1;
        // Trigger download when reaching 0
        if (newValue <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Force execute onSkip only once
          if (!hasExecutedRef.current && onSkip) {
            hasExecutedRef.current = true;
            // Use setTimeout to ensure state update completes first
            setTimeout(() => {
              onSkip();
            }, 50);
          }
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, onSkip]);

  const handleSkipNow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!hasExecutedRef.current && onSkip) {
      hasExecutedRef.current = true;
      onSkip();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-zinc-950 to-zinc-900 border-2 border-yellow-500/60 rounded-2xl shadow-2xl shadow-yellow-500/20 max-w-sm w-full p-8"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Timer Display - Visual Countdown */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-yellow-400/60 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 mb-8 shadow-2xl shadow-yellow-500/20">
            <div className="text-center">
              <div className="text-7xl font-black text-yellow-300 font-mono tabular-nums">{remaining.toString().padStart(2, '0')}</div>
              <div className="text-sm text-yellow-200 font-semibold mt-1">seconds</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">⏳ Your Download Starts In...</h2>
          <p className="text-lg text-yellow-300 font-bold mb-3">Download will be ready in <span className="font-mono text-yellow-100">{remaining}s</span></p>
          <p className="text-sm text-zinc-300">We're preparing your file for maximum speed</p>
        </div>

        {/* Manual Skip Button - For impatient users */}
        <button
          onClick={handleSkipNow}
          className="w-full mb-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <span className="text-xl">⚡</span>
          <span>Download Now (Skip {remaining}s)</span>
        </button>

        {/* Upgrade Nudge - Premium CTA */}
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-emerald-400/70 rounded-lg p-5 mb-6 shadow-lg shadow-emerald-500/20">
          <p className="text-base font-bold text-emerald-200 mb-4">
            💰 <strong>Skip the wait!</strong> Get unlimited 4K downloads for just <strong className="text-emerald-100 text-lg">$4.99/month</strong>
          </p>
          <ul className="text-sm text-emerald-100 space-y-2 mb-4 font-semibold">
            <li>✨ <strong>Instant downloads</strong> - No waiting!</li>
            <li>🎬 <strong>Unlimited 4K</strong> - Premium quality</li>
            <li>⚡ <strong>Turbo speed</strong> - 10x faster</li>
          </ul>
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            🚀 Upgrade to Starter (Skip {remaining}s wait!)
          </button>
        </div>

        {/* Auto-Download Progress - Passive display */}
        <div className="w-full py-4 bg-gradient-to-r from-zinc-700/30 to-zinc-600/30 text-zinc-300 font-semibold rounded-lg flex items-center justify-center gap-3 border border-zinc-500/30">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Auto-download in {remaining}s...</span>
          <span className="font-mono font-bold text-blue-300">{remaining.toString().padStart(2, '0')}</span>
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
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
    </div>
  );
}
