import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { styles } from "../../constants/styles"
import shere from "../../assets/shereHills.png"

interface TourCard {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
}

const tourData: TourCard[] = [
  {
    id: 1,
    title: "Shere Hills",
    description: "Take a virtual tour through the stunning Shere Hills, where you'll explore the rugged terrain",
    image: shere,
    tags: ["Virtual tour", "Rock Climbing", "Sailing"],
  },
  {
    id: 2,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls, a natural wonder with cascading waters",
    image: shere,
    tags: ["Virtual tour", "Hiking", "Photography"],
  },
  {
    id: 3,
    title: "Jos Wildlife Park",
    description: "Discover the diverse wildlife and natural habitats of Jos Wildlife Park",
    image: shere,
    tags: ["Virtual tour", "Wildlife", "Nature"],
  },
  {
    id: 4,
    title: "Riyom Rock",
    description: "Explore the iconic Riyom Rock formation and its surrounding landscapes",
    image: shere,
    tags: ["Virtual tour", "Rock Climbing", "Hiking"],
  },
  {
    id: 5,
    title: "Kerang Highlands",
    description: "Visit the beautiful Kerang Highlands and experience its unique climate",
    image: shere,
    tags: ["Virtual tour", "Hiking", "Camping"],
  },
  {
    id: 6,
    title: "Pandam Game Reserve",
    description: "Take a journey through the Pandam Game Reserve and its ecosystem",
    image: shere,
    tags: ["Virtual tour", "Wildlife", "Safari"],
  },
]

export function FeaturedTours() {
  const [currentPage, setCurrentPage] = useState(1)
  const toursPerPage = 2
  const totalPages = Math.ceil(tourData.length / toursPerPage)

  // Calculate tours to show on current page
  const indexOfLastTour = currentPage * toursPerPage
  const indexOfFirstTour = indexOfLastTour - toursPerPage
  const currentTours = tourData.slice(indexOfFirstTour, indexOfLastTour)

  // Generate page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <section className="w-full py-24">
      <div className={styles.section.container}>
        <h2 className="text-[7rem] leading-[1] font-bold text-black mb-4">Featured Tours</h2>
        <p className="text-xl text-gray-400 max-w-2xl mb-16">
          Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
        </p>
        <div className="grid grid-cols-2 gap-16">
          {currentTours.map((tour) => (
            <div key={tour.id} className="space-y-4">
              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="flex gap-2">
                {tour.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1 text-sm bg-[#97E12B] text-[#1A2E0D] rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-black">{tour.title}</h3>
                <p className="text-[#4F4F4F] text-md font-light">{tour.description}</p>
              </div>
            </div>
          ))}
        </div>

        
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-16 border border-white rounded-xl bg-white shadow-lg px-6 py-4 max-w-md mx-auto">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm
                ${currentPage === number ? "bg-[#5A8E00] text-white" : "hover:bg-gray-100 text-gray-600"}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

