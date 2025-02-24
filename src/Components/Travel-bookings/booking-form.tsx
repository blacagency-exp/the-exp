"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { PaystackButton } from "./PaystackButton"

interface BookingFormProps {
  selectedPackage?: string
}

export const BookingForm: React.FC<BookingFormProps> = ({ selectedPackage }) => {
  const [packageType, setPackageType] = useState(selectedPackage || "")
  const [travelerType, setTravelerType] = useState("solo")
  const [groupSize, setGroupSize] = useState(2)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [accommodation, setAccommodation] = useState("")
  const [specificRequests, setSpecificRequests] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (selectedPackage) {
      setPackageType(selectedPackage)
    }
  }, [selectedPackage])

  useEffect(() => {
    // Calculate total amount based on selected options
    let basePrice = 0
    switch (packageType) {
      case "Discoverer":
        basePrice = 50000 // 50,000 Naira
        break
      case "Explorer":
        basePrice = 75000 // 75,000 Naira
        break
      case "Adventurer":
        basePrice = 100000 // 100,000 Naira
        break
      default:
        basePrice = 0
    }

    if (travelerType === "group") {
      basePrice *= groupSize
    }

    setTotalAmount(basePrice)
  }, [packageType, travelerType, groupSize])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form validation would go here
    // If form is valid, the PaystackButton will be displayed
  }

  return (
    <section className="bg-[#141E03] py-24 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 -mt-56">
            <h2 className="text-[7.5rem] leading-none font-semibold text-[#97E12B]">Book a Trip</h2>
            <p className="text-[#FDFFFB] text-md max-w-xl font-light leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-16 shadow-xl mb-32">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Arrival Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Package Type</label>
                <select
                  className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  required
                >
                  <option value="">Select package</option>
                  <option value="Discoverer">Discoverer</option>
                  <option value="Explorer">Explorer</option>
                  <option value="Adventurer">Adventurer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Traveler Details</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="travelerType"
                      value="solo"
                      checked={travelerType === "solo"}
                      onChange={() => setTravelerType("solo")}
                      className="w-4 h-4 text-[#5A8E00] border-gray-300"
                    />
                    <span className="text-sm font-normal text-[#666666]">Solo Trip</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="travelerType"
                      value="group"
                      checked={travelerType === "group"}
                      onChange={() => setTravelerType("group")}
                      className="w-4 h-4 text-[#5A8E00] border-gray-300"
                    />
                    <span className="text-sm font-normal text-[#666666]">Group Trip</span>
                  </label>
                </div>
              </div>

              {travelerType === "group" && (
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Number of People</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none"
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Accommodation Preferences</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none"
                    value={accommodation}
                    onChange={(e) => setAccommodation(e.target.value)}
                    required
                  >
                    <option value="">Select accommodation</option>
                    <option value="hotel">Hotel</option>
                    <option value="resort">Resort</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Specific Requests</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md min-h-[120px] resize-none"
                  placeholder="Any specific requirements or requests..."
                  value={specificRequests}
                  onChange={(e) => setSpecificRequests(e.target.value)}
                />
              </div>

              <div className="text-xl font-semibold">Total Amount: ₦{totalAmount.toLocaleString()}</div>

              <PaystackButton
                amount={totalAmount}
                email={email}
                firstName={firstName}
                lastName={lastName}
                phoneNumber={phoneNumber}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

