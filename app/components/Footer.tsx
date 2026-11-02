'use client';

import { useState, useEffect } from 'react';
import { translations } from '../locales';

interface FooterProps {
  language?: string;
}

export default function Footer({ language = 'en' }: FooterProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];
  const currentYear = new Date().getFullYear();
  const [isKorean, setIsKorean] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect user location based on browser language and timezone
    const userLanguage = navigator.language.startsWith('ko');
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul';

    // Korean if either language is Korean OR timezone is Seoul
    setIsKorean(userLanguage || userTimeZone);
  }, []);

  return (
    <footer className="mt-24 w-full border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 bg-zinc-950/50 dark:bg-zinc-950/50 light:bg-gray-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
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
            <div>
              <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">Partner Offers</h4>

              {/* Korean Users - Coupang Banners */}
              {isKorean && (
                <div className="flex flex-col gap-3">
                  <a
                    href="https://link.coupang.com/a/hQjksOpjPM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="https://ads-partners.coupang.com/banners/1039175?trackingCode=AF1892950&subId=&traceId=V0-301-5f9bd61900e673c0-I1039175&w=300&h=250"
                      alt="Coupang Partner"
                      className="w-full max-w-[200px] h-auto rounded-lg"
                    />
                  </a>
                  <a
                    href="https://link.coupang.com/a/hQj3lUdru8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="https://ads-partners.coupang.com/banners/1039178?trackingCode=AF1892950&subId=&traceId=V0-301-2f679fc6bd8f2e58-I1039178&w=300&h=250"
                      alt="Coupang Partner"
                      className="w-full max-w-[200px] h-auto rounded-lg"
                    />
                  </a>
                  <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                    이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                  </p>
                </div>
              )}

              {/* Global Users - Amazon Affiliate Links */}
              {!isKorean && (
                <div>
                  <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-3">
                    <li>
                      <a
                        href="https://www.amazon.com/dp/B08MJZYW8P?crid=1QARJTMS0MMO9&dib=eyJ2IjoiMSJ9.-Dc4zobOLzLd4FwdbSippi_jergRyUbCajjoHV0_7wR8B8ANkBuOCdmmrD9vPaajcBZh7K69ERRnHyPxK9GaZ3Iz4b0oHzlwITO0oSPvXfJhA0S3PcjZSIPmejCZadgtzrw4fmiZ5bg5UWEjY64d3SdjiE0i-SA1hD71UaiTle3p-Nws8D5GAEaRWav4QW0oajWjk5bf39BzQoJJNUj3PrY5idfdg7hoVkcixhENJJkC2zgo4LJ6vixbxWolu35pA8f13R-1mtl8Q_0H1mEHwEASOi9gkeEWSs-Jofdg2Pk.V09vmdi0JkXxO_zb59inyEDOmzTs3KQoZRlytD5vVks&dib_tag=se&keywords=Luxury&qid=1792233612&sprefix=luxury%2Caps%2C298&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cometest20-20&linkId=dc8dcb22f5d8d82959b8022b86b9efc0&language=ko_KR&gaOptInStatus=true&ref_=as_li_ss_tl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Premium Luxury Beauty
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.amazon.com/ELEMIS-Exfoliating-exfoliating-Non-abrasive-alternative/dp/B002OLQAQG?ie=UTF8&psc=1&sp_csd=d2lkZ2V0TmFtZT1zcF9taXNzaW9uX2JsZW5kZWQ%3D&pd_rd_i=B002OLQAQG&pd_rd_w=dmMEJ&content-id=amzn1.sym.1edbacb0-53ef-43a6-bfc6-8e35e82225dd%3Aamzn1.symc.c045244f-4962-49f8-9db4-239fbd8d271e&pf_rd_p=1edbacb0-53ef-43a6-bfc6-8e35e82225dd&pf_rd_r=X2NPDFBH7J9WJAM1H80T&pd_rd_wg=kGR0w&pd_rd_r=6c6847de-370c-4914-a5f2-5d203cb2fb50&linkCode=ll2&tag=cometest20-20&linkId=20fd0a916709f5b243753aac25e4c82f&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Elemis Skincare Essentials
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.amazon.com/dp/B07BMBQG73?crid=9QJLWRX5XB1N&dib=eyJ2IjoiMSJ9.0Q8DxTgNbg8l0N0wKCWp5TuS4Sp6lIPzhVNY_ZaCq2DNZ6dXhfASCP4NU_SGg-6zkWSOkTXDoWblTStI-cAn3uQhFeHROJG3V_M6hJK8fuTXrdlNKd9ViRQBCOGZtUYnPeeLfN9w8LBdXYebdBAkae7EA2H0rugOtCKHEt4hXn59UphY2uOPWFRS_xfInQs6rJ9QMyQPNovl7CvI_Q8BDNRJpMiArt6UPCXm0DY_BdfdcU9Ma9GjtRqSfX0cZHRt38SWTPS_OPslmj2mwja5eLES4LAbDEf1nJcscUPhYBs.W8oj35zPi9dVrGrWMV-1hIaiVVK8z8HfjQlAS3pXGqs&dib_tag=se&keywords=premium%2Bbeauty&qid=1792233856&sprefix=premium%2Bbeauty%2Caps%2C315&sr=8-4-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cometest20-20&linkId=9672e940eabe64615ed52b5a756de867&language=ko_KR&gaOptInStatus=true&ref_=as_li_ss_tl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Top Rated Premium Beauty
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.amazon.com/dp/B0714LK2WT?dib=eyJ2IjoiMSJ9.cgS0SaSEflk65HYkdSYnNPQgKbOaZzDEYaJJpstE2NZ2pPxNmZaEycbSlUGeRvUl_11T-iJ85ZlNpmFfUsQQxD6ZMHhIgxmFLLOM6ewuE1OBhwdHfWtlfIxc_qnUvn_CtzZxEQA8cgVNIuXFVbUvzQQImmxgMSqAakAA686qtBeH9kb92WKls9fDVHMCP0y37ihvO0NrnHXXo_aV0z-UZCVjNltMXuxElqxoO9FUzGxmFYpKBwB5_3_jup5dpKVjk-5hG0LAcZkH1PEaLcskbWYkjqPuqmRbcERmmU4PkxQ.gAObIwWlV-_fYpIq8w9cGJ9Ug7y8Y0XspR5qS4OuHZg&dib_tag=se&keywords=premium+beauty&qid=1792233929&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=cometest20-20&linkId=f11a9a03a3aa3839cdb9149be6f5916d&language=ko_KR&gaOptInStatus=true&ref_=as_li_ss_tl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Exclusive Beauty Deals
                      </a>
                    </li>
                  </ul>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
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
