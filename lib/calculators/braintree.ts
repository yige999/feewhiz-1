import { FeeConfig, CalculationResult } from '../types'
import braintreeData from '../fee-data/braintree.json'

export function calculateBraintreeFee(
  amount: number,
  transactionType: string = 'standard',
  region: string = 'domestic'
): CalculationResult {
  const config = braintreeData as unknown as FeeConfig

  let feeConfig = config.fees.domestic?.[transactionType] || config.fees.domestic?.standard

  if (!feeConfig) {
    throw new Error(`Invalid transaction type: ${transactionType}`)
  }

  // Apply international fee if applicable
  if (region === 'international' && config.fees.international?.multi_currency) {
    const baseFee = calculateFee(amount, feeConfig)
    const multiCurrencyFee = amount * config.fees.international.multi_currency.rate

    return {
      amount,
      fee: baseFee.fee + multiCurrencyFee,
      netAmount: amount - (baseFee.fee + multiCurrencyFee),
      effectiveRate: (baseFee.fee + multiCurrencyFee) / amount,
      breakdown: {
        percentageFee: (amount * (feeConfig.rate || 0)) + multiCurrencyFee,
        fixedFee: feeConfig.fixed || 0,
        totalFee: baseFee.fee + multiCurrencyFee
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
  } else if (feeConfig.type === 'fixed_only') {
    fee = feeConfig.fixed || 0
  }

  return {
    fee,
    netAmount: amount - fee,
    effectiveRate: amount > 0 ? fee / amount : 0
  }
}

// Export as calculateFee for dynamic import
export { calculateBraintreeFee as calculateFee }
