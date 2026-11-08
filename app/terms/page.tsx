import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - RipAVid",
  description: "Terms of Service for RipAVid video download platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-zinc-400">Last Updated: November 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              Welcome to RipAVid ("Company," "we," "us," "our," or "Service"). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and RipAVid regarding the use of our website, platform, and services located at ripavid.com and all related sites, applications, and services. By accessing, browsing, or using our Service in any manner, you acknowledge that you have read, understood, and agree to be bound by all the provisions of these Terms. If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid is a Software-as-a-Service (SaaS) platform that utilizes artificial intelligence, including Google'"'"'s Generative AI APIs and YouTube Transcript APIs, to provide video download and repurposing services. Our Service enables users to import video content from multiple platforms, extract subtitles, generate translations, and optimize content for global distribution. The Service includes both free and paid subscription tiers with varying levels of functionality and feature access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts and Registration</h2>
            <p className="text-zinc-300 leading-relaxed">
              To access certain features of our Service, you may be required to create an account. You agree to provide accurate, complete, and current information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and password. You accept full responsibility for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any breach of security. RipAVid will not be liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Subscription and Billing</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Subscription Plans:</strong> Our Service is available on a subscription basis. We offer different subscription tiers with varying features and pricing. Your subscription will commence on the date of purchase and will continue for the selected billing period (monthly or annual).
            </p>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Payment:</strong> You authorize us to charge your payment method on a recurring basis according to your selected subscription period. All payments are processed through Paddle, our authorized payment processor. You represent and warrant that you are authorized to use the payment method provided and that any information you supply is accurate and complete.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Auto-Renewal:</strong> Your subscription will automatically renew at the end of each billing period unless you cancel in advance. You acknowledge that the amount charged will remain the same unless you are notified of a price change. See our Refund Policy for cancellation details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Acceptable Use Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers or networks. Prohibited uses include, but are not limited to: (a) uploading content that violates intellectual property rights or contains malware; (b) attempting to gain unauthorized access to the Service; (c) using the Service to harass, threaten, or defame others; (d) reverse engineering or attempting to derive the source code of the Service; (e) using the Service to process content without proper rights or licenses; and (f) automated scraping or data mining without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property Rights</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              The Service, including all content, features, and functionality, is owned by RipAVid, our licensors, or other providers of such content. This content is protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal or business purposes, subject to these Terms.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              You retain all rights to content you upload or create. However, by using our Service, you grant RipAVid a worldwide, royalty-free license to process, display, and improve your content solely for the purpose of providing the Service. You are responsible for ensuring you have the right to upload and process any content through our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIPAVID SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOST PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES. Our total liability to you for any claims arising from or relating to these Terms or the Service shall not exceed the amount you paid to us in the twelve months preceding the claim, or fifty dollars ($50), whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Indemnification</h2>
            <p className="text-zinc-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless RipAVid and our officers, directors, employees, and agents from and against any claims, damages, losses, costs, and expenses, including reasonable attorneys'"'"' fees, arising from or related to: (a) your use of the Service; (b) any content you upload or process; (c) your violation of these Terms; or (d) any infringement of third-party intellectual property rights by content you provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Termination</h2>
            <p className="text-zinc-300 leading-relaxed">
              We reserve the right to terminate or suspend your account and access to the Service, in our sole discretion and without notice or liability, for any reason, including if we believe you have violated these Terms. Upon termination, your right to use the Service ceases immediately. Your data may be deleted after a reasonable retention period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Modifications to Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              RipAVid reserves the right to modify these Terms at any time. Material changes will be communicated to you via email or prominent notice on the Service. Your continued use of the Service following such modifications constitutes your acceptance of the updated Terms. If you do not agree with modifications, you may terminate your subscription.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Disclaimer of Warranties</h2>
            <p className="text-zinc-300 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. RIPAVID DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which RipAVid operates, without regard to its conflicts of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg mt-4">
              <p className="text-zinc-300">
                <strong>RipAVid</strong><br/>
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
