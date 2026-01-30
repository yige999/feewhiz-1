import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const platforms = ['paypal', 'stripe', 'square', 'adyen', 'braintree', 'authorize-net']
const amounts = [10, 25, 50, 100, 250, 500, 1000]
const comparisons = ['paypal-vs-stripe', 'stripe-vs-square', 'paypal-vs-square']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://feewhiz.online'
  const currentDate = new Date().toISOString()

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Platform main calculator pages
  const platformPages: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${baseUrl}/${platform}-fee-calculator/`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Amount pages (7 amounts × 6 platforms = 42 pages)
  const amountPages: MetadataRoute.Sitemap = platforms.flatMap((platform) =>
    amounts.map((amount) => ({
      url: `${baseUrl}/${platform}-fee-for-${amount}-dollars/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  )

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
    url: `${baseUrl}/${comparison}/`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...corePages, ...platformPages, ...amountPages, ...comparisonPages]
}
