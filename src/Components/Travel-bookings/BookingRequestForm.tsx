"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { GuideSelector } from "./GuideSelector"
import axios from "axios"
import { API_URL } from "../../config/api"
import { CheckCircle, Loader2 } from "lucide-react"

interface BookingRequestFormProps {
  selectedPackage?: string
}

export const BookingRequestForm: React.FC<BookingRequestFormProps> = ({ selectedPackage }) => {
  const [packageType, setPackageType] = useState(selectedPackage || "")
  const [travelerType, setTravelerType] = useState("solo")
  const [groupSize, setGroupSize] = useState(2)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [travelDate, setTravelDate] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [formComplete, setFormComplete] = useState(false)
  const [specificRequests, setSpecificRequests] = useState("")
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedPackage) {
      setPackageType(selectedPackage)
    }
  }, [selectedPackage])

  useEffect(() => {
    let basePrice = 0
    switch (packageType) {
      case "Discoverer":
        basePrice = 100 * 1
        break
      case "Explorer":
        basePrice = 100 * 1
        break
      case "Adventurer":
        basePrice = 100 * 1
        break
      default:
        basePrice = 0
    }

    if (travelerType === "group") {
      basePrice *= groupSize
    }

    setTotalAmount(basePrice)
  }, [packageType, travelerType, groupSize])

  useEffect(() => {
    setFormComplete(
      firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        phoneNumber !== "" &&
        packageType !== "" &&
        travelDate !== "" &&
        selectedGuideId !== null,
    )
  }, [firstName, lastName, email, phoneNumber, packageType, travelDate, selectedGuideId])

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const requestData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        packageType,
        travelerType,
        groupSize: travelerType === "group" ? groupSize : 1,
        travelDate,
        specificRequests: specificRequests || "None",
        selectedGuideId,
        totalAmount,
      }

      const response = await axios.post(`${API_URL}/api/booking-requests`, requestData)

      if (response.data.success) {
        setSubmitSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setFirstName("")
          setLastName("")
          setEmail("")
          setPhoneNumber("")
          setPackageType("")
          setTravelDate("")
          setSpecificRequests("")
          setSelectedGuideId(null)
          setSubmitSuccess(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting booking request:", error)
      setSubmitError("Failed to submit booking request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <section className="bg-[#141E03] py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Submitted!</h2>
            <p className="text-gray-600 text-lg mb-4">
              Thank you for your booking request. Our team will review your request and check availability.
            </p>
            <p className="text-gray-600">
              You will receive an email confirmation within 24-48 hours with next steps. If your booking is approved,
              we'll send you a payment link.
            </p>
            <p className="text-sm text-gray-500 mt-6">Reference: {email}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#141E03] py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start lg:items-center">
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1 lg:mt-0 lg:-mt-32 xl:-mt-56">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[7.5rem] leading-tight sm:leading-none font-semibold text-[#97E12B] text-center lg:text-left">
              Request a Trip
            </h2>
            <p className="text-[#FDFFFB] text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Submit your booking request and our team will confirm availability before you pay.
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 shadow-xl order-1 lg:order-2 mb-4 sm:mb-6 md:mb-8 lg:mb-16 xl:mb-32 w-full max-w-2xl mx-auto lg:max-w-none">
            <form onSubmit={handleSubmitRequest} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Package Type</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md appearance-none text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    required
                  >
                    <option value="">Select package</option>
                    <option value="Discoverer">Discoverer</option>
                    <option value="Explorer">Explorer</option>
                    <option value="Adventurer">Adventurer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Preferred Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-normal text-[#666666]">Traveler Details</label>
                <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelerType"
                      value="solo"
                      checked={travelerType === "solo"}
                      onChange={() => setTravelerType("solo")}
                      className="w-4 h-4 text-[#5A8E00] border-gray-300 focus:ring-[#97E12B]"
                    />
                    <span className="text-xs sm:text-sm font-normal text-[#666666]">Solo Trip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelerType"
                      value="group"
                      checked={travelerType === "group"}
                      onChange={() => setTravelerType("group")}
                      className="w-4 h-4 text-[#5A8E00] border-gray-300 focus:ring-[#97E12B]"
                    />
                    <span className="text-xs sm:text-sm font-normal text-[#666666]">Group Trip</span>
                  </label>
                </div>
              </div>

              {travelerType === "group" && (
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">Number of People</label>
                  <select
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md appearance-none text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all"
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2} people
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-normal text-[#666666]">
                  Specific Requests (Optional)
                </label>
                <textarea
                  value={specificRequests}
                  onChange={(e) => setSpecificRequests(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] focus:outline-none transition-all resize-none"
                  placeholder="Any specific requests or requirements?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-normal text-[#666666]">Select Your Guide</label>
                <GuideSelector onSelectGuide={(guideId) => setSelectedGuideId(guideId)} />
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-[#97E12B]">
                <div className="text-lg sm:text-xl font-semibold text-gray-800">
                  Estimated Amount: ₦{totalAmount.toLocaleString()}
                </div>
                {travelerType === "group" && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">For {groupSize} people</div>
                )}
                <p className="text-xs text-gray-500 mt-2">Payment required only after approval</p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {submitError}
                </div>
              )}

              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={!formComplete || isSubmitting}
                  className="w-full px-8 py-3 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
