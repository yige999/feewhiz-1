'use client'

import { useState } from 'react'

interface ResultCardProps {
  amount: number
  fee: number
  netAmount: number
  effectiveRate: number
  breakdown?: {
    percentageFee: number
    fixedFee: number
    totalFee: number
  }
}

export default function ResultCard({ amount, fee, netAmount, effectiveRate, breakdown }: ResultCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Fee</span>
        <span className="text-2xl font-bold text-blue-600">{formatCurrency(fee)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Net amount</span>
        <span className="text-xl font-semibold text-green-600">{formatCurrency(netAmount)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Rate</span>
        <span className="text-gray-900 font-medium">{formatPercent(effectiveRate)}</span>
      </div>

      {breakdown && (
        <div className="pt-2 border-t border-blue-200">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-sm text-blue-600 hover:text-blue-700 underline min-h-[44px] flex items-center"
          >
            {showBreakdown ? 'Hide' : 'Show'} Breakdown
          </button>
          {showBreakdown && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Percentage fee</span>
                <span className="text-gray-900">{formatCurrency(breakdown.percentageFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed fee</span>
                <span className="text-gray-900">{formatCurrency(breakdown.fixedFee)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
                <span className="text-gray-700">Total fee</span>
                <span className="text-gray-900">{formatCurrency(breakdown.totalFee)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
