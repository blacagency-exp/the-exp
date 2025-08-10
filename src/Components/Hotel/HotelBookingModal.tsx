"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Users, MapPin, Star, Wifi, Car, Utensils, Dumbbell } from "lucide-react"
import axios from "axios"
import { API_URL } from "../../config/api"
// Import the unified types
import "../../types/paystack-global"

interface RoomType {
  id: number
  name: string
  description: string
  base_price: number
  display_price: number
  max_occupancy: number
  amenities: string[]
  available_rooms: number
}

interface Hotel {
  id: number
  name: string
  location: string
  description: string
  image_url: string
  rating: number
  contact_email: string
  contact_phone: string
  address: string
  amenities: string[]
  room_types: RoomType[]
}

interface HotelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  hotel: Hotel | null
  onBookingSuccess: (bookingReference: string) => void
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

// Amenity icons mapping
const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Parking: Car,
  Restaurant: Utensils,
  Gym: Dumbbell,
  Pool: "🏊",
  Spa: "🧖",
  Bar: "🍺",
  "Conference Room": "🏢",
  Kitchen: "🍳",
  Laundry: "👕",
  Security: "🔒",
  "Room Service": "🛎️",
  AC: "❄️",
  TV: "📺",
  "Mini Fridge": "🧊",
  Balcony: "🏞️",
}

export function HotelBookingModal({ isOpen, onClose, hotel, onBookingSuccess }: HotelBookingModalProps) {
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
  const [specialRequests, setSpecialRequests] = useState("")
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [numberOfNights, setNumberOfNights] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

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

  // Calculate number of nights and total amount
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoomType) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (nights > 0) {
        setNumberOfNights(nights)
        const roomTotal = nights * selectedRoomType.display_price
        const platformFee = roomTotal * 0.1 // 10% platform fee
        setTotalAmount(roomTotal + platformFee)
      } else {
        setNumberOfNights(0)
        setTotalAmount(0)
      }
    }
  }, [checkInDate, checkOutDate, selectedRoomType])

  const isFormValid = () => {
    return (
      guestName.trim() &&
      guestEmail.trim() &&
      guestPhone.trim() &&
      checkInDate &&
      checkOutDate &&
      selectedRoomType &&
      numberOfGuests > 0 &&
      numberOfNights > 0
    )
  }

  const initializePayment = async () => {
    if (!isScriptLoaded || !isFormValid()) {
      setError("Please fill in all required fields.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Prepare booking data with correct property names matching backend
      const bookingData = {
        guestName,
        guestEmail,
        guestPhone,
        hotelId: hotel?.id,
        roomTypeId: selectedRoomType?.id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        numberOfNights,
        totalAmount,
        specialRequests,
      }

      console.log("Sending booking data:", bookingData)

      const response = await axios.post(`${API_URL}/api/initialize-hotel-booking`, bookingData)
      const { data } = response

      if (!data.data || !data.data.authorization_url) {
        throw new Error("Invalid response from payment initialization")
      }

      const metadata = {
        hotel_name: hotel?.name,
        room_type: selectedRoomType?.name,
        check_in: checkInDate,
        check_out: checkOutDate,
        nights: numberOfNights,
        guests: numberOfGuests,
        booking_type: "hotel_booking",
        custom_fields: [
          {
            display_name: "Hotel Name",
            variable_name: "hotel_name",
            value: hotel?.name || "",
          },
          {
            display_name: "Room Type",
            variable_name: "room_type",
            value: selectedRoomType?.name || "",
          },
          {
            display_name: "Check-in Date",
            variable_name: "check_in",
            value: checkInDate,
          },
          {
            display_name: "Check-out Date",
            variable_name: "check_out",
            value: checkOutDate,
          },
          {
            display_name: "Number of Nights",
            variable_name: "nights",
            value: numberOfNights.toString(),
          },
        ],
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: guestEmail,
        amount: totalAmount * 100, // Convert to kobo
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
      const response = await axios.get(`${API_URL}/api/verify-hotel-booking/${reference}`)
      const { data } = response

      if (data.status === "completed") {
        onBookingSuccess(data.bookingReference)
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

  const renderAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity]
    if (typeof IconComponent === "string") {
      return <span className="text-sm">{IconComponent}</span>
    } else if (IconComponent) {
      return <IconComponent className="w-4 h-4" />
    }
    return <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
  }

  if (!isOpen || !hotel) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={hotel.image_url || "/placeholder.svg"}
                alt={hotel.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.location}</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
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

          {/* Hotel Description and Amenities */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{hotel.description}</p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {renderAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Room Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.room_types?.map((roomType) => (
                <div
                  key={roomType.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedRoomType?.id === roomType.id
                      ? "border-[#5A8E00] bg-[#5A8E00]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRoomType(roomType)}
                >
                  <h4 className="font-semibold text-lg">{roomType.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{roomType.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Up to {roomType.max_occupancy} guests</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {roomType.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {roomType.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{roomType.amenities.length - 3} more</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#5A8E00]">₦{roomType.display_price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Guest Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                  placeholder="+234 XXX XXX XXXX"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                <select
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                  disabled={isProcessing}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5A8E00] focus:border-transparent"
                  rows={3}
                  placeholder="Any special requests or requirements..."
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedRoomType && numberOfNights > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-medium">{selectedRoomType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Nights:</span>
                  <span className="font-medium">{numberOfNights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Night:</span>
                  <span className="font-medium">₦{selectedRoomType.display_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Total:</span>
                  <span className="font-medium">
                    ₦{(selectedRoomType.display_price * numberOfNights).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (10%):</span>
                  <span className="font-medium">
                    ₦{(selectedRoomType.display_price * numberOfNights * 0.1).toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#5A8E00]">₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Book Now Button */}
          <div className="mt-6">
            <button
              onClick={initializePayment}
              disabled={!isFormValid() || !isScriptLoaded || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5A8E00] text-white rounded-lg hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Book Now - ₦{totalAmount.toLocaleString()}
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Secure payment powered by Paystack</p>
          </div>
        </div>
      </div>
    </div>
  )
}
