import Link from 'next/link'

const platforms = [
  { id: 'paypal', name: 'PayPal' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'square', name: 'Square' },
  { id: 'adyen', name: 'Adyen' },
  { id: 'braintree', name: 'Braintree' },
  { id: 'authorize-net', name: 'Authorize.Net' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Platform Links */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Platforms</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/${platform.id}-fee-calculator/`}
                className="text-sm text-gray-600 hover:text-blue-600 min-h-[44px] flex items-center"
              >
                {platform.name} Fees
              </Link>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 pb-6 border-b border-gray-200">
          <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 min-h-[44px] flex items-center">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600 min-h-[44px] flex items-center">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 min-h-[44px] flex items-center">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FeeWhiz. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
