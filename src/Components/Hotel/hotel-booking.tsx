"use client"

import { styles } from "../../constants/styles"
import { Search } from "lucide-react"
import hotel from "../../assets/hotel.jpg"
import img1 from "../../assets/curved_img.png"

const hotels = [
  {
    id: 1,
    name: "WestView Hotel",
    price: 460,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Crispan Luxury Apartments",
    price: 450,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Crispan Hotel",
    price: 400,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.3,
  },
  {
    id: 4,
    name: "Valada Hotel and Resorts",
    price: 400,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.6,
  },
  {
    id: 5,
    name: "WestView Hotel",
    price: 400,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Crispan Luxury Apartments",
    price: 450,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Crispan Hotel",
    price: 400,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.4,
  },
  {
    id: 8,
    name: "Valada Hotel and Resorts",
    price: 400,
    image: img1,
    location: "Rayfield, Jos South",
    rating: 4.2,
  },
]

export function HotelBooking() {
  return (
    <main className="min-h-screen pt-0">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${hotel})`,
          }}
        />
        <div className={`${styles.section.container} relative z-10`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mt-48">
            Plan your perfect stay
            <br />
            in Plateau state
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto px-12 py-3 mt-44 bg-[#97E12B] rounded-3xl">
            <input
              type="text"
              placeholder="Select location or city"
              className="flex-1 h-12 px-4 rounded-full bg-white text-gray-900"
            />
            <input
              type="date"
              placeholder="Check in date"
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            />
            <input
              type="date"
              placeholder="Check out date"
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            />
            <input
              type="number"
              placeholder="Number of guests"
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            />
            <button className="h-12 px-8 rounded-full bg-[#5A8E00] text-white font-medium flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className={`${styles.section.container} py-16`}>
        <h2 className="text-3xl font-bold text-black mb-8 text-center">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="cursor-pointer">
              {/* Image Container with Trapezoidal Shape */}
              <div className="relative group mb-4">
                {/* Green border wrapper */}
                <div className="absolute inset-0" />

                {/* Image with rating */}
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-auto object-cover"
                  />
                  {/* Rating badge */}
                  <div className="absolute mr-4 top-3 right-12 bg-black/20 backdrop-blur-[16px]  px-3 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3  text-[#97E12B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[#97E12B] font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{hotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Information - No special styling */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-black">{hotel.name}</h3>
                <span className="text-[#97E12B] text-md font-medium">${hotel.price} per night</span>
              </div>
              <p className="text-gray-600 text-sm">{hotel.location}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

