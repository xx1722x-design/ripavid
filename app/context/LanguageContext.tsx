'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ko' | 'zh-CN' | 'es' | 'fr' | 'ja';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    title: '모든 영상을 쉽게',
    titleSub: 'Download Videos Instantly',
    subtitle: 'Download videos from Douyin, Xiaohongshu, YouTube and more in seconds',
    subtext: 'Fast, simple, and completely free. No sign-up required.',
    placeholder: 'Enter video URL',
    download: 'Download',
    error: 'Error',
    formats: 'formats available',
    tryAgain: 'Try Again',
    downloadTitle: 'Video Ready',
    bestQuality: 'Best',
    noFormats: 'No formats available',
  },
  ko: {
    title: '모든 영상을 쉽게',
    titleSub: '다운로드하세요',
    subtitle: '도우인, 샤오홍슈, 유튜브 등에서 몇 초 만에 영상을 다운로드하세요',
    subtext: '빠르고 간단하며 완전히 무료입니다. 가입 불필요.',
    placeholder: '영상 URL 입력',
    download: '다운로드',
    error: '오류',
    formats: '개 포맷 사용 가능',
    tryAgain: '다시 시도',
    downloadTitle: '영상 준비됨',
    bestQuality: '최고 화질',
    noFormats: '사용 가능한 포맷이 없습니다',
  },
  'zh-CN': {
    title: '轻松下载',
    titleSub: '所有视频',
    subtitle: '从抖音、小红书、YouTube 等多个平台在几秒内下载视频',
    subtext: '快速、简单、完全免费。无需注册。',
    placeholder: '输入视频 URL',
    download: '下载',
    error: '错误',
    formats: '种格式可用',
    tryAgain: '重试',
    downloadTitle: '视频已就绪',
    bestQuality: '最佳质量',
    noFormats: '没有可用的格式',
  },
  es: {
    title: 'Descarga todos los',
    titleSub: 'videos fácilmente',
    subtitle: 'Descarga videos de Douyin, Xiaohongshu, YouTube y más en segundos',
    subtext: 'Rápido, simple y completamente gratis. Sin necesidad de registro.',
    placeholder: 'Ingresa URL del video',
    download: 'Descargar',
    error: 'Error',
    formats: 'formatos disponibles',
    tryAgain: 'Intentar de nuevo',
    downloadTitle: 'Video listo',
    bestQuality: 'Mejor calidad',
    noFormats: 'No hay formatos disponibles',
  },
  fr: {
    title: 'Téléchargez facilement',
    titleSub: 'tous les vidéos',
    subtitle: 'Téléchargez des vidéos de Douyin, Xiaohongshu, YouTube et plus en quelques secondes',
    subtext: 'Rapide, simple et complètement gratuit. Aucune inscription requise.',
    placeholder: 'Entrez URL de la vidéo',
    download: 'Télécharger',
    error: 'Erreur',
    formats: 'formats disponibles',
    tryAgain: 'Réessayer',
    downloadTitle: 'Vidéo prête',
    bestQuality: 'Meilleure qualité',
    noFormats: 'Aucun format disponible',
  },
  ja: {
    title: 'すべての動画を',
    titleSub: '簡単にダウンロード',
    subtitle: 'Douyin、Xiaohongshu、YouTubeなどから数秒で動画をダウンロード',
    subtext: '高速、シンプル、完全無料。登録不要。',
    placeholder: '動画URLを入力',
    download: 'ダウンロード',
    error: 'エラー',
    formats: '形式利用可能',
    tryAgain: '再試行',
    downloadTitle: '動画準備完了',
    bestQuality: '最高品質',
    noFormats: '利用可能なフォーマットはありません',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = (localStorage.getItem('language') as Language) || 'en';
    setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
