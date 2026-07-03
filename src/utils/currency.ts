// Currency utilities for multi-currency support

export type CurrencyCode = "NGN" | "USD" | "GBP" | "CAD"

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
  toNGN: number // Exchange rate to Nigerian Naira
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    toNGN: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    toNGN: 1500, // 1 USD = 1500 NGN (update with current rates)
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    toNGN: 1900, // 1 GBP = 1900 NGN (update with current rates)
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    toNGN: 1100, // 1 CAD = 1100 NGN (update with current rates)
  },
}

export async function detectUserCurrency(): Promise<CurrencyCode> {
  try {
    // Try to detect based on timezone first
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (timezone.includes("America/Toronto") || timezone.includes("America/Vancouver")) {
      return "CAD"
    }
    if (timezone.includes("Europe/London")) {
      return "GBP"
    }
    if (timezone.includes("America/New_York") || timezone.includes("America/Los_Angeles")) {
      return "USD"
    }
    if (timezone.includes("Africa/Lagos")) {
      return "NGN"
    }

    // Fallback to IP-based detection
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    const countryCode = data.country_code

    switch (countryCode) {
      case "NG":
        return "NGN"
      case "US":
        return "USD"
      case "GB":
        return "GBP"
      case "CA":
        return "CAD"
      default:
        return "NGN" // Default to Nigerian Naira
    }
  } catch (error) {
    console.error("[v0] Error detecting currency:", error)
    return "NGN" // Default to Nigerian Naira on error
  }
}

export function convertCurrency(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  const fromRate = CURRENCIES[fromCurrency].toNGN
  const toRate = CURRENCIES[toCurrency].toNGN

  // Convert to NGN first, then to target currency
  const amountInNGN = amount * fromRate
  const convertedAmount = amountInNGN / toRate

  return Math.round(convertedAmount * 100) / 100
}

export function convertToNGN(amount: number, fromCurrency: CurrencyCode): number {
  return Math.round(amount * CURRENCIES[fromCurrency].toNGN)
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyInfo = CURRENCIES[currency]
  return `${currencyInfo.symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export function getBasePrice(packageType: string): number {
  switch (packageType) {
    case "Discoverer":
      return 100 // ₦100 NGN (test price — revert to: 100 USD)
    case "Explorer":
      return 100 // ₦100 NGN (test price — revert to: 200 USD)
    case "Adventurer":
      return 100 // ₦100 NGN (test price — revert to: 400 USD)
    default:
      return 0
  }
}
