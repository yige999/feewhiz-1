import { FeeConfig, CalculationResult } from '../types'
import paypalData from '../fee-data/paypal.json'

export function calculatePayPalFee(
  amount: number,
  transactionType: string = 'standard',
  region: string = 'domestic'
): CalculationResult {
  const config = paypalData as unknown as FeeConfig

  let feeConfig = config.fees.domestic?.[transactionType] || config.fees.domestic?.standard

  if (!feeConfig) {
    throw new Error(`Invalid transaction type: ${transactionType}`)
  }

  // Apply international fee if applicable
  if (region === 'international' && config.fees.international?.additional_fee) {
    const internationalRate = config.fees.international.additional_fee.rate
    // Combine rates
    const baseFee = calculateFee(amount, feeConfig)
    const internationalFee = amount * internationalRate

    return {
      amount,
      fee: baseFee.fee + internationalFee,
      netAmount: amount - (baseFee.fee + internationalFee),
      effectiveRate: (baseFee.fee + internationalFee) / amount,
      breakdown: {
        percentageFee: (amount * (feeConfig.rate || 0)) + (amount * internationalRate),
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

  // Ensure minimum fee if applicable
  if (feeConfig.min_fee !== undefined) {
    fee = Math.max(fee, feeConfig.min_fee)
  }

  return {
    fee,
    netAmount: amount - fee,
    effectiveRate: fee / amount
  }
}

// Export as calculateFee for dynamic import
export { calculatePayPalFee as calculateFee }
