import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/schema/StructuredData'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://feewhiz.online'),
  title: {
    default: 'FeeWhiz - Payment Fee Calculators',
    template: '%s | FeeWhiz',
  },
  description: 'Calculate fees and net amount for major payment platforms including PayPal, Stripe, Square, Adyen, Braintree, and Authorize.Net. Free, fast, no signup required.',
  keywords: ['payment fee calculator', 'PayPal fees', 'Stripe fees', 'Square fees', 'payment processing fees'],
  authors: [{ name: 'FeeWhiz' }],
  creator: 'FeeWhiz',
  publisher: 'FeeWhiz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://feewhiz.online',
    title: 'FeeWhiz - Payment Fee Calculators',
    description: 'Calculate fees and net amount for major payment platforms. Free, fast, no signup required.',
    siteName: 'FeeWhiz',
  },
  twitter: {
    card: 'summary',
    title: 'FeeWhiz - Payment Fee Calculators',
    description: 'Calculate fees and net amount for major payment platforms. Free, fast, no signup required.',
  },
}

function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  if (!clientId) {
    return null
  }

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google AdSense Auto Ads (optional, requires NEXT_PUBLIC_ADSENSE_CLIENT_ID) */}
        <AdSenseScript />
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "YOUR_CLOUDFLARE_ANALYTICS_TOKEN"}'
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
          {children}
        </main>
        <Footer />
        <StructuredData webPage={true} faqPage={true} />
      </body>
    </html>
  )
}
