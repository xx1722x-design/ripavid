'use client';

import { useState, useEffect } from 'react';

interface B2BApiCenterProps {
  language: string;
}

// Translation strings for B2B API
const translations: Record<string, Record<string, string>> = {
  en: {
    badgeText: 'Enterprise API Solutions',
    mainTitle: 'RipAVid Enterprise API Gateway',
    mainDesc: 'High-performance social media video parsing & downloading API for global developers and businesses',
    developerPlan: 'Developer Tier',
    developerDesc: 'Perfect for getting started with video API integration',
    devFeature1: '5,000 requests/month',
    devFeature2: 'Basic API support',
    devFeature3: 'Community access',
    devFeature4: 'Standard response time',
    proPlan: 'Pro Tier',
    proDesc: 'For serious developers and growing applications',
    proFeature1: '50,000 requests/month',
    proFeature2: 'Priority API support',
    proFeature3: 'Auto API Key generation',
    proFeature4: '< 100ms response time',
    proFeature5: 'Advanced analytics dashboard',
    mostPopular: 'MOST POPULAR',
    enterprisePlan: 'Enterprise Tier',
    enterpriseDesc: 'For large-scale operations and enterprise organizations',
    enterpriseFeature1: 'Unlimited requests',
    enterpriseFeature2: '24/7 dedicated support',
    enterpriseFeature3: 'Custom crawling solutions',
    enterpriseFeature4: '99.9% SLA guarantee',
    enterpriseFeature5: '1:1 dedicated account manager',
    getApiKey: 'Get API Key',
    subscribeNow: 'Subscribe Now',
    contactSales: 'Contact Sales',
    featuresTitle: 'API Features',
    featuresDesc: 'Everything you need for seamless integration and high-performance video processing',
    feature1Title: 'Lightning Fast',
    feature1Desc: '<100ms response time for video parsing and downloading',
    feature2Title: 'Enterprise Security',
    feature2Desc: 'SSL/TLS encryption with advanced authentication & authorization',
    feature3Title: 'Global Infrastructure',
    feature3Desc: '99.9% uptime SLA with servers across all continents',
    feature4Title: 'Developer Friendly',
    feature4Desc: 'Complete OpenAPI/Swagger documentation with code examples',
    feature5Title: 'Webhook Support',
    feature5Desc: 'Real-time callbacks for async processing and event notifications',
    feature6Title: 'Analytics Dashboard',
    feature6Desc: 'Monitor usage, track requests, and analyze performance metrics',
    integrationTitle: 'Simple Integration',
    integrationDesc: 'Get started in minutes with our comprehensive documentation and official SDKs for JavaScript, Python, Go, and more',
    readDocs: 'Read Documentation',
    tryRapidapi: 'Try on RapidAPI',
  },
  ko: {
    badgeText: '엔터프라이즈 API 솔루션',
    mainTitle: 'RipAVid Enterprise API Gateway',
    mainDesc: '전 세계 개발자와 기업을 위한 고성능 소셜 미디어 영상 파싱 & 다운로드 API',
    developerPlan: 'Developer Tier',
    developerDesc: '영상 API 통합을 시작하기에 완벽함',
    devFeature1: '월 5,000회 요청',
    devFeature2: '기본 API 지원',
    devFeature3: '커뮤니티 액세스',
    devFeature4: '표준 응답 시간',
    proPlan: 'Pro Tier',
    proDesc: '성장하는 개발자와 애플리케이션을 위함',
    proFeature1: '월 50,000회 요청',
    proFeature2: '우선 API 지원',
    proFeature3: '자동 API Key 발급',
    proFeature4: '100ms 이하 응답 시간',
    proFeature5: '고급 분석 대시보드',
    mostPopular: '가장 인기있음',
    enterprisePlan: 'Enterprise Tier',
    enterpriseDesc: '대규모 운영 및 엔터프라이즈 조직을 위함',
    enterpriseFeature1: '무제한 요청',
    enterpriseFeature2: '24/7 전담 지원',
    enterpriseFeature3: '맞춤형 크롤링 솔루션',
    enterpriseFeature4: '99.9% SLA 보장',
    enterpriseFeature5: '1:1 전담 계정 관리자',
    getApiKey: 'API Key 받기',
    subscribeNow: '지금 구독',
    contactSales: '영업팀 문의',
    featuresTitle: 'API 기능',
    featuresDesc: '원활한 통합과 고성능 영상 처리를 위한 모든 것을 제공합니다',
    feature1Title: '번개 같은 속도',
    feature1Desc: '영상 파싱 및 다운로드 100ms 이하 응답 시간',
    feature2Title: '엔터프라이즈 보안',
    feature2Desc: 'SSL/TLS 암호화 및 고급 인증 & 권한 부여',
    feature3Title: '글로벌 인프라',
    feature3Desc: '모든 대륙에 서버가 있는 99.9% 업타임 SLA',
    feature4Title: '개발자 친화적',
    feature4Desc: '코드 예제가 포함된 완전한 OpenAPI/Swagger 문서',
    feature5Title: 'Webhook 지원',
    feature5Desc: '비동기 처리 및 이벤트 알림을 위한 실시간 콜백',
    feature6Title: '분석 대시보드',
    feature6Desc: '사용량 모니터링, 요청 추적 및 성능 지표 분석',
    integrationTitle: '간단한 통합',
    integrationDesc: '포괄적인 문서와 JavaScript, Python, Go 등을 위한 공식 SDK로 몇 분 내에 시작하세요',
    readDocs: '문서 읽기',
    tryRapidapi: 'RapidAPI에서 시도하기',
  },
};

