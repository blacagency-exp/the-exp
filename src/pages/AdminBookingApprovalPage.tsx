/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { PageHeader } from "../Components/layout/PageHeader"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

const API_URL = "https://exp-server2.vercel.app"

export default function AdminBookingApprovalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/booking-requests/${id}`)
      setBooking(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching booking:", error)
      setError("Failed to load booking details")
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!adminNotes.trim()) {
      setError("Please add notes before approving")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      await axios.post(`${API_URL}/api/booking-requests/${id}/approve`, {
        adminNotes,
      })
      setSuccess(true)
      setTimeout(() => navigate("/admin/bookings"), 3000)
    } catch (error) {
      console.error("Error approving booking:", error)
      setError("Failed to approve booking. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#5A8E00]" />
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center h-[80vh] px-4">
          <CheckCircle className="w-16 h-16 text-[#97E12B] mb-4" />
          <h2 className="text-2xl font-bold text-[#5A8E00] mb-2">Booking Approved Successfully!</h2>
          <p className="text-gray-600 text-center">The customer will receive a payment link via email.</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to bookings dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border-2 border-[#5A8E00] shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#5A8E00] mb-6">Approve Booking Request</h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold">
                  {booking?.first_name} {booking?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{booking?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{booking?.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Package</p>
                <p className="font-semibold">{booking?.package_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Travel Date</p>
                <p className="font-semibold">{new Date(booking?.travel_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Group Size</p>
                <p className="font-semibold">{booking?.group_size} people</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-[#5A8E00]">₦{booking?.estimated_amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">{booking?.status}</p>
              </div>
            </div>

            {booking?.specific_requests && (
              <div>
                <p className="text-sm text-gray-600">Special Requests</p>
                <p className="font-semibold">{booking.specific_requests}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="adminNotes" className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Notes (Required) *
            </label>
            <textarea
              id="adminNotes"
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes about availability, special arrangements, or confirmation details..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5A8E00] focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={submitting || !adminNotes.trim()}
              className="flex-1 bg-[#97E12B] hover:bg-[#5A8E00] text-[#141E03] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Approve Booking
                </>
              )}
            </button>
            <button
              onClick={() => navigate(`/admin/booking-requests/${id}/reject`)}
              disabled={submitting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Reject Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
