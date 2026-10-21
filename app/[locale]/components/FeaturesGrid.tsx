'use client';

export default function FeaturesGrid() {
  const features = [
    {
      icon: '⚡',
      title: '번개 같은 속도',
      description: '초 단위로 영상을 다운로드하세요',
    },
    {
      icon: '🆓',
      title: '완전히 무료',
      description: '숨겨진 비용 없음, 프리미엄 계획 없음',
    },
    {
      icon: '🔐',
      title: '가입 불필요',
      description: '즉시 다운로드 시작하세요',
    },
    {
      icon: '🎬',
      title: '다중 플랫폼',
      description: 'Douyin, Xiaohongshu, YouTube 등 지원',
    },
    {
      icon: '✨',
      title: '워터마크 없음',
      description: '깨끗한 영상을 받으세요',
    },
    {
      icon: '📱',
      title: '모든 기기 지원',
      description: 'PC, 모바일, 태블릿에서 사용 가능',
    },
  ];

  return (
    <div className="mt-20 w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            왜 RipAVid를 선택할까?
          </span>
        </h2>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">다른 다운로더와 달리, 우리는 간단함과 속도를 우선시합니다.</p>
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
