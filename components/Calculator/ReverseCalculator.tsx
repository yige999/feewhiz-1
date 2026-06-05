'use client'

import { useState } from 'react'
import { z } from 'zod'

const amountSchema = z.number().positive('Amount must be greater than 0').max(999999, 'Amount must be less than 1,000,000')

// Stripe domestic online rate: 2.9% + 30¢
const STRIPE_RATE = 0.029
const STRIPE_FIXED = 0.30

interface ReverseCalculatorProps {
  platform: string
}

export default function ReverseCalculator({ platform }: ReverseCalculatorProps) {
  const [desiredAmount, setDesiredAmount] = useState('')
  const [result, setResult] = useState<{ chargeAmount: number; fee: number; netAmount: number } | null>(null)
  const [error, setError] = useState<string>('')

  const calculateReverse = () => {
    setError('')
    setResult(null)

    try {
      const net = amountSchema.parse(parseFloat(desiredAmount))

      // Reverse calculation: chargeAmount = (netAmount + fixedFee) / (1 - rate)
      // This ensures: chargeAmount - fee = netAmount
      const chargeAmount = (net + STRIPE_FIXED) / (1 - STRIPE_RATE)
      const fee = chargeAmount - net

      setResult({
        chargeAmount: Math.round(chargeAmount * 100) / 100,
        fee: Math.round(fee * 100) / 100,
        netAmount: net,
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid amount')
      } else {
        setError('Calculation failed. Please try again.')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateReverse()
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reverse-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount you want to receive (USD)
          </label>
          <input
            id="reverse-amount"
            type="number"
            step="0.01"
            min="0.01"
            max="999999"
            value={desiredAmount}
            onChange={(e) => setDesiredAmount(e.target.value)}
            placeholder="100.00"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px]"
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px] focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Calculate Charge Amount
        </button>
      </form>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Charge this amount</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(result.chargeAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Stripe fee</span>
            <span className="text-red-600 font-medium">−{formatCurrency(result.fee)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-green-200">
            <span className="text-gray-700 font-medium">You receive</span>
            <span className="text-lg font-bold text-green-700">{formatCurrency(result.netAmount)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Based on Stripe US domestic online rate (2.9% + 30¢). International and in-person rates will differ.</p>
        </div>
      )}
    </div>
  )
}
