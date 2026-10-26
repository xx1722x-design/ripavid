import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - RipAVid',
  description: 'Privacy Policy for RipAVid video downloader',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">Last updated: October 26, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid ("we", "us", "our", or "Company") operates the RipAVid website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information Collection and Use</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We collect different types of information for various purposes to provide and improve our Service to you.
            </p>

            <h3 className="text-xl font-semibold text-cyan-300 mb-3">Types of Data Collected:</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, and time spent</li>
              <li><strong>Device Data:</strong> Device type, operating system, and unique identifiers</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies to track preferences and improve user experience</li>
              <li><strong>Video URLs:</strong> We do not store the URLs you submit; they are processed temporarily and discarded</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Use of Data</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mt-4">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical issues and fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Security of Data</h2>
            <p className="text-zinc-300 leading-relaxed">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Service Providers</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
            <p className="text-zinc-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from children under 18. If we become aware that we have collected personal information from a child under age 18 without verification of parental consent, we take steps to remove such information and terminate the child's account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Your Data Rights</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at support@ripavid.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Email:{' '}
              <a href="mailto:support@ripavid.com" className="text-cyan-400 hover:text-cyan-300">
                support@ripavid.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            © 2025 RipAVid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
