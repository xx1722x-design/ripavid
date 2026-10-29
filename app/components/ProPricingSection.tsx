'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface ProPricingSectionProps {
  language?: string;
  onScrollToDownloader?: () => void;
}

export default function ProPricingSection({ language = 'en', onScrollToDownloader }: ProPricingSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);

  const handleFreeClick = () => {
    onScrollToDownloader?.();
  };

  const handleUpgradeClick = async () => {
    if (!isAuthenticated) {
      window.location.href = '/api/auth/google';
      return;
    }

    if (user?.tier === 'pro') {
      alert('You are already a Pro member!');
      return;
    }

    // Show domain approval pending message
    setShowApprovalMessage(true);
    setTimeout(() => setShowApprovalMessage(false), 4000);
  };

  return (
    <div id="pricing" className="w-full py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Domain Approval Pending Message */}
        {showApprovalMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-amber-900/90 border border-amber-500 text-amber-100 px-6 py-4 rounded-lg shadow-lg max-w-sm animate-in fade-in slide-in-from-right-4">
            <p className="font-semibold text-sm mb-1">⏳ Domain Approval in Progress</p>
            <p className="text-xs">Pro pass checkout will be available soon. Please check back later!</p>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-8 border border-zinc-700 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-zinc-400 text-sm">Perfect for basic downloads</p>
            </div>

            <div className="mb-8 pb-8 border-b border-zinc-700">
              <div className="text-4xl font-bold text-white">
                $0<span className="text-lg text-zinc-400">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {['Up to 720p quality', 'Unlimited downloads', 'No sign-up required'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>

            {!isAuthenticated ? (
              <button
                onClick={handleFreeClick}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
              >
                Get Started
              </button>
            ) : user?.tier === 'free' ? (
              <button
                onClick={handleFreeClick}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Downloader
              </button>
            ) : null}
          </div>

          {/* Pro Plan - Featured */}
          <div className="relative p-8 border-2 border-cyan-500 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:from-cyan-900/40 hover:to-blue-900/40 transition-all duration-300 md:scale-105">
            <div className="absolute -top-4 left-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Pro Pass</h3>
              <p className="text-cyan-300 text-sm">Unlimited high-quality downloads</p>
            </div>

            <div className="mb-8 pb-8 border-b border-cyan-500/30">
              <div className="text-4xl font-bold text-white">
                $4.99<span className="text-lg text-zinc-400">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">Cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              {['1080p & 4K quality', 'Unlimited downloads', 'Priority support'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>

            {user?.tier === 'pro' ? (
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg transition-all opacity-70 cursor-default">
                ✓ Your Current Plan
              </button>
            ) : (
              <button
                onClick={handleUpgradeClick}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                {isLoading ? 'Loading...' : !isAuthenticated ? 'Sign in to Upgrade' : 'Upgrade Now'}
              </button>
            )}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-zinc-500 text-sm">
            🔒 Secure payment powered by Paddle • Cancel anytime, no hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
