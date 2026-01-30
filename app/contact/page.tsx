import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | FeeWhiz',
  description: 'Get in touch with the FeeWhiz team for questions, feedback, or support.',
  openGraph: {
    title: 'Contact Us | FeeWhiz',
    url: 'https://feewhiz.online/contact/',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-2">Have questions or feedback? We&apos;d love to hear from you.</p>
      </header>

      <section className="bg-gray-50 -mx-4 px-4 py-8 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>

        <form
          action="mailto:contact@feewhiz.online"
          method="post"
          encType="text/plain"
          className="space-y-4"
        >
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[48px]"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Feedback">Feedback</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Data Correction">Data Correction</option>
              <option value="Partnership">Partnership Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            Open Email Client
          </button>

          <p className="text-sm text-gray-600">
            This will open your default email client with a pre-filled message. Alternatively, you can email us directly at{' '}
            <a href="mailto:contact@feewhiz.online" className="text-blue-600 hover:underline">
              contact@feewhiz.online
            </a>.
          </p>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Common Topics</h2>

        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Fee Data Corrections</h3>
            <p className="text-sm text-gray-600">
              If you believe our fee data for a specific platform is incorrect, please let us know. Include the
              platform name, transaction type, and a link to the official fee documentation.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Platform Suggestions</h3>
            <p className="text-sm text-gray-600">
              We regularly evaluate new payment platforms to add. If you have a suggestion, please contact us with
              details about the platform and why it would be valuable to our users.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Business Inquiries</h3>
            <p className="text-sm text-gray-600">
              For partnership, advertising, or other business inquiries, please contact us with details about your
              proposal.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 -mx-4 px-4 py-6 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Response Time</h2>
        <p className="text-sm text-gray-700">
          We typically respond to inquiries within 2-3 business days. For urgent matters, please ensure your subject
          line clearly indicates the urgency.
        </p>
      </section>
    </div>
  )
}
