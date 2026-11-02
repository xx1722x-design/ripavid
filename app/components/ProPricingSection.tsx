'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { translations } from '@/app/locales';
import RRRTipBanner from './RRRTipBanner';

interface ProPricingSectionProps {
  language?: string;
  onScrollToDownloader?: () => void;
  onOpenRRRModal?: () => void;
  onOpenPricingModal?: () => void;
}

export default function ProPricingSection({ language = 'en', onScrollToDownloader, onOpenRRRModal, onOpenPricingModal }: ProPricingSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const t = translations[language as keyof typeof translations] || translations['en'];

  const handleFreeClick = () => {
    onScrollToDownloader?.();
  };

  // Gumroad URL Mapping by Plan & Billing Period
  const gumroadLinks: Record<string, Record<'monthly' | 'yearly', string>> = {
    starter: {
      monthly: 'https://7760636545235.gumroad.com/l/spvsfb',
      yearly: 'https://7760636545235.gumroad.com/l/rdvthz',
    },
    pro: {
      monthly: 'https://7760636545235.gumroad.com/l/faqur',
      yearly: 'https://7760636545235.gumroad.com/l/ytyllv',
    },
    max: {
      monthly: 'https://7760636545235.gumroad.com/l/jwogeik',
      yearly: 'https://7760636545235.gumroad.com/l/usjkjb',
    },
  };

  const getGumroadLink = (plan: 'starter' | 'pro' | 'max'): string => {
    return gumroadLinks[plan][billingPeriod];
  };

  const handleGumroadCheckout = (plan: 'starter' | 'pro' | 'max') => {
    const checkoutLink = getGumroadLink(plan);
    window.open(checkoutLink, '_blank', 'noopener,noreferrer');
  };

  const initiateLemonSqueezyCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = '/api/auth/google';
      return;
    }

    if (user?.tier === 'pro') {
      alert('You are already a Pro member!');
      return;
    }

    // TODO: Implement Lemon Squeezy checkout flow
    console.log('Initiating Lemon Squeezy checkout for Fiat payments');
    alert('Lemon Squeezy checkout will be available soon');
  };

  const initiateNOWPaymentsCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = '/api/auth/google';
      return;
    }

    if (user?.tier === 'pro') {
      alert('You are already a Pro member!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/crypto/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          billingPeriod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to create payment: ${error.error}`);
        return;
      }

      const data = await response.json();
      if (data.invoiceUrl) {
        // Redirect to NOWPayments invoice
        window.location.href = data.invoiceUrl;
      }
    } catch (error) {
      console.error('Crypto checkout error:', error);
      alert('Failed to initiate crypto payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // Pricing Structure
  // Starter: $4.99/month or $3.33/month when billed yearly ($39.99/year)
  const starterPrice = billingPeriod === 'yearly' ? '$3.33' : '$4.99';
  const starterBilledText = billingPeriod === 'yearly' ? 'Billed $39.99 yearly' : 'Billed monthly';

  const proPrice = '$19';
  const proBilledText = billingPeriod === 'yearly'
    ? 'Billed $150 yearly'
    : 'Billed monthly';

  const maxPrice = '$49';
  const maxBilledText = billingPeriod === 'yearly'
    ? 'Billed $390 yearly'
    : 'Billed monthly';

  return (
    <div id="pricing" className="w-full scroll-mt-4 py-8 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Domain Approval Pending Message */}
        {showApprovalMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-amber-900/90 border border-amber-500 text-amber-100 px-6 py-4 rounded-lg shadow-lg max-w-sm animate-in fade-in slide-in-from-right-4">
            <p className="font-semibold text-sm mb-1">⏳ Domain Approval in Progress</p>
            <p className="text-xs">Pro pass checkout will be available soon. Please check back later!</p>
          </div>
        )}

        {/* View Plans & Features Comparison Smart Banner */}
        <div className="w-full max-w-4xl mx-auto mb-4 px-4">
          <button
            onClick={onScrollToDownloader}
            className="w-full bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 text-center hover:border-indigo-400/50 hover:bg-indigo-900/40 transition-all duration-300 group cursor-pointer"
          >
            <p className="text-sm text-indigo-300">
              💰 <span className="font-semibold">View Plans & Features Comparison</span> - Choose what works best for your needs
            </p>
          </button>
        </div>

        {/* RRR Tip Banner - Right Below Comparison Banner */}
        <div className="w-full max-w-4xl mx-auto mb-12 px-4">
          <RRRTipBanner
            onClick={onOpenRRRModal || (() => {})}
            language={language}
            onScrollToDownloader={onScrollToDownloader}
          />
        </div>

        {/* Section Header */}
        <div className="text-center mb-12 mt-2">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Monthly
          </button>

          {/* Toggle Switch */}
          <div className="relative w-16 h-8 bg-zinc-700 rounded-full cursor-pointer transition-colors" onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}>
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform transform ${
                billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
            {billingPeriod === 'yearly' && (
              <div className="absolute -top-2 -right-8 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap animate-pulse">
                {t.pricingSave60 || 'Save 60%'}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-3 sm:p-4 border border-zinc-700 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="mb-1">
                <h3 className="text-2xl font-bold text-white mb-0.5">{t.freePlanTitle || 'Free'}</h3>
                <p className="text-cyan-300 text-sm">{t.freePlanDescription || 'Ad-supported unlimited downloads'}</p>
              </div>

              <div className="mb-1.5 pb-1.5 border-b border-zinc-700">
                <div className="text-4xl font-bold text-white">
                  $0<span className="text-lg text-zinc-400">/month</span>
                </div>
              </div>

              <ul className="space-y-0.5">
                {[
                  t.freeFeature1 || 'Up to 720p quality',
                  t.freeFeature2 || 'Unlimited downloads (with ads)',
                  t.freeFeature3 || 'No registration required'
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 pt-1.5 sm:pt-2 mt-1">
              {!isAuthenticated ? (
                <button
                  onClick={handleFreeClick}
                  className="w-full py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                >
                  {t.freeCtaButton || 'Get Started'}
                </button>
              ) : user?.tier === 'free' ? (
                <button
                  onClick={handleFreeClick}
                  className="w-full py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                >
                  {t.freeBackButton || 'Back to Importer'}
                </button>
              ) : null}
            </div>
          </div>

          {/* Starter Plan - Light Users */}
          <div className="relative p-3 sm:p-4 border-2 border-green-500/50 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 hover:from-green-900/50 hover:to-emerald-900/50 transition-all duration-300 flex flex-col justify-between h-full overflow-visible shadow-lg shadow-green-500/10">
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-0.5 rounded-full text-xs font-bold z-10 shadow-lg">
              ⭐ MOST POPULAR
            </div>

            <div>
              <div className="mb-1.5">
                <h3 className="text-2xl font-bold text-white mb-0.5">Starter</h3>
                <p className="text-green-300 text-sm font-semibold">☕ Just a coffee! No ads + Fast downloads</p>
                <p className="text-xs text-zinc-400 mt-0.5">Popular choice for casual creators</p>
              </div>

              <div className="mb-2 pb-2 border-b border-green-500/30">
                <div className="text-4xl font-bold text-white">
                  {starterPrice}<span className="text-lg text-zinc-400">/month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{starterBilledText}</p>
              </div>

              <ul className="space-y-1">
                {[
                  '✓ Up to 720p/1080p quality',
                  '✓ Ad-free downloads',
                  '✓ Unlimited basic imports',
                  '✓ Download history'
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 pt-3 sm:pt-4 mt-3">
              <button
                onClick={() => handleGumroadCheckout('starter')}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-all transform hover:scale-105 text-xs sm:text-sm"
              >
                {isLoading ? 'Loading...' : 'Get Starter'}
              </button>
            </div>
          </div>

          {/* Pro Plan - Featured */}
          <div className="relative p-3 sm:p-4 border-2 border-cyan-500 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:from-cyan-900/40 hover:to-blue-900/40 transition-all duration-300 md:scale-105 flex flex-col justify-between h-full overflow-visible">
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-0.5 rounded-full text-xs sm:text-sm font-bold z-10">
              {t.proMostPopular || 'MOST POPULAR'}
            </div>

            <div>
              <div className="mb-1.5">
                <h3 className="text-2xl font-bold text-white mb-0.5">{t.proPlanTitle || 'Pro'}</h3>
                <p className="text-cyan-300 text-sm">{t.proPlanDescription || 'Professional content localization suite'}</p>
              </div>

              <div className="mb-2 pb-2 border-b border-cyan-500/30">
                <div className="text-4xl font-bold text-white">
                  {proPrice}<span className="text-lg text-zinc-400">/month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{proBilledText}</p>
              </div>

              <ul className="space-y-1">
                {[
                  t.proFeature1 || '👑 1080p & 4K Unlimited Imports (Asia platforms incl.)',
                  t.proFeature2 || '👑 AI Subtitle Extraction (SRT)',
                  t.proFeature3 || '👑 1-Click Multi-language Translation (20+ languages)',
                  t.proFeature4 || '👑 Viral Shorts Timestamp Curation',
                  t.proFeature5 || '👑 Auto SEO Title & Tags Generation'
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 pt-3 sm:pt-4 mt-3">
              {user?.tier === 'pro' ? (
                <button className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg transition-all opacity-70 cursor-default text-xs sm:text-sm">
                  Your Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleGumroadCheckout('pro')}
                  disabled={isLoading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all transform hover:scale-105 text-xs sm:text-sm"
                >
                  {isLoading ? 'Loading...' : 'Upgrade Now'}
                </button>
              )}
            </div>
          </div>

          {/* MAX Plan - Ultimate */}
          <div className="relative p-3 sm:p-4 border-2 border-amber-500/60 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 hover:from-amber-900/40 hover:to-orange-900/40 transition-all duration-300 flex flex-col justify-between h-full overflow-visible">
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-0.5 rounded-full text-xs sm:text-sm font-bold z-10">
              ULTIMATE
            </div>

            <div>
              <div className="mb-1.5">
                <h3 className="text-2xl font-bold text-white mb-0.5">MAX</h3>
                <p className="text-amber-300 text-sm">Professional creators & teams</p>
              </div>

              <div className="mb-2 pb-2 border-b border-amber-500/30">
                <div className="text-4xl font-bold text-white">
                  {maxPrice}<span className="text-lg text-zinc-400">/month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{maxBilledText}</p>
              </div>

              <ul className="space-y-1">
                {[
                  'Everything in Pro',
                  'ElevenLabs AI Dubbing (40+ Voices)',
                  'Batch Download (Multi-language)',
                  'Priority Server Processing'
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 pt-3 sm:pt-4 mt-3">
              <button
                onClick={() => handleGumroadCheckout('max')}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-all transform hover:scale-105 text-xs sm:text-sm"
              >
                {isLoading ? 'Loading...' : 'Upgrade to MAX'}
              </button>
            </div>
          </div>
        </div>

        {/* Compare All Features Link */}
        <div className="text-center mt-6">
          <button
            onClick={onOpenPricingModal}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
          >
            Compare all features in detail →
          </button>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-6">
          <p className="text-zinc-500 text-sm">
            🔒 Secure payments powered by Lemon Squeezy & NOWPayments • Cancel anytime, no hidden fees
          </p>
        </div>
      </div>

      {/* Hybrid Payment Method Selection Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentMethodModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3">
                Choose Payment Method
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Select how you'd like to pay for your Pro Pass
              </p>
            </div>

            {/* Payment Method Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Fiat Payment Option - Lemon Squeezy */}
              <div
                onClick={() => {
                  initiateLemonSqueezyCheckout();
                  setShowPaymentMethodModal(false);
                }}
                className="p-6 border-2 border-cyan-500/50 rounded-xl cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all group"
              >
                <div className="text-4xl mb-3">💳</div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-cyan-600">
                  Cards & Apple Pay
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Pay with credit/debit card or Apple Pay
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Powered by Lemon Squeezy
                </p>
              </div>

              {/* Digital Wallets Option - Lemon Squeezy */}
              <div
                onClick={() => {
                  initiateLemonSqueezyCheckout();
                  setShowPaymentMethodModal(false);
                }}
                className="p-6 border-2 border-green-500/50 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all group"
              >
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-green-600">
                  Digital Wallets
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Google Pay, PayPal, and more
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Powered by Lemon Squeezy
                </p>
              </div>

              {/* Local Payments Option - Lemon Squeezy */}
              <div
                onClick={() => {
                  initiateLemonSqueezyCheckout();
                  setShowPaymentMethodModal(false);
                }}
                className="p-6 border-2 border-blue-500/50 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
              >
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-blue-600">
                  Local Payments
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Regional payment methods in your country
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Powered by Lemon Squeezy
                </p>
              </div>

              {/* Crypto Payment Option - NOWPayments */}
              <div
                onClick={() => {
                  initiateNOWPaymentsCheckout();
                  setShowPaymentMethodModal(false);
                }}
                className="p-6 border-2 border-orange-500/50 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all group"
              >
                <div className="text-4xl mb-3">₿</div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-orange-600">
                  Crypto & Web3
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Bitcoin, Ethereum, and other cryptocurrencies
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Powered by NOWPayments
                </p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-xs text-gray-600 dark:text-gray-400">
              <p>All payment methods are secure and encrypted.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
