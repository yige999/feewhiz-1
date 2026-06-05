import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | FeeWhiz',
  description: 'Learn how FeeWhiz collects, uses, and protects your data. We use cookies for analytics and advertising.',
  openGraph: {
    title: 'Privacy Policy | FeeWhiz',
    url: 'https://feewhiz.online/privacy-policy/',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">Last updated: January 2025</p>
      </header>

      <section className="prose prose-gray max-w-none">
        <p>
          FeeWhiz (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting
          your personal data. This privacy policy explains how we collect, use, and safeguard your information when you
          use our website.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Automatically Collected Information</h3>
        <p>
          When you visit FeeWhiz, we may automatically collect certain information about your device and browsing activity,
          including:
        </p>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring website</li>
          <li>Pages viewed and time spent on pages</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Operate, maintain, and improve our website</li>
          <li>Analyze usage patterns and trends</li>
          <li>Display relevant advertisements</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Cookies and Tracking Technologies</h2>
        <h3>Google AdSense</h3>
        <p>
          FeeWhiz uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior
          visits to our website or other websites. You can opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Google Ads Settings
          </a>.
        </p>

        <h3>Cloudflare Web Analytics</h3>
        <p>
          We use Cloudflare Web Analytics to understand how visitors use our website. This service helps us see which
          pages are popular, how long visitors stay on pages, and where they might encounter issues. Cloudflare does not
          use cookies and does not collect personal information.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>FeeWhiz may use third-party services that have their own privacy policies:</p>
        <ul>
          <li><strong>Google AdSense:</strong> For displaying advertisements</li>
          <li><strong>Cloudflare:</strong> For web analytics and content delivery</li>
        </ul>

        <h2>5. Data Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share information with:
        </p>
        <ul>
          <li>Service providers who assist in operating our website</li>
          <li>Legal authorities when required by law</li>
          <li>Third parties in connection with a business transfer or merger</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal data. However, no method of transmission
          over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          FeeWhiz is not intended for children under 13. We do not knowingly collect personal information from children
          under 13.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate
          safeguards are in place to protect your data.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy
          on this page.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please contact us through our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
        </p>
      </section>
    </div>
  )
}
