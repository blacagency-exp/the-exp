"use client"

import { useEffect, useState } from "react"
import { detectUserCurrency, type CurrencyCode, CURRENCIES } from "../utils/currency"

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>("NGN")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCurrency = async () => {
      const detectedCurrency = await detectUserCurrency()
      setCurrency(detectedCurrency)
      setIsLoading(false)
    }

    loadCurrency()
  }, [])

  return {
    currency,
    setCurrency,
    currencyInfo: CURRENCIES[currency],
    isLoading,
  }
}
