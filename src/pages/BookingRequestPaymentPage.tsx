"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { PageHeader } from "../Components/layout/PageHeader"
import { Loader2, CheckCircle2, XCircle, Calendar, Users, Package, Mail, Phone } from "lucide-react"
import { formatCurrency, type CurrencyCode } from "../utils/currency"

const API_URL = "https://exp-server2.vercel.app"
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

interface BookingRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string // Updated from 'phone' to 'phone_number' to match database column
  package_type: string
  travel_date: string
  group_size: number
  estimated_amount: number
  display_currency?: CurrencyCode
  display_amount?: number
  status: string
  special_requests?: string
  guide_id?: number
}

export function BookingRequestPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const [bookingRequest, setBookingRequest] = useState<BookingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const fetchBookingRequest = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/booking-requests/${id}`)
        const data = response.data

        if (data.status !== "approved") {
          setError(
            data.status === "paid"
              ? "This booking has already been paid for."
              : "This booking request has not been approved yet.",
          )
          setLoading(false)
          return
        }

        setBookingRequest(data)
        setLoading(false)
      } catch (err) {
        console.error("[v0] Error fetching booking request:", err)
        setError("Failed to load booking details. Please check your link and try again.")
        setLoading(false)
      }
    }

    if (id) {
      fetchBookingRequest()
    }
  }, [id])

  const initializePayment = async () => {
    if (!isScriptLoaded || !bookingRequest) {
      setError("Payment system is still loading. Please try again in a moment.")
      return
    }

    setPaymentStatus("processing")

    try {
      const displayCurrency = bookingRequest.display_currency || "NGN"
      const displayAmount = bookingRequest.display_amount || bookingRequest.estimated_amount
      const amountInNGN = bookingRequest.estimated_amount // Already in NGN from backend

      const metadata = {
        booking_request_id: bookingRequest.id,
        full_name: `${bookingRequest.first_name} ${bookingRequest.last_name}`,
        phone_number: bookingRequest.phone_number,
        package_type: bookingRequest.package_type,
        travel_date: bookingRequest.travel_date,
        group_size: bookingRequest.group_size,
        guide_id: bookingRequest.guide_id,
        display_currency: displayCurrency,
        display_amount: displayAmount,
        custom_fields: [
          {
            display_name: "Booking ID",
            variable_name: "booking_request_id",
            value: bookingRequest.id,
          },
          {
            display_name: "Package",
            variable_name: "package_type",
            value: bookingRequest.package_type,
          },
          {
            display_name: "Travel Date",
            variable_name: "travel_date",
            value: bookingRequest.travel_date,
          },
          {
            display_name: "Group Size",
            variable_name: "group_size",
            value: bookingRequest.group_size.toString(),
          },
        ],
      }

      const response = await axios.post(`${API_URL}/api/booking-requests/${bookingRequest.id}/initialize-payment`, {
        email: bookingRequest.email,
        amount: amountInNGN, // Paystack always receives NGN
        metadata,
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
        email: bookingRequest.email,
        amount: amountInNGN * 100, // Paystack amount in kobo (NGN)
        metadata,
        ref: data.data.reference,
        onClose: () => {
          setPaymentStatus("idle")
          setError("Transaction cancelled")
        },
        callback: (response: { reference: string }) => {
          verifyPayment(response.reference)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("[v0] Payment initialization failed:", error)
      setPaymentStatus("failed")
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
      const response = await axios.post(`${API_URL}/api/booking-requests/${bookingRequest?.id}/verify-payment`, {
        reference,
      })

      const { data } = response

      if (data.status === "success") {
        setPaymentStatus("success")
      } else {
        setPaymentStatus("failed")
        setError(`Payment ${data.status}. ${data.message}`)
      }
    } catch (error) {
      console.error("[v0] Payment verification failed:", error)
      setPaymentStatus("failed")
      setError("Payment verification failed. Please contact support with your payment reference.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5A8E00]" />
        </div>
      </div>
    )
  }

  if (error && !bookingRequest) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Booking</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-green-600 mb-6">
              Thank you for your payment. Your booking has been confirmed and you will receive a confirmation email
              shortly.
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="font-mono font-semibold text-gray-800">{bookingRequest?.id}</p>
            </div>
            <a
              href="/"
              className="inline-block bg-[#5A8E00] text-white px-6 py-3 rounded-md hover:bg-[#4A7500] transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader />
      <div className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Booking Payment</h1>
            <p className="text-gray-600 mb-8">Your booking has been approved. Please complete payment to confirm.</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Booking Approved</p>
                  <p className="text-sm text-green-700">
                    Your request has been reviewed and approved by our team. Complete payment to secure your booking.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-800">
                      {bookingRequest?.first_name} {bookingRequest?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{bookingRequest?.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{bookingRequest?.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Package className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Package</p>
                    <p className="font-semibold text-gray-800">{bookingRequest?.package_type}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Travel Date</p>
                    <p className="font-semibold text-gray-800">
                      {bookingRequest?.travel_date
                        ? new Date(bookingRequest.travel_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Group Size</p>
                    <p className="font-semibold text-gray-800">{bookingRequest?.group_size} people</p>
                  </div>
                </div>
              </div>

              {bookingRequest?.special_requests && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                  <p className="text-gray-800">{bookingRequest.special_requests}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              {bookingRequest?.display_currency && bookingRequest.display_currency !== "NGN" && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Package Amount ({bookingRequest.display_currency})</span>
                    <span className="text-gray-800">
                      {formatCurrency(bookingRequest.display_amount || 0, bookingRequest.display_currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
                    <span className="text-gray-600">Converted to NGN</span>
                    <span className="text-gray-800">₦{bookingRequest.estimated_amount.toLocaleString()}</span>
                  </div>
                </>
              )}
              {(!bookingRequest?.display_currency || bookingRequest.display_currency === "NGN") && (
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
                  <span className="text-gray-600">Package Amount</span>
                  <span className="text-gray-800">₦{bookingRequest?.estimated_amount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount (NGN)</span>
                  <span className="text-2xl font-bold text-[#5A8E00]">
                    ₦{bookingRequest?.estimated_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {error && paymentStatus === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={initializePayment}
                disabled={paymentStatus === "processing" || !isScriptLoaded}
                className="flex-1 bg-[#5A8E00] text-white px-8 py-4 rounded-lg hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {paymentStatus === "processing" ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₦${bookingRequest?.estimated_amount.toLocaleString()}`
                )}
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center mt-6">
              Secure payment powered by Paystack. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
