import Link from 'next/link';

export const metadata = {
  title: 'DMCA - RipAVid',
  description: 'DMCA information for RipAVid video downloader',
};

export default function DMCAPage() {
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
            DMCA Notice & Copyright Policy
          </h1>
          <p className="text-zinc-400">Last updated: October 26, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Copyright Notice</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid respects the intellectual property rights of others and expects users to do the same. RipAVid is a tool for downloading and saving content from various platforms. All content downloaded through RipAVid remains the intellectual property of the original content creators and copyright holders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Digital Millennium Copyright Act (DMCA)</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid complies with the Digital Millennium Copyright Act of 1998 (DMCA). If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information:
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Notification of Infringement</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              To file a copyright infringement claim, please provide our Copyright Agent with the following written information:
            </p>
            <ul className="list-disc list-inside space-y-3 text-zinc-300">
              <li>
                <strong>Identification:</strong> Your name, address, telephone number, and email address
              </li>
              <li>
                <strong>Description:</strong> A detailed description of the copyrighted work that you claim has been infringed
              </li>
              <li>
                <strong>Location:</strong> A description of where the infringing material is located (URL and specific content)
              </li>
              <li>
                <strong>Statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner
              </li>
              <li>
                <strong>Attestation:</strong> A statement, under penalty of perjury, that the information provided is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner
              </li>
              <li>
                <strong>Signature:</strong> Your physical or electronic signature
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Filing a DMCA Notice</h2>
            <p className="text-zinc-300 leading-relaxed">
              Please send your DMCA notice to our designated Copyright Agent:
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 mt-4 mb-4">
              <p className="text-zinc-300 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:copyright@ripavid.com" className="text-cyan-400 hover:text-cyan-300">
                  copyright@ripavid.com
                </a>
              </p>
              <p className="text-zinc-300 mb-2">
                <strong>Subject Line:</strong> DMCA Copyright Notice
              </p>
              <p className="text-zinc-300">
                <strong>Response Time:</strong> We will respond within 10 business days of receiving your notice
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Counter-Notification</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              If you believe that a DMCA notice has been wrongfully filed against material you have uploaded, you may submit a counter-notification. Your counter-notification must include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Your name, address, telephone number, and email address</li>
              <li>Identification of the material that was removed</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed in error</li>
              <li>A statement that you consent to the jurisdiction of the federal court</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User Responsibility</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Users of RipAVid are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Ensuring they have the legal right to download content</li>
              <li>Respecting the copyright and intellectual property rights of content creators</li>
              <li>Complying with all applicable laws and regulations regarding copyright</li>
              <li>Not using RipAVid to infringe upon the copyright of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Repeat Infringement Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid takes copyright infringement seriously. Users who repeatedly violate copyright laws may have their access to the Service terminated. We will investigate all claims of copyright infringement and take appropriate action as determined by RipAVid in its sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Permitted Use</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              RipAVid is designed to download content for personal, non-commercial purposes. Permitted uses may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">
              <li>Downloading content you own or have permission to download</li>
              <li>Creating personal backups of content you have created</li>
              <li>Downloading content for educational purposes in certain circumstances</li>
              <li>Downloading public domain content</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              Any use that violates copyright law or the terms of service of the original content platform is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Compliance</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid is not affiliated with, endorsed by, or connected to YouTube, TikTok, Instagram, or any other content platform. RipAVid does not host, store, or distribute copyrighted content. We provide a tool for downloading content, and users are solely responsible for how they use downloaded content and whether such use complies with applicable copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              For copyright-related inquiries or DMCA notices:
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Email:{' '}
              <a href="mailto:copyright@ripavid.com" className="text-cyan-400 hover:text-cyan-300">
                copyright@ripavid.com
              </a>
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              For other inquiries:
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Email:{' '}
              <a href="mailto:support@ripavid.com" className="text-cyan-400 hover:text-cyan-300">
                support@ripavid.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Disclaimer</h2>
            <p className="text-zinc-300 leading-relaxed">
              While RipAVid makes reasonable efforts to comply with DMCA requirements and respect copyright laws, we make no warranties regarding the legality of content downloaded through our Service. Users download content at their own risk and are solely responsible for ensuring their use complies with all applicable laws.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            © 2026 RipAVid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
