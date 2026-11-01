import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - RipAVid",
  description: "Refund Policy for RipAVid subscriptions and services",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Refund & Cancellation Policy</h1>
          <p className="text-zinc-400">Last Updated: November 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Refund Eligibility</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>14-Day Money-Back Guarantee:</strong> We offer a full refund for all subscription payments within 14 days of the initial purchase. This applies to new subscriptions and plan upgrades. To qualify for this guarantee, you must request a refund within 14 calendar days from your purchase date.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Refund Eligibility Conditions:</strong> Refunds are available if you have not extracted a significant amount of content or used substantially more of the Service'"'"'s features beyond a reasonable trial period. If you have heavily utilized the Service'"'"'s core functionality (such as extracting extensive subtitle data, performing numerous translations, or processing excessive content), your refund request may be subject to review and may be declined at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How to Request a Refund</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              To request a refund, please contact us at:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg mb-3">
              <p className="text-zinc-300">
                <strong>RipAVid Support Team</strong><br/>
                Email: <a href="mailto:xx1722x@gmail.com" className="text-cyan-400 hover:text-cyan-300">xx1722x@gmail.com</a>
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Include the following information in your refund request: (1) your account email address, (2) the order ID or date of purchase, (3) your reason for requesting a refund, and (4) the name and last four digits of the payment method used. We will process your request within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Refund Processing</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Processing Time:</strong> Once your refund request is approved, the refund will be processed to your original payment method within 5-10 business days. Depending on your financial institution, it may take an additional 3-5 business days for the credit to appear on your account. Please note that your bank or payment provider may process refunds with a delay.
            </p>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Refund Amount:</strong> Refunds are issued for the full subscription price paid. This includes monthly and annual subscriptions. If you paid through Paddle, refunds are coordinated through their system and subject to their processing timelines.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Declined Refund Requests:</strong> If your refund request is declined, we will provide an explanation via email. You may appeal a declined refund decision by providing additional information about your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Subscription Cancellation</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Cancel Anytime:</strong> You can cancel your subscription at any time through your account dashboard or by contacting our support team. No questions asked—we do not require explanations or justifications for cancellations.
            </p>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>How to Cancel:</strong> To cancel your subscription, you can:
            </p>
            <ul className="text-zinc-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>Log into your RipAVid account and access your subscription settings</li>
              <li>Click the "Cancel Subscription" button in your billing section</li>
              <li>Email us at xx1722x@gmail.com requesting cancellation</li>
              <li>The cancellation will be effective immediately or at the end of your current billing period, depending on your preference</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Auto-Renewal and Billing</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Automatic Renewal:</strong> Your subscription will automatically renew at the end of each billing period (monthly or annual) unless you cancel in advance. You will be charged the renewal fee using your original payment method.
            </p>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Billing Reminders:</strong> We will send you a reminder email at least 7 days before your renewal date. This email will include your subscription details, the renewal amount, and instructions for cancellation if you wish to opt out.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Failed Payments:</strong> If a payment fails, we will attempt to charge your payment method up to 3 times over a 7-day period. If all attempts fail, your subscription will be suspended until payment is successful or your subscription is cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Mid-Cycle Cancellation</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>No Prorated Refunds:</strong> If you cancel your subscription during a billing cycle, we do not offer prorated refunds for the remaining days of your subscription. Your access to the Service will continue until the end of your current billing period.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Immediate vs. End-of-Cycle Cancellation:</strong> You can choose to cancel immediately (losing access to paid features at once) or at the end of your current billing period (maintaining access until the end of your subscription term). Your choice will be reflected in your account cancellation confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Account Data After Cancellation</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Data Retention:</strong> After you cancel your subscription, your account data, including content you imported and processed, will be retained for 90 days. During this grace period, you can reactivate your subscription without losing your data.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Data Deletion:</strong> After 90 days of cancellation, your account and all associated data will be permanently deleted from our servers. This deletion is irreversible. If you wish to preserve your data, please export or backup your information before cancelling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Plan Changes and Downgrades</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Upgrading Your Plan:</strong> If you upgrade to a higher-tier plan, you will be charged the prorated difference for the remainder of your current billing cycle, and the new plan will be charged in full at your next renewal date.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Downgrading Your Plan:</strong> If you downgrade to a lower-tier plan, the change will take effect at the end of your current billing period. You will not receive a refund for the difference; instead, you will be charged the lower amount at your next renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Special Circumstances</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Service Suspension:</strong> If we suspend your account due to violation of our Terms of Service, refunds will not be issued. However, we may issue a partial refund at our discretion depending on the severity of the violation and the length of time your subscription remains active.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Service Unavailability:</strong> If our Service is unavailable due to technical issues or maintenance for an extended period (more than 48 hours), you may be eligible for a prorated refund or service credit. Contact us to discuss your situation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">10. No Refunds After 14 Days</h2>
            <p className="text-zinc-300 leading-relaxed">
              After 14 days from your purchase date, your subscription is non-refundable unless specifically agreed upon by RipAVid. However, you retain the right to cancel your subscription at any time to stop future charges. The 14-day refund window applies only to new subscriptions and plan upgrades, not to renewals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Exceptions and Disputes</h2>
            <p className="text-zinc-300 leading-relaxed mb-3">
              <strong>Payment Processor Disputes:</strong> If you dispute a charge with your payment provider (credit card company, PayPal, etc.) or file a chargeback, your RipAVid account will be suspended immediately. We reserve the right to pursue recovery of the disputed amount and associated fees.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong>Appeal Process:</strong> If you believe your refund request was unfairly declined, you may appeal our decision within 30 days by contacting our support team with additional information and context. We will review appeals on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have questions about our Refund & Cancellation Policy or need to request a refund, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg mt-4">
              <p className="text-zinc-300">
                <strong>RipAVid Support Team</strong><br/>
                Email: <a href="mailto:xx1722x@gmail.com" className="text-cyan-400 hover:text-cyan-300">xx1722x@gmail.com</a><br/>
                Website: <a href="https://ripavid.com" className="text-cyan-400 hover:text-cyan-300">ripavid.com</a><br/>
                Response Time: Within 24-48 business hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
