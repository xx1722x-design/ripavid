import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - RipAVid',
  description: 'Terms of Service for RipAVid video downloader',
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-zinc-400">Last updated: October 26, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              By accessing and using RipAVid ("Service"), you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service. We reserve the right to update these terms at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on RipAVid for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              The materials on RipAVid are provided on an 'as is' basis. RipAVid makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitations</h2>
            <p className="text-zinc-300 leading-relaxed">
              In no event shall RipAVid or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RipAVid, even if RipAVid or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Accuracy of Materials</h2>
            <p className="text-zinc-300 leading-relaxed">
              The materials appearing on RipAVid could include technical, typographical, or photographic errors. RipAVid does not warrant that any of the materials on its website are accurate, complete, or current. RipAVid may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Materials and Copyright</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              The materials on RipAVid's website are protected by copyright and trademark laws. RipAVid grants you a limited license to use the Service for personal, non-commercial purposes only. You may not reproduce, modify, distribute, or transmit any content without our prior written permission.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid is not affiliated with, endorsed by, or connected to any of the platforms whose content may be downloaded through our service (YouTube, TikTok, Instagram, etc.). We do not own or claim ownership of the downloaded content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Copyright and Intellectual Property</h2>
            <p className="text-zinc-300 leading-relaxed">
              All content, features, and functionality of the Service are exclusively owned by RipAVid, its licensors, or other providers of such material and are protected by worldwide copyright, trademark, and other intellectual property laws. Users must respect all intellectual property rights and are prohibited from downloading or copying content in violation of applicable laws and the intellectual property rights of content creators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. User Responsibilities</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Ensuring you have the legal right to download content</li>
              <li>Respecting copyright, privacy, and other intellectual property rights</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Using the Service in a lawful manner and for lawful purposes only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-zinc-300 leading-relaxed">
              Under no circumstances shall RipAVid be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising out of or in connection with your use of the Service, even if advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid reserves the right to terminate your access to the Service at any time, for any reason, without notice or liability. Any provisions of these Terms that, by their nature, should survive termination, shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Modifications</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where RipAVid operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
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
