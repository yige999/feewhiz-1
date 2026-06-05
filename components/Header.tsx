'use client'

import Link from 'next/link'
import { useState } from 'react'

const platforms = [
  { id: 'paypal', name: 'PayPal' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'square', name: 'Square' },
  { id: 'adyen', name: 'Adyen' },
  { id: 'braintree', name: 'Braintree' },
  { id: 'authorize-net', name: 'Authorize.Net' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">FeeWhiz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 min-h-[44px]">
                <span>Platforms</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {platforms.map((platform) => (
                  <Link
                    key={platform.id}
                    href={`/${platform.id}-fee-calculator/`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg min-h-[44px] flex items-center"
                  >
                    {platform.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/#compare" className="text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center">
              Compare
            </Link>

            <Link href="/contact" className="text-gray-700 hover:text-blue-600 min-h-[44px] flex items-center">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="font-medium text-gray-700 px-2 py-1">Platforms</div>
              {platforms.map((platform) => (
                <Link
                  key={platform.id}
                  href={`/${platform.id}-fee-calculator/`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {platform.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
