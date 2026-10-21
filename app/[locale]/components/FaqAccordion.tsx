'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'RipAVid는 정말 무료인가요?',
      answer: '네, 완전히 무료입니다. 숨겨진 비용이나 프리미엄 구독은 없습니다. 우리의 목표는 모든 사용자가 쉽게 영상을 다운로드하도록 돕는 것입니다.',
    },
    {
      question: '어떤 영상 플랫폼을 지원하나요?',
      answer: 'Douyin(抖音), Xiaohongshu(小红书), YouTube, Instagram 등 주요 소셜 미디어 플랫폼을 지원합니다. 더 많은 플랫폼 지원을 계속 추가하고 있습니다.',
    },
    {
      question: '다운로드한 영상에 워터마크가 있나요?',
      answer: '아니오, 절대 아닙니다. RipAVid는 워터마크 없이 깨끗한 영상을 제공합니다.',
    },
    {
      question: '다운로드가 얼마나 걸리나요?',
      answer: '대부분의 영상은 3-10초 내에 처리됩니다. 영상의 길이와 품질에 따라 달라질 수 있습니다.',
    },
    {
      question: '가입이 필요한가요?',
      answer: '아니오, 가입이 전혀 필요하지 않습니다. 바로 링크를 붙여넣고 다운로드하세요.',
    },
    {
      question: '다운로드 제한이 있나요?',
      answer: '아니오, 제한이 없습니다. 원하는 만큼 많은 영상을 다운로드할 수 있습니다.',
    },
  ];

  return (
    <div className="mt-20 w-full max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            자주 묻는 질문
          </span>
        </h2>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">궁금한 점이 있으신가요? 여기서 답변을 찾아보세요.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-gray-100/50 border border-zinc-800 dark:border-zinc-800 light:border-gray-200 rounded-lg backdrop-blur-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 light:hover:bg-gray-200/30 transition-colors"
            >
              <span className="font-semibold text-white dark:text-white light:text-gray-900 text-left">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-zinc-800/30 dark:bg-zinc-800/30 light:bg-gray-200/20 border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 text-zinc-300 dark:text-zinc-300 light:text-gray-700 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
