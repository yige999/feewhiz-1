import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | FeeWhiz',
  description: 'Read the Terms of Service for FeeWhiz payment fee calculators.',
  openGraph: {
    title: 'Terms of Service | FeeWhiz',
    url: 'https://feewhiz.online/terms-of-service/',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 mt-2">Last updated: January 2025</p>
      </header>

      <section className="prose prose-gray max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using FeeWhiz (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          FeeWhiz provides free payment fee calculators for various payment platforms including PayPal, Stripe, Square,
          Adyen, Braintree, and Authorize.Net. The calculations are based on publicly available fee structures and are
          provided for informational purposes only.
        </p>

        <h2>3. Accuracy of Information</h2>
        <p>
          While we strive to keep our fee data accurate and up-to-date, payment processing fees may change without notice.
          Your actual fees may vary based on your account type, transaction volume, geographic location, and other factors.
          Always verify fee information directly with your payment processor.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>As a user of FeeWhiz, you agree to:</p>
        <ul>
          <li>Use the Service for lawful purposes only</li>
          <li>Not attempt to circumvent any security measures</li>
          <li>Not use automated tools to abuse the Service</li>
          <li>Not reproduce or redistribute our content without permission</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          All content on FeeWhiz, including text, graphics, logos, and software, is owned by FeeWhiz or its licensors and is
          protected by copyright laws.
        </p>

        <h2>6. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          FeeWhiz shall not be liable for any indirect, incidental, special, consequential, or punitive damages
          resulting from your use or inability to use the Service.
        </p>

        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless FeeWhiz from any claims resulting from your use of the Service or
          violation of these terms.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites. We are not responsible for the content, policies, or
          practices of these external sites.
        </p>

        <h2>10. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to the Service at any time, with or without cause and with
          or without notice.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
          FeeWhiz operates, without regard to its conflict of law provisions.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be posted on this page. Your continued
          use of the Service after changes constitutes acceptance of the new terms.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have questions about these Terms of Service, please contact us through our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
        </p>
      </section>
    </div>
  )
}
