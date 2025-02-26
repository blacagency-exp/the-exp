"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../../config/api"
import { useNavigate } from "react-router-dom"

interface PaystackButtonProps {
  amount: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  packageType: string
  travelerType: string
  groupSize?: number
  specificRequests: string
  disabled: boolean
}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: {
        key: string
        email: string
        amount: number
        ref: string
        onClose: () => void
        callback: (response: { reference: string }) => void
      }): { openIframe: () => void }
    }
  }
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

export const PaystackButton: React.FC<PaystackButtonProps> = ({
  amount,
  email,
  firstName,
  lastName,
  phoneNumber,
  packageType,
  travelerType,
  groupSize,
  specificRequests,
  disabled,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializePayment = async () => {
    if (!isScriptLoaded) {
      setError("Payment system is still loading. Please try again in a moment.")
      return
    }

    try {
      const response = await axios.post(`${API_URL}/api/initialize-payment`, {
        email,
        amount,
        metadata: {
          firstName,
          lastName,
          phoneNumber,
          packageType,
          travelerType,
          groupSize,
          specificRequests,
        },
      })

      const { data } = response

      if (!data.data || !data.data.authorization_url) {
        throw new Error("Invalid response from payment initialization")
      }

      if (typeof window.PaystackPop === "undefined") {
        throw new Error("Paystack script not loaded properly")
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100,
        ref: data.data.reference,
        onClose: () => {
          setError("Transaction cancelled")
        },
        callback: (response: { reference: string }) => {
          verifyPayment(response.reference)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("Payment initialization failed:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to initialize payment: ${error.response.data.error || error.message}`)
      } else if (error instanceof Error) {
        setError(`Failed to initialize payment: ${error.message}`)
      } else {
        setError("Failed to initialize payment. Please try again.")
      }
    }
  }

  const verifyPayment = async (reference: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/verify-payment/${reference}`)
      const { data } = response
  
      if (data.status === "completed") {
        alert("Payment successful!")
        navigate("/tour")
      } else if (data.status === "pending") {
        setError("Payment is still processing. Please check back later.")
      } else {
        setError(`Payment ${data.status}. ${data.message}`)
      }
    } catch (error) {
      console.error("Payment verification failed:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(`Payment verification failed: ${error.response.data.error || error.message}`)
      } else {
        setError("Payment verification failed. Please contact support.")
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={initializePayment}
        className="px-8 py-2 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || !isScriptLoaded}
      >
        Book Now
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

