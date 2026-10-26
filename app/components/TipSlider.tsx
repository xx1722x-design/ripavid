'use client';

import { useState, useEffect } from 'react';

const tips = [
  "💡 팁: RipAVid는 유튜브뿐만 아니라 다양한 플랫폼의 고화질 다운로드를 지원합니다.",
  "🎬 고화질 영상을 더 선명하게 즐기려면 최신 플레이어(VLC 등) 사용을 권장합니다.",
  "🎧 감상 기어 추천: 하단 제휴 배너에서 베스트셀러를 확인해보세요!",
  "⚡ 백엔드 FFmpeg 엔진이 서버에서 원본 화질 그대로 안전하게 조립 중입니다.",
  "📱 여러 기기에서 즐길 수 있도록 각 포맷을 신중하게 선택하세요."
];

export default function TipSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % tips.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full max-w-md mx-auto my-4 p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl text-center text-gray-300 text-sm transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <p>{tips[currentIndex]}</p>
    </div>
  );
}
