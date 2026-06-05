import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import FeeCalculator from '@/components/Calculator/FeeCalculator'
import ReverseCalculator from '@/components/Calculator/ReverseCalculator'
import ResultCard from '@/components/Calculator/ResultCard'
import Accordion from '@/components/Calculator/Accordion'

// Amounts for fixed amount pages
const amounts = ['10', '25', '50', '100', '250', '500', '1000']

const amountTitles: Record<string, string> = {
  '10': 'Ten Dollars',
  '25': 'Twenty-Five Dollars',
  '50': 'Fifty Dollars',
  '100': 'One Hundred Dollars',
  '250': 'Two Hundred Fifty Dollars',
  '500': 'Five Hundred Dollars',
  '1000': 'One Thousand Dollars',
}

// Platform configurations
const platformConfigs: Record<string, {
  name: string
  slug: string
  title: string
  description: string
  calculatorSlug: string
}> = {
  paypal: {
    name: 'PayPal',
    slug: 'paypal',
    title: 'PayPal Fee Calculator',
    description: 'Calculate PayPal fees for goods & services, invoices, and international transactions.',
    calculatorSlug: 'paypal',
  },
  stripe: {
    name: 'Stripe',
    slug: 'stripe',
    title: 'Stripe Fee Calculator 2026 - Calculate Processing Fees',
    description: 'Calculate Stripe payment processing fees for online, in-person, and international transactions. Supports US, UK, EU, and international card rates with reverse fee calculator.',
    calculatorSlug: 'stripe',
  },
  square: {
    name: 'Square',
    slug: 'square',
    title: 'Square Fee Calculator',
    description: 'Calculate Square fees for in-person, online, and invoice payments.',
    calculatorSlug: 'square',
  },
  adyen: {
    name: 'Adyen',
    slug: 'adyen',
    title: 'Adyen Fee Calculator',
    description: 'Calculate Adyen payment processing fees for card payments and ACH transactions.',
    calculatorSlug: 'adyen',
  },
  braintree: {
    name: 'Braintree',
    slug: 'braintree',
    title: 'Braintree Fee Calculator',
    description: 'Calculate Braintree payment processing fees for cards, PayPal, Venmo, and more.',
    calculatorSlug: 'braintree',
  },
  'authorize-net': {
    name: 'Authorize.Net',
    slug: 'authorize-net',
    title: 'Authorize.Net Fee Calculator',
    description: 'Calculate Authorize.Net payment gateway fees for credit cards and eCheck.',
    calculatorSlug: 'authorize-net',
  },
}

// Scenario page configurations
const scenarioConfigs: Record<string, {
  platform: string
  titleSuffix: string
  description: string
  transactionType?: string
  region?: string
}> = {
  'paypal-invoice-fee': {
    platform: 'paypal',
    titleSuffix: 'Invoice Fees',
    description: 'Calculate PayPal fees specifically for invoice payments. Learn how much you pay when clients pay via PayPal invoices.',
  },
  'paypal-international-fee': {
    platform: 'paypal',
    titleSuffix: 'International Fees',
    description: 'Calculate PayPal international transaction fees. See the additional costs for cross-border payments.',
    region: 'international',
  },
  'stripe-subscription-fee': {
    platform: 'stripe',
    titleSuffix: 'Subscription Fees',
    description: 'Calculate Stripe fees for recurring subscription payments. Understand the costs of subscription billing.',
  },
  'stripe-international-fee': {
    platform: 'stripe',
    titleSuffix: 'International Fees',
    description: 'Calculate Stripe international card fees. See the additional costs for cross-border transactions.',
    region: 'international',
  },
  'square-in-person-fee': {
    platform: 'square',
    titleSuffix: 'In-Person Fees',
    description: 'Calculate Square in-person payment fees when using Square Reader, Square Stand, or Square Terminal.',
    transactionType: 'in_person',
  },
  'square-online-fee': {
    platform: 'square',
    titleSuffix: 'Online Fees',
    description: 'Calculate Square online payment fees for e-commerce transactions processed through Square Online.',
    transactionType: 'online',
  },
}

