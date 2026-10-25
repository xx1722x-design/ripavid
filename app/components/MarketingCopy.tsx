'use client';

import { useState } from 'react';

interface MarketingCopyProps {
  language: string;
}

const marketingContent: { [key: string]: { description: string; shareText: string } } = {
  en: {
    description:
      'RipAVid is a high-speed media download platform supporting 21+ global languages including English, Spanish, Chinese, Japanese, and Korean. Download videos, photos, and audio from leading platforms like YouTube, TikTok, Instagram, Xiaohongshu and more in HD quality without watermarks—forever free and easy to use.',
    shareText: '🔥 RipAVid has been incredibly helpful! Share this powerful tool with your friends!',
  },
  ko: {
    description:
      'RipAVid는 영어, 스페인어, 중국어, 일본어, 한국어 등 21개 이상의 글로벌 언어를 지원하는 초고속 미디어 다운로드 플랫폼입니다. YouTube, TikTok, 인스타그램, 샤오홍슈 등 전 세계 주요 플랫폼의 동영상, 사진, 오디오를 워터마크 없이 HD 화질로 평생 무료로 저장하세요.',
    shareText: '🔥 RipAVid가 정말 도움이 되었어요! 친구들에게 이 강력한 도구를 공유해 주세요!',
  },
  'zh-CN': {
    description:
      'RipAVid是一个支持21种以上全球语言（包括英文、西班牙文、中文、日文和韩文）的超高速媒体下载平台。从YouTube、TikTok、Instagram、小红书等全球主要平台下载视频、照片和音频，享受高清无水印的永久免费服务。',
    shareText: '🔥 RipAVid真的帮了大忙！请与朋友分享这个强大工具！',
  },
  es: {
    description:
      'RipAVid es una plataforma de descarga de medios de alta velocidad que admite más de 21 idiomas globales, incluyendo inglés, español, chino, japonés y coreano. Descarga videos, fotos y audio de plataformas líderes como YouTube, TikTok, Instagram y Xiaohongshu en calidad HD sin marcas de agua, de forma gratuita y sencilla.',
    shareText: '🔥 ¡RipAVid ha sido increíblemente útil! ¡Comparte esta herramienta poderosa con tus amigos!',
  },
  fr: {
    description:
      'RipAVid est une plateforme de téléchargement de médias ultra-rapide prenant en charge plus de 21 langues mondiales, y compris l\'anglais, l\'espagnol, le chinois, le japonais et le coréen. Téléchargez des vidéos, des photos et de l\'audio depuis les principales plateformes comme YouTube, TikTok, Instagram et Xiaohongshu en qualité HD sans filigrane, gratuitement et facilement.',
    shareText: '🔥 RipAVid a été incroyablement utile ! Partagez cet outil puissant avec vos amis !',
  },
  ja: {
    description:
      'RipAVidは、英語、スペイン語、中国語、日本語、韓国語など21以上のグローバル言語をサポートする超高速メディアダウンロードプラットフォームです。YouTube、TikTok、Instagram、小紅書などの主要プラットフォームから、ウォーターマークなしのHD品質でビデオ、写真、オーディオを永遠に無料でダウンロードできます。',
    shareText: '🔥 RipAVidは本当に役に立ちました！この強力なツールを友人と共有してください！',
  },
};

export default function MarketingCopy({ language }: MarketingCopyProps) {
  const [copied, setCopied] = useState(false);
  const content = marketingContent[language] || marketingContent['en'];

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://ripavid.com';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://ripavid.com';
    const text = encodeURIComponent(content.shareText);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-16 mb-12">
      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 dark:from-zinc-800/50 dark:to-zinc-900/50 light:from-gray-100 light:to-gray-50 rounded-xl border border-zinc-700 dark:border-zinc-700 light:border-gray-300 p-8">
        <p className="text-sm md:text-base leading-relaxed text-zinc-300 dark:text-zinc-300 light:text-gray-700 mb-8">
          {content.description}
        </p>

        <div className="border-t border-zinc-700 dark:border-zinc-700 light:border-gray-300 pt-6">
          <p className="text-lg font-semibold text-zinc-200 dark:text-zinc-200 light:text-gray-900 mb-4">
            {content.shareText}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => handleShare('facebook')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium"
              title="Share on Facebook"
            >
              <span>f</span>
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors text-sm font-medium"
              title="Share on Twitter/X"
            >
              <span>𝕏</span>
              Twitter
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors text-sm font-medium"
              title="Share on WhatsApp"
            >
              <span>💬</span>
              WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-700 dark:bg-zinc-700 light:bg-gray-300 hover:bg-zinc-600 dark:hover:bg-zinc-600 light:hover:bg-gray-400 text-white dark:text-white light:text-gray-900'
              }`}
              title="Copy link to clipboard"
            >
              <span>{copied ? '✓' : '🔗'}</span>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
