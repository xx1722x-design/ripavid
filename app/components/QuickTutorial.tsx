'use client';

export default function QuickTutorial() {
  const steps = [
    {
      number: '1️⃣',
      title: '링크 복사',
      description: 'Douyin, Xiaohongshu, YouTube 등에서 영상 링크를 복사하세요',
    },
    {
      number: '2️⃣',
      title: '붙여넣기',
      description: '위의 입력창에 링크를 붙여넣으세요',
    },
    {
      number: '3️⃣',
      title: '다운로드',
      description: '버튼을 클릭하고 몇 초 내에 다운로드 링크를 받으세요',
    },
  ];

  return (
    <div className="mt-20 w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            3단계로 시작하기
          </span>
        </h2>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">매우 간단합니다. 링크만 붙여넣으세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-cyan-500/30 dark:from-cyan-500/30 light:from-cyan-400/30 to-transparent"></div>
            )}

            <div className="bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-lg p-8 backdrop-blur-sm hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-gray-300 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="text-4xl mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-white dark:text-white light:text-gray-900 mb-3">{step.title}</h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
