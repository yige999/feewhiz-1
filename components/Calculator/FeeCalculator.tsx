'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import ResultCard from './ResultCard'

const amountSchema = z.number().positive('Amount must be greater than 0').max(999999, 'Amount must be less than 1,000,000')

interface FeeCalculatorProps {
  platform: string
  transactionTypes: { id: string; name: string }[]
  regions: { id: string; name: string }[]
  defaultTransactionType?: string
  defaultRegion?: string
  defaultAmount?: string
  onCalculate?: (result: any) => void
}

export default function FeeCalculator({
  platform,
  transactionTypes,
  regions,
  defaultTransactionType = 'standard',
  defaultRegion = 'domestic',
  defaultAmount = '',
  onCalculate,
}: FeeCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount)
  const [transactionType, setTransactionType] = useState(defaultTransactionType)
  const [region, setRegion] = useState(defaultRegion)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const calculate = async () => {
    setError('')

    try {
      const parsedAmount = amountSchema.parse(parseFloat(amount))
      setResult(null)

      // Dynamic import of calculator
      const { calculateFee } = await import(`@/lib/calculators/${platform}`)
      const calculationResult = calculateFee(parsedAmount, transactionType, region)
      setResult(calculationResult)
      onCalculate?.(calculationResult)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid amount')
      } else {
        setError('Calculation failed. Please try again.')
      }
    }
  }

  // Auto-calculate when defaultAmount is provided
  useEffect(() => {
    if (defaultAmount && parseFloat(defaultAmount) > 0 && !result) {
      calculate()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculate()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            max="999999"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px]"
            required
          />
        </div>

        {/* Transaction Type Select */}
        {transactionTypes.length > 1 && (
          <div>
            <label htmlFor="transaction-type" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction
            </label>
            <select
              id="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[48px]"
            >
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Region Select */}
        {regions.length > 1 && (
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[48px]"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {/* Calculate Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <ResultCard
          amount={result.amount}
          fee={result.fee}
          netAmount={result.netAmount}
          effectiveRate={result.effectiveRate}
          breakdown={result.breakdown}
        />
      )}
    </div>
  )
}
