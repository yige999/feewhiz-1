import { FeeConfig, CalculationResult } from '../types'
import adyenData from '../fee-data/adyen.json'

export function calculateAdyenFee(
  amount: number,
  transactionType: string = 'card_interchange',
  region: string = 'domestic'
): CalculationResult {
  const config = adyenData as unknown as FeeConfig

  let feeConfig = config.fees.domestic?.[transactionType] || config.fees.domestic?.us_cards || config.fees.domestic?.card_interchange

  if (!feeConfig) {
    throw new Error(`Invalid transaction type: ${transactionType}`)
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
  } else if (feeConfig.type === 'interchange_plus') {
    // For interchange plus, use the provided rate as an estimate
    fee = (amount * feeConfig.rate) + feeConfig.fixed
  }

  return {
    fee,
    netAmount: amount - fee,
    effectiveRate: amount > 0 ? fee / amount : 0
  }
}

// Export as calculateFee for dynamic import
export { calculateAdyenFee as calculateFee }
