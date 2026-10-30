'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { translations } from '@/app/locales';

interface PaddlePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PaddlePaymentModal({
  isOpen,
  onClose,
  language,
}: PaddlePaymentModalProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'yearly' | 'monthly'>('yearly'); // Default: Yearly
  const t = translations[language as keyof typeof translations] || translations['en'];

  useEffect(() => {
    if (!isOpen) return;

    // Load Paddle script
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          pwCustomFont: 'inter',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  const handleSubscribe = async () => {
    if (!window.Paddle) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRODUCT_ID,
            quantity: 1,
          },
        ],
        customer: {
          email: user?.email || '',
        },
        customData: {
          userId: user?.uid || '',
        },
        onCheckoutComplete: async (data: any) => {
          // Update user tier to Pro after successful payment
          try {
            const response = await fetch('/api/auth/upgrade-to-pro', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user?.uid,
                subscriptionId: data.subscriptionId,
              }),
            });

            if (response.ok) {
              await refreshUser();
              onClose();
            }
          } catch (error) {
            console.error('Failed to upgrade user:', error);
          }
        },
      });
    } catch (error) {
      console.error('Paddle error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-black text-black dark:text-white mb-3">
            {t.proPassModalTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 opacity-75">
            {t.proPassModalSubtitle}
          </p>
        </div>

        {/* Billing Period Selection */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Monthly Card */}
          <div
            onClick={() => setBillingPeriod('monthly')}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform ${
              billingPeriod === 'monthly'
                ? 'border-gray-400 bg-gray-100 dark:bg-zinc-800'
                : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="billing"
                value="monthly"
                checked={billingPeriod === 'monthly'}
                onChange={() => setBillingPeriod('monthly')}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-lg font-bold text-black dark:text-white">
                {t.proPassMonthlyLabel}
              </span>
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mb-1">
              {t.proPassMonthlyPrice}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.proPassMonthlyBilled}
            </p>
          </div>

          {/* Yearly Card (Default & Highlighted) */}
          <div
            onClick={() => setBillingPeriod('yearly')}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform ring-2 ring-green-500 bg-green-50 dark:bg-green-950/30 scale-105 relative overflow-hidden ${
              billingPeriod === 'yearly'
                ? 'border-green-500'
                : 'border-green-400'
            }`}
          >
            {/* Badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              {t.proPassYearlyBadge}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="billing"
                value="yearly"
                checked={billingPeriod === 'yearly'}
                onChange={() => setBillingPeriod('yearly')}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-lg font-bold text-black dark:text-white">
                {t.proPassYearlyLabel}
              </span>
            </div>

            {/* Price with strikethrough */}
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
                {t.proPassOldPrice}
              </p>
              <p className="text-3xl font-black text-green-600 dark:text-green-400">
                {t.proPassYearlyPrice}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.proPassYearlyBilled}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8 p-6 bg-gray-100 dark:bg-zinc-800 rounded-xl">
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-4">✨ {t.features}</p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t[`feature${i}` as keyof typeof t]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isLoading ? t.loading : (
            billingPeriod === 'yearly' ? t.proPassCtaBtnYearly : t.proPassCtaBtnMonthly
          )}
        </button>

        {/* Trust Badge & Disclaimer */}
        <div className="mt-6 space-y-3">
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            {t.proPassSecurePayment}
          </p>
          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            {t.proPassDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
