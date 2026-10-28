'use client';

import { useState } from 'react';

interface SocialShareBarProps {
  language: string;
}

interface ShareTranslations {
  [key: string]: {
    title: string;
    subtitle: string;
    shareCount: string;
  };
}

const translations: ShareTranslations = {
  en: {
    title: 'Do you think RipAVid is helpful to you?',
    subtitle: 'Share it with your friends!',
    shareCount: 'Shares',
  },
  ko: {
    title: 'RipAVid가 도움이 되셨나요?',
    subtitle: '친구들과 공유해 주세요!',
    shareCount: '공유',
  },
  ja: {
    title: 'RipAVidがお役に立ちましたか？',
    subtitle: 'ご友人と共有してください！',
    shareCount: '共有',
  },
  es: {
    title: '¿Te parece que RipAVid es útil?',
    subtitle: '¡Comparte con tus amigos!',
    shareCount: 'Comparticiones',
  },
  fr: {
    title: 'Pensez-vous que RipAVid vous est utile?',
    subtitle: 'Partagez-le avec vos amis!',
    shareCount: 'Partages',
  },
  de: {
    title: 'Denken Sie, dass RipAVid hilfreich ist?',
    subtitle: 'Teile es mit deinen Freunden!',
    shareCount: 'Teilungen',
  },
  pt: {
    title: 'Você acha que RipAVid é útil?',
    subtitle: 'Compartilhe com seus amigos!',
    shareCount: 'Compartilhamentos',
  },
  it: {
    title: 'Pensi che RipAVid sia utile?',
    subtitle: 'Condividilo con i tuoi amici!',
    shareCount: 'Condivisioni',
  },
  'zh-CN': {
    title: '您觉得RipAVid有帮助吗？',
    subtitle: '与朋友分享吧！',
    shareCount: '分享',
  },
  'zh-TW': {
    title: '您覺得RipAVid有幫助嗎？',
    subtitle: '與朋友分享吧！',
    shareCount: '分享',
  },
};

const getTranslations = (language: string) => {
  return translations[language] || translations['en'];
};

export default function SocialShareBar({ language }: SocialShareBarProps) {
  const t = getTranslations(language);
  const [shareCount] = useState(1400); // Simulated share count
  const [copied, setCopied] = useState(false);

  const siteUrl = 'https://ripavid.com';
  const shareText = 'Check out RipAVid - A fast and easy video downloader for YouTube, TikTok, Instagram and more!';

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: '📘',
      color: 'from-blue-600 to-blue-700',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      name: 'X',
      icon: '𝕏',
      color: 'from-gray-800 to-gray-900',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Google',
      icon: '🔍',
      color: 'from-red-500 to-yellow-500',
      shareUrl: `https://www.google.com/bookmarks/mark?op=add&bkmk=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent('RipAVid')}`,
    },
    {
      name: 'Weibo',
      icon: '微',
      color: 'from-red-600 to-red-700',
      shareUrl: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'from-blue-700 to-blue-800',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    },
    {
      name: 'Reddit',
      icon: '🔴',
      color: 'from-orange-600 to-orange-700',
      shareUrl: `https://reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent('RipAVid - Video Downloader')}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'from-blue-500 to-blue-600',
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

      {/* Main container */}
      <div className="relative bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-2xl p-8 sm:p-10 backdrop-blur-sm hover:border-cyan-500/50 dark:hover:border-cyan-500/50 light:hover:border-cyan-500/30 transition-all">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-2">
            {t.title}
          </h3>
          <p className="text-lg text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-6">
            {t.subtitle}
          </p>

          {/* Share Counter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-500/20">
            <span className="text-cyan-400 font-bold">
              {(shareCount / 1000).toFixed(1)}k
            </span>
            <span className="text-zinc-300 dark:text-zinc-300 light:text-gray-700 text-sm">
              {t.shareCount}
            </span>
          </div>
        </div>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {socialPlatforms.map((platform, index) => (
            <button
              key={index}
              onClick={() => handleShare(platform.shareUrl)}
              title={`Share on ${platform.name}`}
              className="group relative p-4 rounded-full transition-all duration-300 hover:scale-110"
            >
              {/* Icon background with gradient */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md`}
              ></div>

              {/* Icon circle */}
              <div
                className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}
              >
                <span className="text-2xl">{platform.icon}</span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-gray-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {platform.name}
              </div>
            </button>
          ))}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            title="Copy Link"
            className="group relative p-4 rounded-full transition-all duration-300 hover:scale-110"
          >
            {/* Icon background with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>

            {/* Icon circle */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
              <span className="text-2xl">{copied ? '✓' : '🔗'}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-gray-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {copied ? 'Copied!' : 'Copy Link'}
            </div>
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-500">
          ✨ Help spread the word and support RipAVid • Every share makes a difference!
        </p>
      </div>
    </div>
  );
}
