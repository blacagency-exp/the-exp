"use client"

import { useEffect, useState } from "react"
import { X, Lock, CreditCard, Clock } from "lucide-react"
import axios from "axios"
import { API_URL } from "../../config/api"
// Import the unified types
import "../../types/paystack-global"

interface VirtualTourPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  tourId: number
  tourName: string
  tourPrice: number
  onPaymentSuccess: (accessCode: string) => void
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

export function VirtualTourPaymentModal({
  isOpen,
  onClose,
  tourId,
  tourName,
  tourPrice,
  onPaymentSuccess,
}: VirtualTourPaymentModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formComplete, setFormComplete] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    setFormComplete(firstName !== "" && lastName !== "" && email !== "" && phoneNumber !== "")
  }, [firstName, lastName, email, phoneNumber])

  const initializePayment = async () => {
    if (!isScriptLoaded || !formComplete) {
      setError("Please fill in all required fields.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Virtual tour specific metadata - no travel booking fields
      const metadata = {
        tour_id: tourId,
        tour_name: tourName,
        full_name: `${firstName} ${lastName}`,
        phone_number: phoneNumber,
        payment_type: "virtual_tour", // Identify this as a virtual tour payment
        custom_fields: [
          {
            display_name: "Tour Name",
            variable_name: "tour_name",
            value: tourName,
          },
          {
            display_name: "Full Name",
            variable_name: "full_name",
            value: `${firstName} ${lastName}`,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: phoneNumber,
          },
          {
            display_name: "Tour ID",
            variable_name: "tour_id",
            value: tourId.toString(),
          },
          {
            display_name: "Payment Type",
            variable_name: "payment_type",
            value: "Virtual Tour Access (24h)",
          },
        ],
      }

      const response = await axios.post(`${API_URL}/api/initialize-virtual-tour-payment`, {
        email,
        amount: tourPrice,
        tourId,
        tourName,
        firstName,
        lastName,
        phoneNumber,
        metadata,
      })

      const { data } = response

      if (!data.data || !data.data.authorization_url) {
        throw new Error("Invalid response from payment initialization")
      }

      // Store email for future access checks
      localStorage.setItem("userEmail", email)

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: tourPrice * 100,
        metadata,
        ref: data.data.reference,
        onClose: () => {
          setIsProcessing(false)
          setError("Transaction cancelled")
        },
        callback: (response: { reference: string }) => {
          verifyPayment(response.reference)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("Payment initialization failed:", error)
      setIsProcessing(false)
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
      const response = await axios.get(`${API_URL}/api/verify-virtual-tour-payment/${reference}`)
      const { data } = response

      if (data.status === "success" || data.status === "completed") {
        onPaymentSuccess(data.accessCode)
        onClose()
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
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#97E12B] rounded-lg">
                <Lock className="w-5 h-5 text-[#1A2E0D]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Unlock Virtual Tour</h2>
                <p className="text-sm text-gray-600">{tourName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 24-hour access notice */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24-Hour Access Period</span>
            </div>
            <p className="text-xs text-orange-600">
              Your access will be valid for 24 hours from the time of purchase. After expiration, you'll need to
              purchase access again to view the tour.
            </p>
          </div>

          <div className="mb-6 p-4 bg-[#97E12B] bg-opacity-10 rounded-lg border border-[#97E12B] border-opacity-20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Tour Price:</span>
              <span className="text-lg font-bold text-[#1A2E0D]">₦{tourPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">Get 24-hour access to the full virtual tour experience</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#97E12B] focus:border-transparent"
                  placeholder="First Name"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#97E12B] focus:border-transparent"
                  placeholder="Last Name"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#97E12B] focus:border-transparent"
                placeholder="your@email.com"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#97E12B] focus:border-transparent"
                placeholder="+234 XXX XXX XXXX"
                required
                disabled={isProcessing}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={initializePayment}
              disabled={!formComplete || !isScriptLoaded || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5A8E00] text-white rounded-lg hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₦{tourPrice.toLocaleString()} • 24h Access
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Secure payment powered by Paystack</p>
          </div>
        </div>
      </div>
    </div>
  )
}