// Default to English for all other languages
const getTranslations = (language: string) => {
  return translations[language] || translations['en'];
};

export default function B2BApiCenter({ language }: B2BApiCenterProps) {
  const t = getTranslations(language);
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  // Load Paddle script
  useEffect(() => {
    if (!window.Paddle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set('production');
          window.Paddle.Initialize({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '' });
          setPaddleLoaded(true);
        }
      };
      document.head.appendChild(script);
    } else {
      setPaddleLoaded(true);
    }
  }, []);

  const handleSubscribe = (productId: string) => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: [{ productId, quantity: 1 }],
      });
    }
  };

  const pricingPlans = [
    {
      name: t.developerPlan,
      price: 29,
      description: t.developerDesc,
      features: [t.devFeature1, t.devFeature2, t.devFeature3, t.devFeature4],
      buttonText: t.getApiKey,
      paddleId: process.env.NEXT_PUBLIC_PADDLE_DEVELOPER_PRODUCT_ID || 'prod_dev',
      highlight: false,
    },
    {
      name: t.proPlan,
      price: 99,
      description: t.proDesc,
      features: [t.proFeature1, t.proFeature2, t.proFeature3, t.proFeature4, t.proFeature5],
      buttonText: t.subscribeNow,
      paddleId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRODUCT_ID || 'prod_pro',
      highlight: true,
      badge: t.mostPopular,
    },
    {
      name: t.enterprisePlan,
      price: 299,
      description: t.enterpriseDesc,
      features: [t.enterpriseFeature1, t.enterpriseFeature2, t.enterpriseFeature3, t.enterpriseFeature4, t.enterpriseFeature5],
      buttonText: t.contactSales,
      action: 'contact',
      highlight: false,
    },
  ];

  return (
    <div className="mt-20 w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-cyan-400 dark:text-cyan-400 light:text-cyan-600 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 border border-cyan-500/20">
            🚀 {t.badgeText}
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t.mainTitle}
          </span>
        </h2>
        <p className="text-lg text-zinc-400 dark:text-zinc-400 light:text-gray-600 max-w-3xl mx-auto">
          {t.mainDesc}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {pricingPlans.map((plan, index) => (
          <div key={index} className={`relative group transition-all duration-300 ${plan.highlight ? 'md:scale-105' : ''}`}>
            {plan.highlight && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}

            <div
              className={`relative h-full bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-gray-100/80 border rounded-xl p-8 backdrop-blur-sm transition-all duration-300 ${
                plan.highlight
                  ? 'border-cyan-500/50 dark:border-cyan-500/50 light:border-cyan-500/30 hover:border-cyan-400/70 dark:hover:border-cyan-400/70 light:hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                  : 'border-zinc-800 dark:border-zinc-800 light:border-gray-200 hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-gray-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6 pt-4">
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-cyan-400">${plan.price}</span>
                  <span className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">/month</span>
                </div>
              </div>

              <div className="mb-8 space-y-3 border-y border-zinc-700 dark:border-zinc-700 light:border-gray-300 py-6">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-zinc-300 dark:text-zinc-300 light:text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.action === 'contact' ? (
                <a
                  href="mailto:sales@ripavid.com?subject=Enterprise%20API%20Inquiry"
                  className="w-full block text-center px-6 py-3 rounded-lg border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-zinc-300 dark:text-zinc-300 light:text-gray-700 font-semibold hover:border-cyan-400/50 dark:hover:border-cyan-400/50 light:hover:border-cyan-400/40 hover:text-cyan-400 dark:hover:text-cyan-400 light:hover:text-cyan-600 transition-all"
                >
                  {plan.buttonText}
                </a>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.paddleId as string)}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                      : 'bg-zinc-800 dark:bg-zinc-800 light:bg-gray-200 text-white dark:text-white light:text-gray-900 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-gray-300'
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Features Section */}
      <div className="border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 pt-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t.featuresTitle}
            </span>
          </h3>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 max-w-2xl mx-auto">
            {t.featuresDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: t.feature1Title, desc: t.feature1Desc },
            { icon: '🔒', title: t.feature2Title, desc: t.feature2Desc },
            { icon: '🌍', title: t.feature3Title, desc: t.feature3Desc },
            { icon: '📚', title: t.feature4Title, desc: t.feature4Desc },
            { icon: '🔄', title: t.feature5Title, desc: t.feature5Desc },
            { icon: '📊', title: t.feature6Title, desc: t.feature6Desc },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-500/50 dark:hover:border-cyan-500/50 light:hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Section */}
      <div className="mt-20 bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-4">
          {t.integrationTitle}
        </h3>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-6 max-w-2xl mx-auto">
          {t.integrationDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://docs.ripavid.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 font-semibold hover:border-cyan-400/70 dark:hover:border-cyan-400/70 light:hover:border-cyan-400/50 transition-all"
          >
            {t.readDocs}
          </a>
          <a
            href="https://rapidapi.com/ripavid/api/ripavid-ultimate-video-downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-zinc-300 dark:text-zinc-300 light:text-gray-700 font-semibold hover:border-cyan-400/50 dark:hover:border-cyan-400/50 light:hover:border-cyan-400/40 hover:text-cyan-400 dark:hover:text-cyan-400 light:hover:text-cyan-600 transition-all"
          >
            {t.tryRapidapi}
          </a>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for Paddle
declare global {
  interface Window {
    Paddle?: any;
  }
}
