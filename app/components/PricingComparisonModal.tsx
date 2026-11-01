'use client';

import { useState } from 'react';

interface PricingComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingComparisonModal({ isOpen, onClose }: PricingComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Fade-in animation */}
      <div
        className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-zinc-700/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700/30 px-6 sm:px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Plans & Features Comparison
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Choose the perfect plan for your needs</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-zinc-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  <th className="text-left py-4 px-4 font-semibold text-white">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">
                    <div className="text-cyan-400">👤 Guest</div>
                    <div className="text-xs text-zinc-500">(No Sign-up)</div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    <div className="text-blue-400">✨ Free</div>
                    <div className="text-xs text-zinc-500">(Free Member)</div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    <div className="text-purple-400">🚀 Pro Pass</div>
                    <div className="text-xs text-zinc-500">(Premium)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Maximum Video Quality</td>
                  <td className="text-center py-4 px-4">720p</td>
                  <td className="text-center py-4 px-4 bg-blue-900/10">720p</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">1080p • 2K • 4K</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Download Limit</td>
                  <td className="text-center py-4 px-4">3 per day</td>
                  <td className="text-center py-4 px-4 bg-blue-900/10">
                    <span className="text-blue-300 font-semibold">Unlimited ✓</span>
                  </td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">Unlimited ✓</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Download History</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-blue-900/10">
                    <span className="text-blue-300">Lifetime Saved ✓</span>
                  </td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 text-purple-300">Lifetime Saved ✓</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">AI Subtitle Extraction (SRT)</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓ (21 Languages)</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">AI Multi-Language Translation</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓ (Auto-Sync)</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Viral Clip Timestamp Curation</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓ (9:16 Format)</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">ElevenLabs AI Dubbing</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓ (40+ Voices)</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Subtitle Burn-in & Overlay</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓</td>
                </tr>
                <tr className="border-b border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">Batch Download (Multi-language)</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4">✗</td>
                  <td className="text-center py-4 px-4 bg-purple-900/10 font-semibold text-purple-300">✓</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-6">
            {/* Guest Card */}
            <div className="bg-zinc-800/50 border border-cyan-500/30 rounded-xl p-6">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="text-xl font-bold text-cyan-400 mb-1">Guest</h3>
              <p className="text-sm text-zinc-400 mb-4">No Sign-up Required</p>
              <ul className="space-y-2 text-sm text-zinc-300 mb-6">
                <li>✓ Maximum 720p quality</li>
                <li>✗ 3 downloads per day limit</li>
                <li>✗ No download history</li>
              </ul>
            </div>

            {/* Free Card */}
            <div className="bg-blue-900/20 border-2 border-blue-400/50 rounded-xl p-6">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="text-xl font-bold text-blue-400 mb-1">Free Member</h3>
              <p className="text-sm text-zinc-400 mb-4">Free Account</p>
              <ul className="space-y-2 text-sm text-zinc-300 mb-6">
                <li>✓ Maximum 720p quality</li>
                <li>✓ Unlimited downloads</li>
                <li>✓ Lifetime download history</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                Sign Up for Free
              </button>
            </div>

            {/* Pro Card */}
            <div className="bg-purple-900/30 border-2 border-purple-400/50 rounded-xl p-6 ring-2 ring-purple-400/30">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-xl font-bold text-purple-400 mb-1">Pro Pass</h3>
              <p className="text-sm text-zinc-400 mb-4">Premium Creator Plan</p>
              <ul className="space-y-2 text-sm text-zinc-300 mb-6">
                <li>✓ 1080p, 2K, 4K quality</li>
                <li>✓ Unlimited downloads</li>
                <li>✓ AI subtitles (21 languages)</li>
                <li>✓ AI dubbing & translation</li>
                <li>✓ Viral clip curation</li>
                <li>✓ Batch download</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                Upgrade to Pro ✨
              </button>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-zinc-900 to-zinc-800 border-t border-zinc-700/30 px-6 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <p className="text-sm text-zinc-400 text-center sm:text-left">
            Already have an account?{' '}
            <a href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign in
            </a>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
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
