import { FeeConfig, CalculationResult } from '../types'
import stripeData from '../fee-data/stripe.json'

export function calculateStripeFee(
  amount: number,
  transactionType: string = 'online',
  region: string = 'domestic'
): CalculationResult {
  const config = stripeData as unknown as FeeConfig

  let feeConfig = config.fees.domestic?.[transactionType] || config.fees.domestic?.standard

  if (!feeConfig) {
    throw new Error(`Invalid transaction type: ${transactionType}`)
  }

  // Apply international fee if applicable
  if (region === 'international' && config.fees.international?.additional_fee) {
    const baseFee = calculateFee(amount, feeConfig)
    const internationalFee = amount * config.fees.international.additional_fee.rate

    return {
      amount,
      fee: baseFee.fee + internationalFee,
      netAmount: amount - (baseFee.fee + internationalFee),
      effectiveRate: (baseFee.fee + internationalFee) / amount,
      breakdown: {
        percentageFee: (amount * (feeConfig.rate || 0)) + internationalFee,
        fixedFee: feeConfig.fixed || 0,
        totalFee: baseFee.fee + internationalFee
      }
    }
  }

  const fee = calculateFee(amount, feeConfig)

  return {
    amount,
    fee: fee.fee,
    netAmount: fee.netAmount,
    effectiveRate: fee.effectiveRate,
    breakdown: {
      percentageFee: amount * (feeConfig.rate || 0),
      fixedFee: feeConfig.fixed || 0,
      totalFee: fee.fee
    }
  }
}

function calculateFee(amount: number, feeConfig: any): { fee: number; netAmount: number; effectiveRate: number } {
  let fee = 0

  if (feeConfig.type === 'percentage_plus_fixed') {
    fee = (amount * feeConfig.rate) + feeConfig.fixed
  } else if (feeConfig.type === 'percentage_only') {
    fee = amount * feeConfig.rate
    if (feeConfig.cap) {
      fee = Math.min(fee, feeConfig.cap)
    }
  } else if (feeConfig.type === 'fixed_only') {
    fee = feeConfig.fixed || 0
  }

  return {
    fee,
    netAmount: amount - fee,
    effectiveRate: fee / amount
  }
}

// Export as calculateFee for dynamic import
export { calculateStripeFee as calculateFee }
