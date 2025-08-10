"use client"

import { useState, useEffect } from "react"
import { styles } from "../../constants/styles"
import { Search, Star, MapPin, Wifi, Car, Utensils, Dumbbell } from "lucide-react"
import hotel from "../../assets/hotel.jpg"
import { HotelBookingModal } from "./HotelBookingModal"
import { BookingSuccessModal } from "./BookingSuccessModal"
import axios from "axios"
import { API_URL } from "../../config/api"

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

// Fallback hotel data (will be replaced by API data)
const fallbackHotels: Hotel[] = [
  {
    id: 1,
    name: "WestView Hotel",
    location: "Rayfield, Jos South",
    description: "A luxurious hotel with stunning views of the Jos plateau",
    image_url: hotel,
    rating: 4.5,
    contact_email: "info@westviewhotel.com",
    contact_phone: "+234-XXX-XXX-XXXX",
    address: "Rayfield Road, Jos South, Plateau State",
    amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Parking"],
    room_types: [
      {
        id: 1,
        name: "Standard Room",
        description: "Comfortable room with essential amenities",
        base_price: 20000,
        display_price: 22000,
        max_occupancy: 2,
        amenities: ["AC", "TV", "WiFi", "Mini Fridge"],
        available_rooms: 5,
      },
      {
        id: 2,
        name: "Deluxe Room",
        description: "Spacious room with premium amenities",
        base_price: 30000,
        display_price: 33000,
        max_occupancy: 2,
        amenities: ["AC", "TV", "WiFi", "Mini Fridge", "Balcony", "Room Service"],
        available_rooms: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Crispan Luxury Apartments",
    location: "Rayfield, Jos South",
    description: "Premium serviced apartments for extended stays",
    image_url: hotel,
    rating: 4.8,
    contact_email: "bookings@crispanluxury.com",
    contact_phone: "+234-XXX-XXX-XXXX",
    address: "Rayfield Estate, Jos South, Plateau State",
    amenities: ["WiFi", "Kitchen", "Laundry", "Security", "Parking"],
    room_types: [
      {
        id: 3,
        name: "Studio Apartment",
        description: "Self-contained studio with kitchenette",
        base_price: 25000,
        display_price: 27500,
        max_occupancy: 2,
        amenities: ["AC", "TV", "WiFi", "Full Kitchen", "Washing Machine"],
        available_rooms: 4,
      },
    ],
  },
  {
    id: 3,
    name: "Plateau Suites",
    location: "Jos North",
    description: "Modern business hotel in the heart of Jos",
    image_url: hotel,
    rating: 4.2,
    contact_email: "reservations@plateausuites.com",
    contact_phone: "+234-XXX-XXX-XXXX",
    address: "Ahmadu Bello Way, Jos North, Plateau State",
    amenities: ["WiFi", "Restaurant", "Conference Room", "Parking", "Bar"],
    room_types: [
      {
        id: 4,
        name: "Business Room",
        description: "Perfect for business travelers",
        base_price: 18000,
        display_price: 20000,
        max_occupancy: 2,
        amenities: ["AC", "TV", "WiFi", "Work Desk", "Coffee Maker"],
        available_rooms: 8,
      },
    ],
  },
  {
    id: 4,
    name: "Highland Resort",
    location: "Vom, Jos South",
    description: "Scenic resort perfect for relaxation and events",
    image_url: hotel,
    rating: 4.7,
    contact_email: "bookings@highlandresort.com",
    contact_phone: "+234-XXX-XXX-XXXX",
    address: "Vom Road, Jos South, Plateau State",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Event Hall", "Parking"],
    room_types: [
      {
        id: 5,
        name: "Resort Room",
        description: "Comfortable room with resort amenities",
        base_price: 35000,
        display_price: 38500,
        max_occupancy: 3,
        amenities: ["AC", "TV", "WiFi", "Mini Fridge", "Balcony", "Pool Access"],
        available_rooms: 6,
      },
    ],
  },
]

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
}

export function HotelBooking() {
  const [hotels, setHotels] = useState<Hotel[]>(fallbackHotels)
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(fallbackHotels)
  const [searchLocation, setSearchLocation] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch hotels from API
  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/hotels`)
      if (response.data && response.data.length > 0) {
        // Map API data to use the hotel image
        const hotelsWithImages = response.data.map((hotelItem: Hotel) => ({
          ...hotelItem,
          image_url: hotel, // Use the imported hotel image
        }))
        setHotels(hotelsWithImages)
        setFilteredHotels(hotelsWithImages)
      } else {
        // Use fallback data if API returns empty
        setHotels(fallbackHotels)
        setFilteredHotels(fallbackHotels)
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
      // Use fallback data on error
      setHotels(fallbackHotels)
      setFilteredHotels(fallbackHotels)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setFilteredHotels(hotels)
      return
    }

    const filtered = hotels.filter(
      (hotelItem) =>
        hotelItem.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        hotelItem.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        hotelItem.address.toLowerCase().includes(searchLocation.toLowerCase()),
    )
    setFilteredHotels(filtered)
  }

  const handleHotelClick = (hotelItem: Hotel) => {
    setSelectedHotel(hotelItem)
    setBookingModalOpen(true)
  }

  const handleBookingSuccess = (reference: string) => {
    setBookingReference(reference)
    setBookingModalOpen(false)
    setSuccessModalOpen(true)
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

  const getLowestPrice = (roomTypes: RoomType[]) => {
    if (!roomTypes || roomTypes.length === 0) return 0
    return Math.min(...roomTypes.map((room) => room.display_price))
  }

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
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1 h-12 px-4 rounded-full bg-white text-gray-900"
            />
            <input
              type="date"
              placeholder="Check in date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            />
            <input
              type="date"
              placeholder="Check out date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split("T")[0]}
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            />
            <select
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number.parseInt(e.target.value))}
              className="h-12 px-4 rounded-full bg-white text-gray-900 w-full md:w-48"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="h-12 px-8 rounded-full bg-[#5A8E00] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#4A7500] transition-colors"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className={`${styles.section.container} py-16`}>
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          {searchLocation ? `Hotels in "${searchLocation}"` : "Featured Hotels"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#5A8E00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hotels found matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchLocation("")
                setFilteredHotels(hotels)
              }}
              className="mt-4 px-6 py-2 bg-[#5A8E00] text-white rounded-lg hover:bg-[#4A7500] transition-colors"
            >
              Show All Hotels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
            {filteredHotels.map((hotelItem) => (
              <div
                key={hotelItem.id}
                className="cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
                onClick={() => handleHotelClick(hotelItem)}
              >
                {/* Image Container */}
                <div className="relative group mb-4">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={hotelItem.image_url || "/placeholder.svg"}
                      alt={hotelItem.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = hotel // Fallback to imported hotel image
                      }}
                    />
                    {/* Rating badge */}
                    <div className="absolute mr-4 top-3 right-12 bg-black/20 backdrop-blur-[16px] px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#97E12B] fill-current" />
                      <span className="text-[#97E12B] font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {hotelItem.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hotel Information */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-black">{hotelItem.name}</h3>
                    <span className="text-[#5A8E00] text-md font-medium">
                      From ₦{getLowestPrice(hotelItem.room_types || []).toLocaleString()}/night
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotelItem.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{hotelItem.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotelItem.amenities.slice(0, 4).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                        {renderAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {hotelItem.amenities.length > 4 && (
                      <span className="text-xs text-gray-500">+{hotelItem.amenities.length - 4} more</span>
                    )}
                  </div>

                  {/* Room types preview */}
                  {hotelItem.room_types && hotelItem.room_types.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Available room types:</p>
                      <div className="flex flex-wrap gap-1">
                        {hotelItem.room_types.slice(0, 3).map((room) => (
                          <span key={room.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {room.name}
                          </span>
                        ))}
                        {hotelItem.room_types.length > 3 && (
                          <span className="text-xs text-gray-500">+{hotelItem.room_types.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hotel Booking Modal */}
      <HotelBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        hotel={selectedHotel}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        bookingReference={bookingReference}
      />
    </main>
  )
}
