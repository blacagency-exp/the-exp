"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  reference?: string
  amount?: number
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose, reference, amount }) => {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. You will be redirected to your tour details in {countdown}{" "}
            seconds.
          </p>
          {reference && (
            <p className="text-sm text-gray-500 mb-2">
              Transaction Reference: <span className="font-medium">{reference}</span>
            </p>
          )}
          {amount && (
            <p className="text-sm text-gray-500 mb-4">
              Amount Paid: <span className="font-medium">₦{(amount / 100).toLocaleString()}</span>
            </p>
          )}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors"
            >
              Continue to Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

