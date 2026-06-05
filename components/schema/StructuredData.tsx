interface StructuredDataProps {
  webPage?: boolean
  faqPage?: boolean
  breadcrumb?: {
    name: string
    url: string
  }[]
}

export default function StructuredData({ webPage = false, faqPage = false, breadcrumb = [] }: StructuredDataProps) {
  const baseUrl = 'https://feewhiz.online'

  // Base schema - always included
  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'FeeWhiz',
        description: 'Calculate fees and net amount for major payment platforms including PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net.',
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'FeeWhiz',
          url: baseUrl,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'FeeWhiz',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
        sameAs: [],
      },
      {
        '@type': 'WebApplication',
        '@id': `${baseUrl}/#webapp`,
        name: 'FeeWhiz Payment Fee Calculator',
        url: baseUrl,
        description: 'Calculate payment processing fees for PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'PayPal fee calculator',
          'Stripe fee calculator',
          'Square fee calculator',
          'Adyen fee calculator',
          'Braintree fee calculator',
          'Authorize.Net fee calculator',
          'International fee calculations',
          'Multi-currency support',
        ],
      },
    ],
  }

  // Add WebPage schema when requested
  if (webPage) {
    baseSchema['@graph'].push({
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      url: baseUrl,
      name: 'FeeWhiz - Payment Fee Calculators',
      description: 'Calculate fees and net amount for major payment platforms. Free, fast, no signup required.',
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
    })
  }

  // Add BreadcrumbList when provided
  if (breadcrumb.length > 0) {
    baseSchema['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    })
  }

  // Add FAQPage schema when requested
  if (faqPage) {
    baseSchema['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What payment platforms do you support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We support fee calculations for PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net. Each calculator uses the latest published fee structures from each platform.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are these fee calculators accurate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our calculators are based on the publicly available fee structures from each payment platform. Fees may vary based on your specific account, transaction volume, location, and other factors. Always verify with your payment processor for exact pricing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to sign up to use these calculators?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, all fee calculators on FeeWhiz are completely free to use with no signup required. Simply select a platform, enter your amount, and get instant results.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between domestic and international fees?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Domestic fees apply when both the sender and receiver are in the same country. International fees typically include additional percentage charges and currency conversion fees when the transaction crosses borders.',
          },
        },
      ],
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
    />
  )
}
