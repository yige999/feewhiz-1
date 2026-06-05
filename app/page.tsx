import { Metadata } from 'next'
import PlatformCard from '@/components/PlatformCard'
import Accordion from '@/components/Calculator/Accordion'

export const metadata: Metadata = {
  title: 'Payment Fee Calculators | FeeWhiz',
  description: 'Calculate fees and net amount for major payment platforms including PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net. Free, fast, no signup required.',
  openGraph: {
    title: 'Payment Fee Calculators | FeeWhiz',
    description: 'Calculate fees and net amount for major payment platforms. Free, fast, no signup required.',
    url: 'https://feewhiz.online/',
  },
  alternates: {
    canonical: 'https://feewhiz.online/',
  },
}

const platforms = [
  {
    id: 'paypal',
    name: 'PayPal',
    slug: 'paypal',
    features: ['International', 'Invoice'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    slug: 'stripe',
    features: ['In-Person', 'International', 'Subscription', 'Invoice'],
  },
  {
    id: 'square',
    name: 'Square',
    slug: 'square',
    features: ['In-Person', 'Online', 'Invoice', 'Afterpay'],
  },
  {
    id: 'adyen',
    name: 'Adyen',
    slug: 'adyen',
    features: ['Card / APM', 'International', 'Marketplace'],
  },
  {
    id: 'braintree',
    name: 'Braintree',
    slug: 'braintree',
    features: ['PayPal', 'Venmo', 'Subscription', 'Marketplace'],
  },
  {
    id: 'authorize-net',
    name: 'Authorize.Net',
    slug: 'authorize-net',
    features: ['eCheck', 'Subscription', 'Recurring Billing'],
  },
]

const quickPicks = [
  { name: 'PayPal Invoice Fees', href: '/paypal-invoice-fee/' },
  { name: 'Stripe Subscription Fees', href: '/stripe-subscription-fee/' },
  { name: 'Square POS Fees', href: '/square-in-person-fee/' },
  { name: 'PayPal International', href: '/paypal-international-fee/' },
  { name: 'Stripe International Fees', href: '/stripe-international-fee/' },
  { name: 'Square Online Fees', href: '/square-online-fee/' },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Payment Fee Calculators
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate fees and net amount for major payment platforms.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Free
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Fast
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            No signup
          </span>
        </div>
      </section>

      {/* Popular Platforms */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Platforms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </section>

      {/* Quick Picks */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Picks</h2>
        <div className="flex flex-wrap gap-2">
          {quickPicks.map((pick) => (
            <a
              key={pick.href}
              href={pick.href}
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 min-h-[44px] flex items-center"
            >
              {pick.name}
            </a>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 -mx-4 px-4 py-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Choose a platform</h3>
            <p className="text-sm text-gray-600">Select PayPal, Stripe, Square, or other platform</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Enter amount & options</h3>
            <p className="text-sm text-gray-600">Input transaction amount and select type</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Get result</h3>
            <p className="text-sm text-gray-600">See fee, net amount, and effective rate</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a
            href="/paypal-fee-calculator/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 min-h-[48px] flex items-center"
          >
            Start with PayPal
          </a>
          <a
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 min-h-[48px] flex items-center"
          >
            Browse all platforms
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

        <Accordion title="What payment platforms do you support?" defaultOpen>
          <p className="text-gray-700">
            We support fee calculations for PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net. Each calculator uses the latest published fee structures from each platform.
          </p>
        </Accordion>

        <Accordion title="Are these fee calculators accurate?">
          <p className="text-gray-700">
            Our calculators are based on the publicly available fee structures from each payment platform. Fees may vary based on your specific account, transaction volume, location, and other factors. Always verify with your payment processor for exact pricing.
          </p>
        </Accordion>

        <Accordion title="Do I need to sign up to use these calculators?">
          <p className="text-gray-700">
            No, all fee calculators on FeeWhiz are completely free to use with no signup required. Simply select a platform, enter your amount, and get instant results.
          </p>
        </Accordion>

        <Accordion title="What is the difference between domestic and international fees?">
          <p className="text-gray-700">
            Domestic fees apply when both the sender and receiver are in the same country. International fees typically include additional percentage charges and currency conversion fees when the transaction crosses borders.
          </p>
        </Accordion>
      </section>
    </div>
  )
}
