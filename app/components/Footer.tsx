'use client';

import { translations } from '../locales';

interface FooterProps {
  language?: string;
}

export default function Footer({ language = 'en' }: FooterProps) {
  const t = translations[language as keyof typeof translations] || translations['en'];

  return (
    <footer className="mt-24 w-full border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 bg-zinc-950/50 dark:bg-zinc-950/50 light:bg-gray-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.download}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerGuideLink}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">{t.footerLegalTitle}</h4>
            <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              <li><a href="/terms" className="hover:text-cyan-400 transition-colors">{t.footerTermsLink}</a></li>
              <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">{t.footerPrivacyLink}</a></li>
              <li><a href="/dmca" className="hover:text-cyan-400 transition-colors">{t.footerDmcaLink}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-gray-900 mb-4">{t.footerContactTitle}</h4>
            <ul className="space-y-2 text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              <li><a href="mailto:support@ripavid.com" className="hover:text-cyan-400 transition-colors">support@ripavid.com</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerBugReportLink}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{t.footerFeatureSuggestLink}</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 dark:border-zinc-800 light:border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-600">
            <p>{t.footerCopyright}</p>
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
