"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { PaystackButton } from "./PaystackButton"
import { GuideSelector } from "./GuideSelector"
import { useNavigate } from "react-router-dom"

interface BookingFormProps {
  selectedPackage?: string
}

export const BookingForm: React.FC<BookingFormProps> = ({ selectedPackage }) => {
  const navigate = useNavigate()
  const [packageType, setPackageType] = useState(selectedPackage || "")
  const [travelerType, setTravelerType] = useState("solo")
  const [groupSize, setGroupSize] = useState(2)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [formComplete, setFormComplete] = useState(false)
  const [specificRequests, setSpecificRequests] = useState("N/A")
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null)

  useEffect(() => {
    if (selectedPackage) {
      setPackageType(selectedPackage)
    }
  }, [selectedPackage])

  useEffect(() => {
    let basePrice = 0
    switch (packageType) {
      case "Discoverer":
        basePrice = 50 * 1500
        break
      case "Explorer":
        basePrice = 75 * 1500
        break
      case "Adventurer":
        basePrice = 100 * 1500
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
        specificRequests !== "" &&
        selectedGuideId !== null,
    )
  }, [firstName, lastName, email, phoneNumber, packageType, specificRequests, selectedGuideId])

  return (
    <section className="bg-[#141E03] py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 
                        items-start lg:items-center"
        >
          <div
            className="space-y-4 sm:space-y-6 order-2 lg:order-1 
                          lg:mt-0 lg:-mt-32 xl:-mt-56"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[7.5rem] 
                           leading-tight sm:leading-none font-semibold text-[#97E12B]
                           text-center lg:text-left"
            >
              Book a Trip
            </h2>
            <p
              className="text-[#FDFFFB] text-sm sm:text-base md:text-lg 
                          max-w-xl font-light leading-relaxed
                          text-center lg:text-left mx-auto lg:mx-0"
            >
              Experience the beauty and culture of Plateau State with our carefully curated travel packages.
            </p>
          </div>

          <div
            className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] 
                          p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 
                          shadow-xl order-1 lg:order-2
                          mb-4 sm:mb-6 md:mb-8 lg:mb-16 xl:mb-32
                          w-full max-w-2xl mx-auto lg:max-w-none"
          >
            <form className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all bg-[#5A8E00] text-white shadow-md"
                  >
                    Book & Pay Now
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/travel-booking-request")}
                    className="flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all bg-white text-gray-700 border border-gray-300 hover:border-[#97E12B]"
                  >
                    Request Approval First
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Pay now for instant confirmation or request approval if you need flexibility
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-normal text-[#666666]">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md
                               text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                               focus:outline-none transition-all"
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
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md
                               text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                               focus:outline-none transition-all"
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
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md
                               text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                               focus:outline-none transition-all"
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
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md
                               text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                               focus:outline-none transition-all"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-normal text-[#666666]">Package Type</label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md 
                             appearance-none text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                             focus:outline-none transition-all"
                  required
                >
                  <option value="">Select package</option>
                  <option value="Discoverer">Discoverer</option>
                  <option value="Explorer">Explorer</option>
                  <option value="Adventurer">Adventurer</option>
                </select>
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
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md 
                               appearance-none text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                               focus:outline-none transition-all"
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
                <label className="block text-xs sm:text-sm font-normal text-[#666666]">Specific Requests</label>
                <textarea
                  value={specificRequests}
                  onChange={(e) => setSpecificRequests(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-gray-100 border-0 rounded-md
                             text-sm sm:text-base focus:ring-2 focus:ring-[#97E12B] 
                             focus:outline-none transition-all resize-none"
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
                  Total Amount: ₦{totalAmount.toLocaleString()}
                </div>
                {travelerType === "group" && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">For {groupSize} people</div>
                )}
              </div>

              <div className="pt-2 sm:pt-4">
                <PaystackButton
                  amount={totalAmount}
                  email={email}
                  firstName={firstName}
                  lastName={lastName}
                  phoneNumber={phoneNumber}
                  packageType={packageType}
                  travelerType={travelerType}
                  groupSize={travelerType === "group" ? groupSize : undefined}
                  specificRequests={specificRequests}
                  selectedGuideId={selectedGuideId}
                  disabled={!formComplete}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
