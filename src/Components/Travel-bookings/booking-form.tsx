"use client"

export function BookingForm() {
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
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Last Name"
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
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Arrival Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Departure Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Traveler Details</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="travelerType"
                      value="solo"
                      defaultChecked
                      className="w-4 h-4 text-[#5A8E00] border-gray-300"
                    />
                    <span className="text-sm font-normal text-[#666666]">Solo Trip</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="travelerType"
                      value="group"
                      className="w-4 h-4 text-[#5A8E00] border-gray-300"
                    />
                    <span className="text-sm font-normal text-[#666666]">Group Trip</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="travelerType"
                      value="family"
                      className="w-4 h-4 text-[#5A8E00] border-gray-300"
                    />
                    <span className="text-sm font-normal text-[#666666]">Family Trip</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Accommodation Preferences</label>
                  <select className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none">
                    <option value="">Select accommodation</option>
                    <option value="hotel">Hotel</option>
                    <option value="resort">Resort</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-[#666666]">Add ons</label>
                  <select className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md appearance-none">
                    <option value="">Select add ons</option>
                    <option value="transport">Airport Transfer</option>
                    <option value="guide">Tour Guide</option>
                    <option value="meals">All Meals</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#666666]">Specific Requests</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-100 border-0 rounded-md min-h-[120px] resize-none"
                  placeholder="Any specific requirements or requests..."
                />
              </div>

              <button
                type="submit"
                className="px-8 py-2 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

