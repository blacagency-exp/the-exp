"use client"

import type React from "react"
import { useState } from "react"
import { X, Key, ArrowRight, Clock, AlertTriangle } from "lucide-react"
import axios from "axios"
import { API_URL } from "../../config/api"

interface AccessCodeModalProps {
  isOpen: boolean
  onClose: () => void
  tourId: number
  tourName: string
  onAccessGranted: () => void
  onPurchaseAccess: () => void
}

export function AccessCodeModal({
  isOpen,
  onClose,
  tourId,
  tourName,
  onAccessGranted,
  onPurchaseAccess,
}: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  const verifyAccessCode = async () => {
    if (!accessCode.trim()) {
      setError("Please enter your access code")
      return
    }

    setIsVerifying(true)
    setError(null)
    setIsExpired(false)

    try {
      const response = await axios.post(`${API_URL}/api/verify-access-code`, {
        accessCode: accessCode.trim(),
        tourId,
      })

      if (response.data.success) {
        onAccessGranted()
        onClose()
      } else {
        if (response.data.expired) {
          setIsExpired(true)
          setError("Your access code has expired. Access is valid for 24 hours after purchase.")
        } else {
          setError(response.data.message || "Invalid access code")
        }
      }
    } catch (error) {
      console.error("Access code verification failed:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Failed to verify access code")
      } else {
        setError("Failed to verify access code. Please try again.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyAccessCode()
    }
  }

  const handlePurchaseAccess = () => {
    onClose() // Close access code modal
    onPurchaseAccess() // Open payment modal
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#97E12B] rounded-lg">
                <Key className="w-5 h-5 text-[#1A2E0D]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Enter Access Code</h2>
                <p className="text-sm text-gray-600">{tourName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isVerifying}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 24-hour expiration notice */}
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24-Hour Access</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Access codes are valid for 24 hours after purchase. After expiration, you'll need to purchase access
              again.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Code</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#97E12B] focus:border-transparent text-center text-lg font-mono tracking-wider"
              placeholder="ENTER-CODE-HERE"
              disabled={isVerifying}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Enter the access code you received via email</p>
          </div>

          {error && (
            <div
              className={`mb-4 p-3 border rounded-lg ${
                isExpired ? "bg-red-50 border-red-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {isExpired && <AlertTriangle className="w-4 h-4 text-red-600" />}
                <p className="text-sm text-red-600">{error}</p>
              </div>
              {isExpired && (
                <button
                  onClick={handlePurchaseAccess}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
                >
                  Purchase new access →
                </button>
              )}
            </div>
          )}

          <button
            onClick={verifyAccessCode}
            disabled={!accessCode.trim() || isVerifying}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5A8E00] text-white rounded-lg hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Unlock Tour
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Don't have an access code?{" "}
              <button onClick={handlePurchaseAccess} className="text-[#5A8E00] hover:underline font-medium">
                Purchase access
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
