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
    copied: string;
  };
}

const translations: ShareTranslations = {
  en: {
    title: 'Do you think RipAVid is helpful to you?',
    subtitle: 'Share it with your friends!',
    shareCount: 'Shares',
    copied: 'Copied!',
  },
  ko: {
    title: 'RipAVid가 도움이 되셨나요?',
    subtitle: '친구들과 공유해 주세요!',
    shareCount: '공유',
    copied: '복사됨!',
  },
  ja: {
    title: 'RipAVidがお役に立ちましたか？',
    subtitle: 'ご友人と共有してください！',
    shareCount: '共有',
    copied: 'コピーしました！',
  },
  es: {
    title: '¿Te parece que RipAVid es útil?',
    subtitle: '¡Comparte con tus amigos!',
    shareCount: 'Comparticiones',
    copied: '¡Copiado!',
  },
  fr: {
    title: 'Pensez-vous que RipAVid vous est utile?',
    subtitle: 'Partagez-le avec vos amis!',
    shareCount: 'Partages',
    copied: 'Copié!',
  },
  de: {
    title: 'Denken Sie, dass RipAVid hilfreich ist?',
    subtitle: 'Teile es mit deinen Freunden!',
    shareCount: 'Teilungen',
    copied: 'Kopiert!',
  },
  pt: {
    title: 'Você acha que RipAVid é útil?',
    subtitle: 'Compartilhe com seus amigos!',
    shareCount: 'Compartilhamentos',
    copied: 'Copiado!',
  },
  it: {
    title: 'Pensi che RipAVid sia utile?',
    subtitle: 'Condividilo con i tuoi amici!',
    shareCount: 'Condivisioni',
    copied: 'Copiato!',
  },
  'zh-CN': {
    title: '您觉得RipAVid有帮助吗？',
    subtitle: '与朋友分享吧！',
    shareCount: '分享',
    copied: '已复制！',
  },
  'zh-TW': {
    title: '您覺得RipAVid有幫助嗎？',
    subtitle: '與朋友分享吧！',
    shareCount: '分享',
    copied: '已複製！',
  },
};

const getTranslations = (language: string) => {
  return translations[language] || translations['en'];
};

// SVG Icon Components
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M23.953 4.57a10 10 0 002.856-3.515 10 10 0 01-2.836.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.385 4.859-7.181 4.859-3.796 0-7.182-2.165-7.182-4.859a3.5 3.5 0 0 1 .476-1.565 1.735 1.735 0 0 0-.92-3.058c-.77 0-1.396.608-1.396 1.378 0 .464.173.91.493 1.244C3.334 10.966 2.925 10.14 2.925 9.209c0-2.694 3.385-4.859 7.181-4.859.29 0 .58.015.868.044-1.468-.778-2.427-2.122-2.427-3.689C7.747 5.348 9.213 4.53 10.88 4.744z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a11.955 11.955 0 0 0-.064 0zm4.962 7.224c.1-.002.321.023.465.14a1.052 1.052 0 0 1 .171 1.657l-2.928 2.868c-.956.659-.578.088-.578 1.974v2.757h-.001a1.052 1.052 0 0 1-2.1 0v-5.694a1.052 1.052 0 0 1 .882-1.044l5.289-.942a1.048 1.048 0 0 1 .9.164zm4.354 5.528h-3.154a.5.5 0 0 0-.504.51v2.558H9.309v-2.558a.5.5 0 0 0-.504-.51H5.65a.5.5 0 0 0-.504.51v5.3a.5.5 0 0 0 .504.51h3.154a.5.5 0 0 0 .504-.51v-2.558h3.293v2.558a.5.5 0 0 0 .504.51h3.154a.5.5 0 0 0 .504-.51v-5.3a.5.5 0 0 0-.504-.51z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const WeiboIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M9.375 7.5c-.75 0-1.5.375-1.875.9-.375.6-.375 1.35 0 2.025.375.6.975.975 1.875.975.75 0 1.5-.375 1.875-.975.3-.6.3-1.425-.075-2.025-.375-.525-1.125-.9-1.8-.9zm4.5 2.25c-.675 0-1.35.225-1.725.825-.3.525-.3 1.425 0 2.025.375.525.975.75 1.725.75s1.425-.225 1.8-.75c.225-.6.225-1.5 0-2.025-.375-.6-.975-.825-1.8-.825zM12 2C6.525 2 2 6.525 2 12s4.525 10 10 10 10-4.525 10-10S17.475 2 12 2zm4.725 13.35c-1.275 1.8-3.525 2.775-5.925 2.775-2.325 0-4.575-.9-5.85-2.625-1.35-1.8-1.725-4.05-1.05-6.225.675-2.1 2.4-3.675 4.425-4.05 2.1-.375 4.2.3 5.475 1.725 1.275 1.425 1.725 3.375 1.275 5.175-.375 1.575-1.35 2.775-2.35 3.225zm-2.85-8.625c-.6 0-1.125.525-1.125 1.125s.525 1.125 1.125 1.125 1.125-.525 1.125-1.125-.525-1.125-1.125-1.125z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

