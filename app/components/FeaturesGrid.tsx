'use client';

import { translations } from '../locales';

interface FeaturesGridProps {
  language: string;
}

export default function FeaturesGrid({ language }: FeaturesGridProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];

  const features = [
    {
      icon: '⚡',
      title: t.featureFastTitle,
      description: t.featureFastDesc,
    },
    {
      icon: '🆓',
      title: t.featureFreeTitle,
      description: t.featureFreeDesc,
    },
    {
      icon: '🔐',
      title: t.featureNoSignupTitle,
      description: t.featureNoSignupDesc,
    },
    {
      icon: '🎬',
      title: t.featureMultiPlatformTitle,
      description: t.featureMultiPlatformDesc,
    },
    {
      icon: '✨',
      title: t.featureNoWatermarkTitle,
      description: t.featureNoWatermarkDesc,
    },
    {
      icon: '📱',
      title: t.featureAllDevicesTitle,
      description: t.featureAllDevicesDesc,
    },
  ];

  return (
    <div className="mt-20 w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t.featuresTitle}
          </span>
        </h2>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">{t.featuresDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-lg p-6 backdrop-blur-sm hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-gray-300 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
