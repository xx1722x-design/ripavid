'use client';

import { useState } from 'react';
import { translations } from '../locales';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  language: string;
}

export default function FaqAccordion({ language }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[language as keyof typeof translations] || translations['en'];

  const faqs: FaqItem[] = [
    {
      question: t.faq1Question,
      answer: t.faq1Answer,
    },
    {
      question: t.faq2Question,
      answer: t.faq2Answer,
    },
    {
      question: t.faq3Question,
      answer: t.faq3Answer,
    },
    {
      question: t.faq4Question,
      answer: t.faq4Answer,
    },
    {
      question: t.faq5Question,
      answer: t.faq5Answer,
    },
    {
      question: t.faq6Question,
      answer: t.faq6Answer,
    },
  ];

  return (
    <div className="mt-20 w-full max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t.faqTitle}
          </span>
        </h2>
        <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600">{t.faqDesc}</p>
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