export default function SocialShareBar({ language }: SocialShareBarProps) {
  const t = getTranslations(language);
  const [shareCount] = useState(1400);
  const [copied, setCopied] = useState(false);

  const siteUrl = 'https://ripavid.com';
  const shareText = 'Check out RipAVid - A fast and easy video downloader for YouTube, TikTok, Instagram and more!';

  const socialPlatforms = [
    {
      name: 'Facebook',
      Icon: FacebookIcon,
      bgColor: 'from-blue-600 to-blue-500',
      hoverColor: 'group-hover:from-blue-500 group-hover:to-blue-400',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      name: 'X',
      Icon: TwitterIcon,
      bgColor: 'from-gray-700 to-gray-800',
      hoverColor: 'group-hover:from-gray-600 group-hover:to-gray-700',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      Icon: LinkedinIcon,
      bgColor: 'from-blue-700 to-blue-600',
      hoverColor: 'group-hover:from-blue-600 group-hover:to-blue-500',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    },
    {
      name: 'Reddit',
      Icon: RedditIcon,
      bgColor: 'from-orange-600 to-orange-500',
      hoverColor: 'group-hover:from-orange-500 group-hover:to-orange-400',
      shareUrl: `https://reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent('RipAVid - Video Downloader')}`,
    },
    {
      name: 'Telegram',
      Icon: TelegramIcon,
      bgColor: 'from-blue-500 to-blue-600',
      hoverColor: 'group-hover:from-blue-400 group-hover:to-blue-500',
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Google',
      Icon: GoogleIcon,
      bgColor: 'from-red-500 to-yellow-500',
      hoverColor: 'group-hover:from-red-400 group-hover:to-yellow-400',
      shareUrl: `https://www.google.com/bookmarks/mark?op=add&bkmk=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent('RipAVid')}`,
    },
    {
      name: 'Weibo',
      Icon: WeiboIcon,
      bgColor: 'from-red-600 to-red-500',
      hoverColor: 'group-hover:from-red-500 group-hover:to-red-400',
      shareUrl: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(shareText)}`,
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
    <div className="w-full max-w-5xl mx-auto my-16 px-4">
      <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 dark:from-zinc-900/50 dark:to-zinc-900/30 light:from-gray-100/50 light:to-gray-100/30 border border-zinc-800/50 dark:border-zinc-800/50 light:border-gray-200/50 rounded-2xl p-8 sm:p-10 backdrop-blur-md hover:border-cyan-500/30 dark:hover:border-cyan-500/30 light:hover:border-cyan-500/20 transition-all">
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-zinc-100 to-white dark:from-white dark:via-zinc-100 dark:to-white light:from-gray-900 light:via-gray-800 light:to-gray-900 bg-clip-text text-transparent mb-2">
              {t.title}
            </h3>
            <p className="text-lg text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-6">
              {t.subtitle}
            </p>

            {/* Share Counter Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-500/20">
              <span className="text-cyan-400 font-bold text-lg">
                {(shareCount / 1000).toFixed(1)}k
              </span>
              <span className="text-zinc-300 dark:text-zinc-300 light:text-gray-700 text-sm font-medium">
                {t.shareCount}
              </span>
            </div>
          </div>

          {/* Social Icons - Fixed Horizontal Layout */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mb-8">
            {/* Share buttons */}
            {socialPlatforms.map((platform, index) => (
              <button
                key={index}
                onClick={() => handleShare(platform.shareUrl)}
                title={`Share on ${platform.name}`}
                className="group relative flex-shrink-0"
              >
                {/* Icon container with gradient background */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${platform.bgColor} ${platform.hoverColor} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 text-white">
                    <platform.Icon />
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-gray-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {platform.name}
                </div>
              </button>
            ))}

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="group relative flex-shrink-0"
            >
              {/* Icon container with gradient background */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 text-white transition-all duration-300 ${copied ? 'scale-110' : ''}`}>
                  <CopyIcon />
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-gray-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {copied ? t.copied : 'Copy Link'}
              </div>
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-500 font-medium">
            ✨ Help spread the word and support RipAVid • Every share makes a difference!
          </p>
        </div>
      </div>
    </div>
  );
}
