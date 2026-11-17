'use client';

import { useState, useEffect } from 'react';
import { translations } from '../locales';
import { getRandomAmazonLinks } from '../constants/amazonAffiliateLinks';

interface FooterProps {
  language?: string;
}

export default function Footer({ language = 'en' }: FooterProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];
  const currentYear = new Date().getFullYear();
  const [isKorean, setIsKorean] = useState<boolean | null>(null);
  const [randomLinks, setRandomLinks] = useState<string[]>([]);

  useEffect(() => {
    // Detect user location based on browser language and timezone
    const userLanguage = navigator.language.startsWith('ko');
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul';

    // Korean if either language is Korean OR timezone is Seoul
    const isKoreanUser = userLanguage || userTimeZone;
    setIsKorean(isKoreanUser);

    // Get random Amazon links for non-Korean users
    if (!isKoreanUser) {
      setRandomLinks(getRandomAmazonLinks(4));
    }
  }, []);

  return (
    <footer className="mt-24 w-full border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 bg-zinc-950/50 dark:bg-zinc-950/50 light:bg-gray-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-[env(safe-area-inset-bottom)]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
                ⚡
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                RipAVid
              </span>
            </div>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 text-sm">{t.footerTagline}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">{t.footerProductsTitle}</h4>
            <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerFeaturesLink}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.import}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerGuideLink}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">{t.footerLegalTitle}</h4>
            <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              <li><a href="/terms" className="hover:text-cyan-400 transition-colors">{t.footerTermsLink}</a></li>
              <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">{t.footerPrivacyLink}</a></li>
              <li><a href="/refund" className="hover:text-cyan-400 transition-colors">Refund Policy</a></li>
              <li><a href="/dmca" className="hover:text-cyan-400 transition-colors">{t.footerDmcaLink}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">{t.footerContactTitle}</h4>
            <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              <li><a href="mailto:support@ripavid.com" className="hover:text-cyan-400 transition-colors">support@ripavid.com</a></li>
              <li><a href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerFeatureSuggestLink}</a></li>
            </ul>
          </div>

          {/* Partner Offers - Korean & Global Affiliate Links */}
          {isKorean !== null && (
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">Partner Offers</h4>

              {/* Korean Users - Coupang Banners */}
              {isKorean && (
                <div className="flex flex-col gap-4">
                  <a
                    href="https://link.coupang.com/a/hQjksOpjPM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block transition-all duration-300"
                  >
                    <img
                      src="https://ads-partners.coupang.com/banners/1039175?trackingCode=AF1892950&subId=&traceId=V0-301-5f9bd61900e673c0-I1039175&w=300&h=250"
                      alt="Coupang Partner"
                      className="w-full max-w-[300px] h-auto rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/30"
                    />
                  </a>
                  <a
                    href="https://link.coupang.com/a/hQj3lUdru8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block transition-all duration-300"
                  >
                    <img
                      src="https://ads-partners.coupang.com/banners/1039178?trackingCode=AF1892950&subId=&traceId=V0-301-2f679fc6bd8f2e58-I1039178&w=300&h=250"
                      alt="Coupang Partner"
                      className="w-full max-w-[300px] h-auto rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/30"
                    />
                  </a>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-medium">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                  </p>
                </div>
              )}

              {/* Global Users - Random Amazon Affiliate Links */}
              {!isKorean && randomLinks.length > 0 && (
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
                    {randomLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="hover:text-emerald-400 hover:font-semibold transition-all duration-200"
                        >
                          ✨ Recommended Product {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium mt-3">
                    As an Amazon Associate, we earn from qualifying purchases.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-600">
            <p>© {currentYear} RipAVid. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