// Comparison page configurations
const comparisonConfigs: Record<string, {
  platformA: string
  platformB: string
  nameA: string
  nameB: string
}> = {
  'paypal-vs-stripe-fees': {
    platformA: 'paypal',
    platformB: 'stripe',
    nameA: 'PayPal',
    nameB: 'Stripe',
  },
  'stripe-vs-square-fees': {
    platformA: 'stripe',
    platformB: 'square',
    nameA: 'Stripe',
    nameB: 'Square',
  },
  'paypal-vs-square-fees': {
    platformA: 'paypal',
    platformB: 'square',
    nameA: 'PayPal',
    nameB: 'Square',
  },
}

// Generate all 57 slugs
function generateAllSlugs(): string[] {
  const slugs: string[] = []

  // 1. Platform main pages (6)
  Object.keys(platformConfigs).forEach((platform) => {
    slugs.push(`${platform}-fee-calculator`)
  })

  // 2. Scenario pages (6)
  Object.keys(scenarioConfigs).forEach((slug) => slugs.push(slug))

  // 3. Comparison pages (3)
  Object.keys(comparisonConfigs).forEach((slug) => slugs.push(slug))

  // 4. Amount pages (42 = 7 amounts × 6 platforms)
  Object.keys(platformConfigs).forEach((platform) => {
    amounts.forEach((amount) => {
      slugs.push(`${platform}-fee-for-${amount}-dollars`)
    })
  })

  return slugs
}

export function generateStaticParams() {
  const allSlugs = generateAllSlugs()
  return allSlugs.map((slug) => ({ slug }))
}

// Helper to load fee data
async function loadFeeData(platform: string) {
  try {
    const data = await import(`@/lib/fee-data/${platform}.json`)
    return data.default
  } catch {
    return null
  }
}

// Calculate fee helper
async function calculateFeeHelper(platform: string, amount: number, transactionType: string = 'standard', region: string = 'domestic') {
  try {
    const { calculateFee } = await import(`@/lib/calculators/${platform}`)
    return calculateFee(amount, transactionType, region)
  } catch {
    return null
  }
}

