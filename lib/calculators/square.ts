import { FeeConfig, CalculationResult } from '../types'
import squareData from '../fee-data/square.json'

export function calculateSquareFee(
  amount: number,
  transactionType: string = 'in-person',
  region: string = 'domestic'
): CalculationResult {
  const config = squareData as unknown as FeeConfig

  let feeConfig = config.fees.domestic?.[transactionType] || config.fees.domestic?.in_person

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
    // Apply minimum fee if applicable
    if (feeConfig.fixed && fee < feeConfig.fixed) {
      fee = feeConfig.fixed
    }
    // Apply cap if applicable
    if (feeConfig.cap) {
      fee = Math.min(fee, feeConfig.cap)
    }
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
    effectiveRate: amount > 0 ? fee / amount : 0
  }
}

// Export as calculateFee for dynamic import
export { calculateSquareFee as calculateFee }
