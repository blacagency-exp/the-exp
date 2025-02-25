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
  const [totalAmount, setTotalAmount] = useState(0)
  const [formComplete, setFormComplete] = useState(false)
  const [specificRequests, setSpecificRequests] = useState("")

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
        basePrice = 50*1600 // 50,000 Naira
        break
      case "Explorer":
        basePrice = 75 *1600 // 75,000 Naira
        break
      case "Adventurer":
        basePrice = 100 * 1600 // 100,000 Naira
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
    // Check if all required fields are filled
    setFormComplete(
      firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        phoneNumber !== "" &&
        packageType !== "" &&
        specificRequests !== "",
    )
  }, [firstName, lastName, email, phoneNumber, packageType, specificRequests])

  return (
    <section className="bg-[#141E03] py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 -mt-56">
            <h2 className="text-[7.5rem] leading-none font-semibold text-[#97E12B]">Book a Trip</h2>
            <p className="text-[#FDFFFB] text-md max-w-xl font-light leading-relaxed">
              Experience the beauty and culture of Plateau State with our carefully curated travel packages.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-16 shadow-xl mb-32">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Package Type</label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none"
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
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none"
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Specific Requests</label>
                <textarea
                  value={specificRequests}
                  onChange={(e) => setSpecificRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                  placeholder="Any specific requests or requirements?"
                  rows={4}
                ></textarea>
              </div>

              <div className="text-xl font-semibold">Total Amount: ₦{totalAmount.toLocaleString()}</div>

              {formComplete && (
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
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

