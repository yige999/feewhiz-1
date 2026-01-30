import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import FeeCalculator from '@/components/Calculator/FeeCalculator'
import ResultCard from '@/components/Calculator/ResultCard'

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
    title: 'Stripe Fee Calculator',
    description: 'Calculate Stripe payment processing fees for online and in-person transactions.',
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
        title: `${config.title} - Free Payment Fee Calculator`,
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
