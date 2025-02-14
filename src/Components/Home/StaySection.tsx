import { ArrowUpRight } from "lucide-react"
import { styles } from "../../constants/styles"
import img1 from "../../assets/firstH.png"
import img2 from "../../assets/lastH.png"
import img3 from "../../assets/thirdH.png"
import img4 from "../../assets/secondH.png"

interface Hotel {
  name: string
  image: string
  bookingUrl?: string
}

const hotels: Hotel[] = [
  {
    name: "Luxury Villa",
    image: img1,
  },
  {
    name: "Crest Hotel",
    image: img4,
    bookingUrl: "#",
  },
  {
    name: "Crispan Hotel",
    image: img3,
    bookingUrl: "#",
  },
  {
    name: "Executive Suite",
    image: img2,
  },
]

export function StaySection() {
  return (
    <section className="w-full bg-white pt-24">
      <div className={styles.section.container}>
        <div className="space-y-4 mb-8">
          <h2 className="text-[5rem] leading-none tracking-tight text-[#1A2E0D] font-semibold mb-12">Your Stay</h2>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-[#1A2E0D] font-semibold">Stay in Comfort</h3>
            <p className="text-[#666666] text-sm font-normal">Find the perfect place to relax and recharge</p>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1 sm:px-1 lg:px-1">
        {hotels.map((hotel, index) => (
          <div key={index} className="relative group overflow-hidden rounded-3xl aspect-[3/4]">
            <img
              src={hotel.image || "/placeholder.svg"}
              alt={hotel.name}
              className="w-full h-full object-cover object-center font-semibold"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl flex flex-col items-center justify-end text-center p-6">
              <h4 className="text-white text-2xl font-semibold mb-4">{hotel.name}</h4>
              {hotel.bookingUrl && (
                <button className="bg-white font-normal text-[#5A8E00] px-12 py-3 rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors mb-2">
                  Book Now
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

