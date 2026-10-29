'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

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

const translations: Record<string, Record<string, string>> = {
  en: {
    proPass: 'Pro Pass',
    upgradeTitle: 'Unlock Full Quality Downloads',
    upgradeDesc: 'Get access to 1080p, 4K, and all premium quality formats',
    price: '$4.99/month',
    features: 'Features included',
    feature1: '1080p & 4K downloads',
    feature2: 'Unlimited downloads',
    feature3: 'No watermarks',
    feature4: 'Priority support',
    subscribe: 'Subscribe Now',
    cancel: 'Cancel',
    loading: 'Loading payment...',
  },
  ko: {
    proPass: 'Pro Pass',
    upgradeTitle: '고급 화질 다운로드 잠금 해제',
    upgradeDesc: '1080p, 4K, 모든 프리미엄 화질 형식에 접근',
    price: '$4.99/월',
    features: '포함된 기능',
    feature1: '1080p & 4K 다운로드',
    feature2: '무제한 다운로드',
    feature3: '워터마크 없음',
    feature4: '우선 지원',
    subscribe: '지금 구독하기',
    cancel: '취소',
    loading: '결제 로딩중...',
  },
  'zh-CN': {
    proPass: 'Pro Pass',
    upgradeTitle: '解锁高质量下载',
    upgradeDesc: '获取1080p、4K和所有高级质量格式',
    price: '$4.99/月',
    features: '包含的功能',
    feature1: '1080p & 4K 下载',
    feature2: '无限下载',
    feature3: '无水印',
    feature4: '优先支持',
    subscribe: '立即订阅',
    cancel: '取消',
    loading: '加载支付...',
  },
};

export default function PaddlePaymentModal({
  isOpen,
  onClose,
  language,
}: PaddlePaymentModalProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[language] || translations['en'];

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
      <div className="bg-zinc-900 border-2 border-purple-500/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Badge */}
        <div className="inline-block mb-4 px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full">
          <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            👑 {t.proPass}
          </p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">{t.upgradeTitle}</h2>
        <p className="text-zinc-400 text-sm mb-6">{t.upgradeDesc}</p>

        {/* Price */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg">
          <p className="text-3xl font-bold text-white">
            {t.price}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Cancel anytime</p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-3">
          <p className="text-sm font-bold text-purple-300 mb-4">✨ {t.features}</p>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-zinc-300">
                {t[`feature${i}` as keyof typeof t]}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
          >
            {isLoading ? t.loading : t.subscribe}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
        </div>

        {/* Trust Badge */}
        <p className="text-xs text-zinc-500 text-center mt-6">
          🔒 Secure payment powered by Paddle
        </p>
      </div>
    </div>
  );
}
