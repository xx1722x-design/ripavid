'use client';

import { useState } from 'react';

interface PricingComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingComparisonModal({ isOpen, onClose }: PricingComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      {/* Fade-in animation */}
      <div
        className="bg-zinc-950 border-2 border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header with Close Button - Neon Glow */}
        <div className="sticky top-0 bg-zinc-950 border-b-2 border-cyan-500/30 px-6 sm:px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Plans & Features Comparison
            </h2>
            <p className="text-sm text-cyan-300/80 mt-1">✨ Choose the perfect plan for your needs</p>
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

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Desktop Table View - Neon Black Punk Style */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cyan-500/40">
                  <th className="text-left py-4 px-4 font-bold text-white">Feature</th>
                  <th className="text-center py-4 px-4 font-bold">
                    <div className="text-cyan-300 drop-shadow-md">👤 Guest</div>
                    <div className="text-xs text-zinc-300">(No Sign-up)</div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold">
                    <div className="text-blue-300 drop-shadow-md">✨ Free</div>
                    <div className="text-xs text-zinc-300">(Free Member)</div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold">
                    <div className="text-violet-300 drop-shadow-md">🚀 Pro Pass</div>
                    <div className="text-xs text-zinc-300">(Premium)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Maximum Video Quality</td>
                  <td className="text-center py-4 px-4 text-zinc-300">720p</td>
                  <td className="text-center py-4 px-4 text-zinc-300 border-l border-r border-blue-500/20">720p</td>
                  <td className="text-center py-4 px-4 font-bold text-violet-200">1080p • 2K • 4K</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Download Limit</td>
                  <td className="text-center py-4 px-4 text-zinc-400">3 per day</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20">
                    <span className="text-emerald-300 font-bold drop-shadow-md">Unlimited ✓</span>
                  </td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">Unlimited ✓</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Download History</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20">
                    <span className="text-emerald-300 font-bold">Lifetime Saved ✓</span>
                  </td>
                  <td className="text-center py-4 px-4 text-emerald-300 font-bold">Lifetime Saved ✓</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">AI Subtitle Extraction (SRT)</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓ (21 Languages)</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">AI Multi-Language Translation</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓ (Auto-Sync)</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Viral Clip Timestamp Curation</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓ (9:16 Format)</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">ElevenLabs AI Dubbing</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓ (40+ Voices)</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Subtitle Burn-in & Overlay</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓</td>
                </tr>
                <tr className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-all">
                  <td className="py-4 px-4 text-zinc-200 font-medium">Batch Download (Multi-language)</td>
                  <td className="text-center py-4 px-4 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 border-l border-r border-blue-500/20 text-zinc-500">✗</td>
                  <td className="text-center py-4 px-4 font-bold text-emerald-300">✓</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Neon Black Punk */}
          <div className="md:hidden space-y-5">
            {/* Guest Card */}
            <div className="bg-zinc-950/80 border-2 border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="text-lg font-bold text-cyan-300 drop-shadow-md mb-1">Guest</h3>
              <p className="text-sm text-zinc-300 mb-4">No Sign-up Required</p>
              <ul className="space-y-2 text-sm text-zinc-200 mb-6">
                <li><span className="text-emerald-300 font-bold">✓</span> Maximum 720p quality</li>
                <li><span className="text-zinc-500">✗</span> 3 downloads per day limit</li>
                <li><span className="text-zinc-500">✗</span> No download history</li>
              </ul>
            </div>

            {/* Free Card */}
            <div className="bg-zinc-950/80 border-2 border-blue-400/40 rounded-xl p-6 hover:border-blue-400/60 transition-all">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="text-lg font-bold text-blue-300 drop-shadow-md mb-1">Free Member</h3>
              <p className="text-sm text-zinc-300 mb-4">Free Account</p>
              <ul className="space-y-2 text-sm text-zinc-200 mb-6">
                <li><span className="text-emerald-300 font-bold">✓</span> Maximum 720p quality</li>
                <li><span className="text-emerald-300 font-bold">✓</span> Unlimited downloads</li>
                <li><span className="text-emerald-300 font-bold">✓</span> Lifetime download history</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30">
                Sign Up for Free
              </button>
            </div>

            {/* Pro Card */}
            <div className="bg-zinc-950/80 border-2 border-violet-400/40 rounded-xl p-6 shadow-lg shadow-violet-500/10 hover:border-violet-400/60 transition-all">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-lg font-bold text-violet-300 drop-shadow-md mb-1">Pro Pass</h3>
              <p className="text-sm text-zinc-300 mb-4">Premium Creator Plan</p>
              <ul className="space-y-2 text-sm text-zinc-200 mb-6">
                <li><span className="text-emerald-300 font-bold">✓</span> 1080p, 2K, 4K quality</li>
                <li><span className="text-emerald-300 font-bold">✓</span> Unlimited downloads</li>
                <li><span className="text-emerald-300 font-bold">✓</span> AI subtitles (21 languages)</li>
                <li><span className="text-emerald-300 font-bold">✓</span> AI dubbing & translation</li>
                <li><span className="text-emerald-300 font-bold">✓</span> Viral clip curation</li>
                <li><span className="text-emerald-300 font-bold">✓</span> Batch download</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-violet-500/30">
                Upgrade to Pro ✨
              </button>
            </div>
          </div>
        </div>

        {/* CTA Footer - Neon Black Punk */}
        <div className="sticky bottom-0 bg-zinc-950 border-t-2 border-cyan-500/30 px-6 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <p className="text-sm text-zinc-300 text-center sm:text-left">
            Already have an account?{' '}
            <a href="/auth/login" className="text-cyan-300 hover:text-cyan-200 font-bold transition-all drop-shadow-md">
              Sign in
            </a>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-zinc-300 hover:text-white transition-all border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg"
          >
            Close
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
