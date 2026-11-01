import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - RipAVid",
  description: "Privacy Policy for RipAVid content localization platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-zinc-400">Last Updated: November 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (ripavid.com) and use our Service. Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Information You Provide Directly:</strong> We collect information you voluntarily provide when you create an account, including your name, email address, payment information, and account preferences. When you use our Service, we collect the video URLs, content links, and metadata you submit for processing.
            </p>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Information Collected Automatically:</strong> We automatically collect certain information about your device and usage patterns, including IP address, browser type, operating system, pages visited, time spent on pages, and other analytics data. This information is collected through cookies, web beacons, and similar technologies.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>YouTube and API Data:</strong> When you submit YouTube URLs or other video links for processing, our Service accesses transcript data, metadata, and publicly available information associated with that content through YouTube'"'"'s APIs and similar services. This data is transmitted through Google'"'"'s infrastructure and is subject to Google'"'"'s privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              We use collected information for the following purposes:
            </p>
            <ul className="text-zinc-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>To provide, maintain, and improve our Service</li>
              <li>To process your subscription and handle payments through Paddle</li>
              <li>To communicate with you about your account, updates, and promotional offers</li>
              <li>To process video content for subtitle extraction, translation, and localization</li>
              <li>To analyze usage patterns and optimize our Service</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
              <li>To detect, prevent, and address fraud, security issues, and technical problems</li>
              <li>To provide customer support and respond to your inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Google API Usage and Data Processing</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              Our Service uses Google'"'"'s Generative AI APIs (Gemini) and YouTube Transcript APIs to process video content you submit. When you provide YouTube URLs:
            </p>
            <ul className="text-zinc-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>YouTube transcript data is retrieved through official YouTube APIs</li>
              <li>This data is temporarily processed by Google'"'"'s Generative AI services to generate translations and optimized content</li>
              <li>The data is processed according to Google'"'"'s API Terms of Service and Privacy Policy</li>
              <li>Your data may be used by Google to improve their AI models, as per their privacy terms</li>
              <li>We do not retain raw YouTube data longer than necessary to complete your request</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-3">
              You acknowledge that by using our Service with YouTube content, you agree to Google'"'"'s terms and privacy policies. Please review Google'"'"'s privacy documentation for complete information about how Google handles your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              We do not sell your personal information. However, we may share your information with:
            </p>
            <ul className="text-zinc-300 leading-relaxed space-y-2 list-disc list-inside">
              <li><strong>Service Providers:</strong> Paddle (payment processing), Google (AI processing), hosting providers, and analytics services</li>
              <li><strong>Legal Compliance:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In the event of merger, acquisition, or bankruptcy, your information may be transferred as part of that transaction</li>
              <li><strong>Your Consent:</strong> When you explicitly authorize us to share information with third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Security</h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement comprehensive security measures to protect your information, including SSL encryption, secure servers, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. You use our Service at your own risk, and we are not responsible for unauthorized access to your account due to factors beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Retention</h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain your personal information for as long as your account is active or as long as necessary to provide our Service. You may request deletion of your data at any time, subject to legal retention obligations. Account deletion will result in the removal of your profile, but some anonymized data may be retained for analytics purposes. Video content and processed data are typically deleted within 30 days of processing unless you request earlier deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights and Choices</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              Depending on your location, you may have certain rights regarding your information:
            </p>
            <ul className="text-zinc-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability in a structured format</li>
              <li>Right to withdraw consent for data processing</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-3">
              To exercise these rights, contact us at xx1722x@gmail.com. We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Third-Party Links</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our Service may contain links to third-party websites, including YouTube, Google services, and other platforms. We are not responsible for the privacy practices of these third-party sites. Please review the privacy policies of any third-party services before providing your information or submitting content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Children'"'"'s Privacy</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our Service is not intended for children under 13 years old. We do not knowingly collect information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information and terminate the child'"'"'s account immediately. Parents or guardians who believe their child has provided information to our Service should contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting to our website. Your continued use of our Service constitutes your acceptance of the updated Privacy Policy. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg mt-4">
              <p className="text-zinc-300">
                <strong>RipAVid Privacy Team</strong><br/>
                Email: <a href="mailto:xx1722x@gmail.com" className="text-cyan-400 hover:text-cyan-300">xx1722x@gmail.com</a><br/>
                Website: <a href="https://ripavid.com" className="text-cyan-400 hover:text-cyan-300">ripavid.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
