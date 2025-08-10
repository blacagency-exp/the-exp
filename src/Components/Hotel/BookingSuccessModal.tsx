"use client"

import { CheckCircle, X } from "lucide-react"

interface BookingSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  bookingReference: string
}

export function BookingSuccessModal({ isOpen, onClose, bookingReference }: BookingSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-700 mb-2">Your booking reference:</p>
            <p className="text-xl font-bold text-green-800 font-mono tracking-wider">{bookingReference}</p>
          </div>

          <p className="text-gray-600 mb-4">
            Your hotel booking has been successfully confirmed! You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Our team will coordinate with the hotel within 2 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>You'll receive final confirmation with check-in details within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Present this confirmation at the hotel reception on arrival</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Need assistance?</h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>📞 Phone: +234 XXX XXX XXXX</p>
            <p>✉️ Email: bookings@experienceplateau.com</p>
            <p>⏰ Support Hours: Monday-Friday, 9am-5pm</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#5A8E00] text-white py-3 px-4 rounded-lg hover:bg-[#4A7500] transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}