// Generate metadata for each slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const canonicalUrl = `https://feewhiz.online/${slug}/`

  // Check if it's a platform main page
  for (const [key, config] of Object.entries(platformConfigs)) {
    if (slug === `${key}-fee-calculator`) {
      return {
        title: config.title,
        description: config.description,
        alternates: { canonical: canonicalUrl },
      }
    }
  }

  // Check if it's a scenario page
  if (scenarioConfigs[slug]) {
    const config = scenarioConfigs[slug]
    const platformConfig = platformConfigs[config.platform]
    return {
      title: `${platformConfig.name} ${config.titleSuffix} - Fee Calculator`,
      description: config.description,
      alternates: { canonical: canonicalUrl },
    }
  }

  // Check if it's a comparison page
  if (comparisonConfigs[slug]) {
    const config = comparisonConfigs[slug]
    return {
      title: `${config.nameA} vs ${config.nameB} Fees - Side by Side Comparison`,
      description: `Compare payment processing fees between ${config.nameA} and ${config.nameB}. See which platform offers better rates for your business.`,
      alternates: { canonical: canonicalUrl },
    }
  }

  // Check if it's an amount page using indexOf instead of regex
  if (slug.includes('-fee-for-') && slug.endsWith('-dollars')) {
    const platformEndIndex = slug.indexOf('-fee-for-')
    const platformKey = slug.substring(0, platformEndIndex) // e.g., "paypal" or "authorize"

    // Handle authorize-net special case
    const platform = platformKey === 'authorize' ? 'authorize-net' : platformKey

    if (platformConfigs[platform]) {
      const amount = slug.substring(platformEndIndex + 9).replace('-dollars', '')
      if (amountTitles[amount]) {
        const config = platformConfigs[platform]
        return {
          title: `${config.name} Fee for $${amount} - Instant Calculator`,
          description: `Calculate exactly how much ${config.name} charges for a $${amount} payment. See the fee breakdown and net amount.`,
          alternates: { canonical: canonicalUrl },
        }
      }
    }
  }

  return {
    title: 'FeeWhiz - Payment Fee Calculator',
    description: 'Free payment processing fee calculators for major platforms.',
    alternates: { canonical: canonicalUrl },
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 1. Check if it's a platform main page
  for (const [key, config] of Object.entries(platformConfigs)) {
    if (slug === `${key}-fee-calculator`) {
      const feeData = await loadFeeData(key)
      if (!feeData) notFound()

      // Stripe-specific: enhanced page with region rates, reverse calculator, FAQ
      if (key === 'stripe') {
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Stripe</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stripe Fee Calculator 2026 - Calculate Processing Fees</h1>
            <p className="text-gray-600 mb-8">Calculate Stripe payment processing fees for online, in-person, and international transactions. Supports US, UK, EU, and international card rates.</p>

            {/* Main Calculator */}
            <FeeCalculator
              platform={config.calculatorSlug}
              transactionTypes={feeData.transaction_types}
              regions={feeData.regions}
              defaultTransactionType="standard"
              defaultRegion="domestic"
            />

            {/* Reverse Calculator */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reverse Fee Calculator</h2>
              <p className="text-gray-600 mb-4">Enter the amount you want to <strong>receive</strong> after fees, and we&apos;ll tell you how much to charge.</p>
              <ReverseCalculator platform="stripe" />
            </div>

            {/* Stripe Pricing by Region */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stripe Processing Rates by Country / Region</h2>
              <p className="text-gray-600 mb-6">Stripe fees vary depending on where your business is registered and the cardholder&apos;s location. Below are the most common regions:</p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Region</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Online Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">In-Person Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">ACH / Bank Transfer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">🇺🇸 United States</td>
                      <td className="text-right py-3 px-4">2.9% + 30¢</td>
                      <td className="text-right py-3 px-4">2.7% + 5¢</td>
                      <td className="text-right py-3 px-4">0.8% (cap $5)</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 px-4 font-medium">🇬🇧 United Kingdom</td>
                      <td className="text-right py-3 px-4">1.5% + 20p</td>
                      <td className="text-right py-3 px-4">1.4% + 5p</td>
                      <td className="text-right py-3 px-4">—</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">🇪🇺 European Union (SEPA)</td>
                      <td className="text-right py-3 px-4">1.5% + €0.25</td>
                      <td className="text-right py-3 px-4">1.4% + €0.05</td>
                      <td className="text-right py-3 px-4">SEPA: €0.35 fixed</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 px-4 font-medium">🌍 International Cards</td>
                      <td className="text-right py-3 px-4">4.4% + 30¢</td>
                      <td className="text-right py-3 px-4">3.9% + 5¢</td>
                      <td className="text-right py-3 px-4">+1.5% additional</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">💱 Currency Conversion</td>
                      <td className="text-right py-3 px-4">+1%</td>
                      <td className="text-right py-3 px-4">+1%</td>
                      <td className="text-right py-3 px-4">+1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">* Rates as of 2026. Actual rates may vary by account volume and Stripe pricing tier. Always verify on <a href="https://stripe.com/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com/pricing</a>.</p>
            </div>

            {/* Quick Amount Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Calculate</h2>
              <div className="flex flex-wrap gap-2">
                {amounts.map((amt) => (
                  <Link
                    key={amt}
                    href={`/stripe-fee-for-${amt}-dollars/`}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    ${amt}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stripe Fee FAQ */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stripe Fee FAQ</h2>
              <div className="space-y-3">
                <Accordion title="How much does Stripe charge per transaction?">
                  <p className="text-gray-700">For US businesses, Stripe charges <strong>2.9% + 30¢ per online transaction</strong>. In-person payments via Stripe Terminal cost <strong>2.7% + 5¢</strong>. ACH Direct Debit is the cheapest option at <strong>0.8% with a $5 cap</strong>. International cards cost significantly more at <strong>4.4% + 30¢</strong>.</p>
                </Accordion>
                <Accordion title="How do I calculate Stripe fees?">
                  <p className="text-gray-700">Stripe fees are calculated as: <code className="bg-gray-100 px-1 rounded">Fee = (Amount × Rate) + Fixed Fee</code>. For example, a $100 online payment: <code className="bg-gray-100 px-1 rounded">($100 × 0.029) + $0.30 = $3.20</code>. You receive $96.80. Use our calculator above for instant results.</p>
                </Accordion>
                <Accordion title="Does Stripe charge for international cards?">
                  <p className="text-gray-700">Yes. International cards incur an additional <strong>1.5% cross-border fee</strong> on top of the standard rate, making the total <strong>4.4% + 30¢</strong> for online payments. If currency conversion is needed, an extra <strong>1%</strong> fee applies.</p>
                </Accordion>
                <Accordion title="Is Stripe cheaper than PayPal?">
                  <p className="text-gray-700">For most online transactions, Stripe and PayPal have similar base rates (both around 2.9% + 30¢ for US domestic). However, Stripe is generally cheaper for in-person payments (2.7% + 5¢ vs PayPal&apos;s 2.7% + $0.00 for card present) and offers better rates for high-volume businesses. See our <Link href="/paypal-vs-stripe-fees/" className="text-blue-600 hover:underline">PayPal vs Stripe comparison</Link> for details.</p>
                </Accordion>
                <Accordion title="What is Stripe Connect pricing?">
                  <p className="text-gray-700">Stripe Connect (for marketplaces) adds <strong>0.25% + 25¢ per connected account payment</strong> on top of the standard processing fee. So a $100 marketplace payment costs approximately <strong>$3.20 + $0.50 = $3.70</strong> in total fees.</p>
                </Accordion>
                <Accordion title="Does Stripe have a monthly fee?">
                  <p className="text-gray-700">No, Stripe does not charge a monthly fee. You only pay per transaction. There are no setup fees, monthly fees, or hidden charges. This makes Stripe ideal for businesses of all sizes, especially those with variable transaction volumes.</p>
                </Accordion>
              </div>
            </div>

            {/* Comparison Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compare Fees</h2>
              <div className="space-y-2">
                <Link href="/paypal-vs-stripe-fees/" className="block text-blue-600 hover:text-blue-800">
                  PayPal vs Stripe Fees
                </Link>
                <Link href="/stripe-vs-square-fees/" className="block text-blue-600 hover:text-blue-800">
                  Stripe vs Square Fees
                </Link>
                <Link href="/paypal-vs-square-fees/" className="block text-blue-600 hover:text-blue-800">
                  PayPal vs Square Fees
                </Link>
              </div>
            </div>
          </div>
        )
      }

      // Default platform page (non-Stripe)
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{config.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
          <p className="text-gray-600 mb-8">{config.description}</p>

          <FeeCalculator
            platform={config.calculatorSlug}
            transactionTypes={feeData.transaction_types}
            regions={feeData.regions}
            defaultTransactionType="standard"
            defaultRegion="domestic"
          />

          {/* Quick Amount Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Calculate</h2>
            <div className="flex flex-wrap gap-2">
              {amounts.map((amt) => (
                <Link
                  key={amt}
                  href={`/${key}-fee-for-${amt}-dollars/`}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  ${amt}
                </Link>
              ))}
            </div>
          </div>

          {/* Comparison Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Compare Fees</h2>
            <div className="space-y-2">
              <Link href="/paypal-vs-stripe-fees/" className="block text-blue-600 hover:text-blue-800">
                PayPal vs Stripe Fees
              </Link>
              <Link href="/stripe-vs-square-fees/" className="block text-blue-600 hover:text-blue-800">
                Stripe vs Square Fees
              </Link>
              <Link href="/paypal-vs-square-fees/" className="block text-blue-600 hover:text-blue-800">
                PayPal vs Square Fees
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }

  // 2. Check if it's a scenario page
  if (scenarioConfigs[slug]) {
    const config = scenarioConfigs[slug]
    const platformConfig = platformConfigs[config.platform]
    const feeData = await loadFeeData(config.platform)
    if (!feeData) notFound()

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${config.platform}-fee-calculator/`} className="hover:text-blue-600">
            {platformConfig.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{config.titleSuffix}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {platformConfig.name} {config.titleSuffix}
        </h1>
        <p className="text-gray-600 mb-8">{config.description}</p>

        <FeeCalculator
          platform={platformConfig.calculatorSlug}
          transactionTypes={feeData.transaction_types}
          regions={feeData.regions}
          defaultTransactionType={config.transactionType || 'standard'}
          defaultRegion={config.region || 'domestic'}
        />
      </div>
    )
  }

  // 3. Check if it's a comparison page
  if (comparisonConfigs[slug]) {
    const config = comparisonConfigs[slug]
    const feeDataA = await loadFeeData(config.platformA)
    const feeDataB = await loadFeeData(config.platformB)
    if (!feeDataA || !feeDataB) notFound()

    // Calculate comparison for sample amounts
    const sampleAmounts = [50, 100, 500, 1000]
    const comparisons = await Promise.all(
      sampleAmounts.map(async (amount) => {
        const resultA = await calculateFeeHelper(config.platformA, amount)
        const resultB = await calculateFeeHelper(config.platformB, amount)
        return { amount, resultA, resultB }
      })
    )

    // Stripe vs Square enhanced page
    if (slug === 'stripe-vs-square-fees') {
      // Pre-calculate fees for different transaction types
      const stripeOnline100 = await calculateFeeHelper('stripe', 100, 'online', 'domestic')
      const stripeInPerson100 = await calculateFeeHelper('stripe', 100, 'in_person', 'domestic')
      const squareOnline100 = await calculateFeeHelper('square', 100, 'online', 'domestic')
      const squareInPerson100 = await calculateFeeHelper('square', 100, 'in_person', 'domestic')

      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Stripe vs Square Fees</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stripe vs Square Fees Comparison (2026)</h1>
          <p className="text-gray-600 mb-8">
            Detailed side-by-side comparison of Stripe and Square payment processing fees. See which platform saves you money based on your transaction type and volume.
          </p>

          {/* Rate Overview Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
              <h3 className="font-bold text-blue-900 text-lg mb-2">Stripe Rates</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Online:</strong> 2.9% + 30¢</li>
                <li><strong>In-Person:</strong> 2.7% + 5¢</li>
                <li><strong>ACH:</strong> 0.8% (cap $5)</li>
                <li><strong>International:</strong> 4.4% + 30¢</li>
              </ul>
            </div>
            <div className="border border-green-200 rounded-lg p-5 bg-green-50">
              <h3 className="font-bold text-green-900 text-lg mb-2">Square Rates</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Online:</strong> 3.3% + 30¢</li>
                <li><strong>In-Person:</strong> 2.6% + 15¢</li>
                <li><strong>ACH Invoice:</strong> 1% ($1 min, $10 cap)</li>
                <li><strong>International:</strong> 3.3% + 30¢</li>
              </ul>
            </div>
          </div>

          {/* Comparison Table - Online Payments */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Online Payment Fee Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Stripe Fee</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Square Fee</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">You Save With</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map(({ amount, resultA, resultB }) => {
                    if (!resultA || !resultB) return null
                    const diff = resultA.fee - resultB.fee
                    const winner = diff < 0 ? 'Stripe' : 'Square'
                    const savings = Math.abs(diff)

                    return (
                      <tr key={amount} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">${amount}</td>
                        <td className="text-right py-3 px-4">${resultA.fee.toFixed(2)}</td>
                        <td className="text-right py-3 px-4">${resultB.fee.toFixed(2)}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-medium ${winner === 'Stripe' ? 'text-blue-600' : 'text-green-600'}`}>
                            {winner} (save ${savings.toFixed(2)})
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* In-Person Comparison */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">In-Person Payment Fee Comparison ($100)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Stripe Terminal</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stripeInPerson100 ? `$${stripeInPerson100.fee.toFixed(2)}` : '—'}
                </div>
                <div className="text-sm text-gray-600">2.7% + 5¢ → You keep ${stripeInPerson100 ? stripeInPerson100.netAmount.toFixed(2) : '—'}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Square In-Person</div>
                <div className="text-2xl font-bold text-gray-900">
                  {squareInPerson100 ? `$${squareInPerson100.fee.toFixed(2)}` : '—'}
                </div>
                <div className="text-sm text-gray-600">2.6% + 15¢ → You keep ${squareInPerson100 ? squareInPerson100.netAmount.toFixed(2) : '—'}</div>
              </div>
            </div>
          </div>

          {/* Scenario-Based Recommendations */}
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Which One Should You Choose?</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">🛒 E-commerce / Online Store</h3>
                <p className="text-gray-700 mt-1">
                  <strong>Winner: Stripe</strong> — At 2.9% + 30¢ vs Square&apos;s 3.3% + 30¢, Stripe saves you <strong>0.4% on every online transaction</strong>. On $10,000/month in sales, that&apos;s ~$40/month saved. Stripe also has better developer tools and API documentation.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">🏪 Brick-and-Mortar / In-Person</h3>
                <p className="text-gray-700 mt-1">
                  <strong>Winner: Square</strong> — Square&apos;s in-person rate (2.6% + 15¢) is slightly lower percentage-wise than Stripe Terminal (2.7% + 5¢), and Square provides free hardware (Square Reader). For small tickets (&lt;$30), Stripe&apos;s lower fixed fee wins. For larger amounts, they&apos;re close.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">🌍 International Sales</h3>
                <p className="text-gray-700 mt-1">
                  <strong>Winner: Square</strong> — Square charges 3.3% + 30¢ for international (same as domestic online). Stripe charges 4.4% + 30¢ — a full 1.1% more. If you process many international cards, Square can save significantly.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">🔧 Developer / Custom Integration</h3>
                <p className="text-gray-700 mt-1">
                  <strong>Winner: Stripe</strong> — Stripe is built for developers with excellent documentation, extensive API, and support for complex payment flows (subscriptions, marketplaces, invoicing). Square is simpler but less flexible.
                </p>
              </div>

              <div className="border-l-4 border-gray-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">💰 Small Business / No Coding</h3>
                <p className="text-gray-700 mt-1">
                  <strong>Winner: Square</strong> — Square offers a free POS app, free card reader, built-in inventory management, and no monthly fees. It&apos;s the easiest way to start accepting payments in person without any technical setup.
                </p>
              </div>
            </div>
          </div>

          {/* Fee Calculation Examples */}
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Fee Examples</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Scenario</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Stripe Fee</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Square Fee</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">$25 online sale</td>
                    <td className="text-right py-3 px-4">$1.03</td>
                    <td className="text-right py-3 px-4">$1.13</td>
                    <td className="text-right py-3 px-4 text-blue-600 font-medium">Stripe saves $0.10</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-3 px-4">$100 online sale</td>
                    <td className="text-right py-3 px-4">$3.20</td>
                    <td className="text-right py-3 px-4">$3.60</td>
                    <td className="text-right py-3 px-4 text-blue-600 font-medium">Stripe saves $0.40</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">$500 online sale</td>
                    <td className="text-right py-3 px-4">$14.80</td>
                    <td className="text-right py-3 px-4">$16.80</td>
                    <td className="text-right py-3 px-4 text-blue-600 font-medium">Stripe saves $2.00</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-3 px-4">$15 in-person coffee</td>
                    <td className="text-right py-3 px-4">$0.46</td>
                    <td className="text-right py-3 px-4">$0.54</td>
                    <td className="text-right py-3 px-4 text-blue-600 font-medium">Stripe saves $0.08</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">$200 in-person sale</td>
                    <td className="text-right py-3 px-4">$5.45</td>
                    <td className="text-right py-3 px-4">$5.35</td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">Square saves $0.10</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-3 px-4">$100 international card</td>
                    <td className="text-right py-3 px-4">$4.70</td>
                    <td className="text-right py-3 px-4">$3.60</td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">Square saves $1.10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Savings Calculator */}
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Annual Savings Estimate (Online Payments)</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-500 mb-1">$5K/mo revenue</div>
                  <div className="text-2xl font-bold text-blue-600">$240/year</div>
                  <div className="text-xs text-gray-500">saved with Stripe</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">$25K/mo revenue</div>
                  <div className="text-2xl font-bold text-blue-600">$1,200/year</div>
                  <div className="text-xs text-gray-500">saved with Stripe</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">$100K/mo revenue</div>
                  <div className="text-2xl font-bold text-blue-600">$4,800/year</div>
                  <div className="text-xs text-gray-500">saved with Stripe</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">Based on 0.4% rate difference for online transactions. Actual savings depend on your mix of transaction types and volumes.</p>
            </div>
          </div>

          {/* Calculator Links */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link
              href="/stripe-fee-calculator/"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Stripe Fee Calculator</h3>
              <p className="text-sm text-gray-600">Calculate Stripe fees for any amount</p>
            </Link>
            <Link
              href="/square-fee-calculator/"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Square Fee Calculator</h3>
              <p className="text-sm text-gray-600">Calculate Square fees for any amount</p>
            </Link>
          </div>

          {/* FAQ */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Stripe vs Square FAQ</h2>
            <div className="space-y-3">
              <Accordion title="Is Stripe cheaper than Square?">
                <p className="text-gray-700">For <strong>online payments</strong>, yes — Stripe (2.9% + 30¢) is cheaper than Square (3.3% + 30¢), saving you 0.4% per transaction. For <strong>in-person payments</strong>, they&apos;re very close: Stripe Terminal is 2.7% + 5¢ vs Square&apos;s 2.6% + 15¢. Stripe wins on small tickets; Square wins on larger ones.</p>
              </Accordion>
              <Accordion title="Can I use both Stripe and Square?">
                <p className="text-gray-700">Yes! Many businesses use both platforms together. For example, use Stripe for your online store and Square for your physical location. This way you get the best rates for each channel.</p>
              </Accordion>
              <Accordion title="Which is better for a small business?">
                <p className="text-gray-700">If you&apos;re a brick-and-mortar store, <strong>Square</strong> is easier to set up with free hardware and a built-in POS system. If you&apos;re an online-first business or need developer tools, <strong>Stripe</strong> offers better rates and more flexibility.</p>
              </Accordion>
              <Accordion title="Do Stripe and Square charge monthly fees?">
                <p className="text-gray-700">No. Both Stripe and Square operate on a pay-as-you-go model with no monthly fees. You only pay transaction fees. However, both offer premium plans (Stripe Custom, Square Plus/Premium) with lower rates for high-volume businesses.</p>
              </Accordion>
            </div>
          </div>
        </div>
      )
    }

    // Default comparison page (PayPal vs Stripe, PayPal vs Square)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {config.nameA} vs {config.nameB} Fees
          </span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {config.nameA} vs {config.nameB} Fees Comparison
        </h1>
        <p className="text-gray-600 mb-8">
          Compare payment processing fees side by side. See which platform offers better rates for your business.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">{config.nameA} Fee</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">{config.nameB} Fee</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Difference</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(({ amount, resultA, resultB }) => {
                if (!resultA || !resultB) return null
                const diff = resultA.fee - resultB.fee
                const winner = diff < 0 ? config.nameA : config.nameB

                return (
                  <tr key={amount} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">${amount}</td>
                    <td className="text-right py-3 px-4">${resultA.fee.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${resultB.fee.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">
                      <span className={diff < 0 ? 'text-green-600' : 'text-red-600'}>
                        {diff > 0 ? '+' : ''}${diff.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">({winner} wins)</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Calculator Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link
            href={`/${config.platformA}-fee-calculator/`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">{config.nameA} Calculator</h3>
            <p className="text-sm text-gray-600">Calculate fees for any amount</p>
          </Link>
          <Link
            href={`/${config.platformB}-fee-calculator/`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">{config.nameB} Calculator</h3>
            <p className="text-sm text-gray-600">Calculate fees for any amount</p>
          </Link>
        </div>
      </div>
    )
  }

  // 4. Check if it's an amount page using indexOf instead of regex
  if (slug.includes('-fee-for-') && slug.endsWith('-dollars')) {
    const platformEndIndex = slug.indexOf('-fee-for-')
    const platformKey = slug.substring(0, platformEndIndex) // e.g., "paypal" or "authorize"

    // Handle authorize-net special case
    const platform = platformKey === 'authorize' ? 'authorize-net' : platformKey
    const amountStr = slug.substring(platformEndIndex + 9).replace('-dollars', '')

    if (platformConfigs[platform] && amountTitles[amountStr]) {
      const config = platformConfigs[platform]
      const amount = parseFloat(amountStr)
      const result = await calculateFeeHelper(platform, amount)

      if (result) {
        return (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/${platform}-fee-calculator/`} className="hover:text-blue-600">
                {config.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">${amount} Fee</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.name} Fee for ${amount}
            </h1>
            <p className="text-gray-600 mb-8">
              Exactly how much {config.name} charges for a ${amount} payment.
            </p>

            <ResultCard
              amount={result.amount}
              fee={result.fee}
              netAmount={result.netAmount}
              effectiveRate={result.effectiveRate}
              breakdown={result.breakdown}
            />

            {/* Other Amounts */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Amounts</h2>
              <div className="flex flex-wrap gap-2">
                {amounts
                  .filter((a) => a !== amountStr)
                  .map((amt) => (
                    <Link
                      key={amt}
                      href={`/${platform}-fee-for-${amt}-dollars/`}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      ${amt}
                    </Link>
                  ))}
              </div>
            </div>

            {/* Full Calculator Link */}
            <div className="mt-8">
              <Link
                href={`/${platform}-fee-calculator/`}
                className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Use Full Calculator
              </Link>
            </div>
          </div>
        )
      }
    }
  }

  // 5. 404 if no match
  notFound()
}
