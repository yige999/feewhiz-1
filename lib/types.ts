// Platform and fee calculation types

export type PlatformId = 'paypal' | 'stripe' | 'square' | 'adyen' | 'braintree' | 'authorize-net'

export interface FeeType {
  rate: number           // Percentage rate (e.g., 0.029 for 2.9%)
  fixed: number          // Fixed fee (e.g., 0.30)
  type: 'percentage_plus_fixed' | 'fixed_only' | 'percentage_only'
}

export interface FeeConfig {
  platform: PlatformId
  name: string
  source_url: string
  last_checked: string
  base_currency: string
  fees: {
    domestic?: {
      standard?: FeeType
      [key: string]: FeeType | undefined
    }
    international?: {
      standard?: FeeType
      [key: string]: FeeType | undefined
    }
  }
  transaction_types: TransactionType[]
  regions: Region[]
  todos: string[]  // Unclear rules marked here
}

export interface TransactionType {
  id: string
  name: string
  description?: string
}

export interface Region {
  id: string
  name: string
}

export interface CalculationResult {
  amount: number
  fee: number
  netAmount: number
  effectiveRate: number
  breakdown: {
    percentageFee: number
    fixedFee: number
    totalFee: number
  }
}

export interface Platform {
  id: PlatformId
  name: string
  slug: string
  scenarios: string[]  // Transaction type slugs
}

// Comparison page types
export interface ComparisonData {
  platformA: PlatformId
  platformB: PlatformId
  nameA: string
  nameB: string
  feesA: FeeConfig
  feesB: FeeConfig
}
