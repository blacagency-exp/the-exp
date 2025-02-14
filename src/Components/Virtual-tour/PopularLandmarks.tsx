import { useState } from "react"
import { MapPin } from "lucide-react"
import { styles } from "../../constants/styles"

interface Landmark {
  id: number
  name: string
  description: string
  number: number
  isLight?: boolean
}

const landmarks: Landmark[] = [
  {
    id: 1,
    name: "Naraguta Tourist Village",
    description: "Experience the rich cultural heritage of Plateau State at the Naraguta Tourist Village.",
    number: 1,
    isLight: true,
  },
  {
    id: 2,
    name: "Jos National Museum and Zoo",
    description: "Discover the history and wildlife of Jos at the National Museum and Zoo complex.",
    number: 2,
  },
  {
    id: 3,
    name: "Rayfield Resort",
    description: "Enjoy recreational activities at the scenic Rayfield Resort.",
    number: 1,
  },
  {
    id: 4,
    name: "Assop Falls",
    description: "Witness the natural beauty of the cascading Assop Falls.",
    number: 1,
  },
  {
    id: 5,
    name: "Jos Wildlife Park",
    description:
      "Jos Wildlife Park is a peaceful conservation area in Plateau State, home to native animals like lions and monkeys. Visitors can enjoy nature walks and wildlife viewing in its lush landscapes.",
    number: 3,
  },
]

export function PopularLandmarks() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(landmarks[4])

  return (
    <section className="w-full py-24">
      <div className={styles.section.container}>
        <h2 className="text-[4rem] leading-[1] font-bold text-black mb-4">Popular Landmarks</h2>
        <p className="text-xl text-[#5A8E00] mb-8">Iconic sites and must-see destinations</p>

        <div className="flex flex-col gap-4 mb-8">
          {/* Top row */}
          <div className="grid grid-cols-3 gap-4">
            {landmarks.slice(0, 2).map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => setSelectedLandmark(landmark)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-xl transition-colors
                  ${landmark.isLight ? "bg-[#5A8E00]" : "bg-[#1A2E0D]"}
                  ${selectedLandmark?.id === landmark.id ? "ring-2 ring-offset-2 ring-[#5A8E00]" : ""}
                `}
              >
                <div className="relative">
                  <MapPin className="w-8 h-8" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {landmark.number}
                  </div>
                </div>
                {landmark.name}
              </button>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-4 gap-4">
            {landmarks.slice(2).map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => setSelectedLandmark(landmark)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-xl transition-colors
                  bg-[#1A2E0D]
                  ${selectedLandmark?.id === landmark.id ? "ring-2 ring-offset-2 ring-[#5A8E00]" : ""}
                `}
              >
                <div className="relative">
                  <MapPin className="w-8 h-8" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {landmark.number}
                  </div>
                </div>
                {landmark.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-[2rem] bg-[#1A2E0D] overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QpDbW75QXvlnEAjlBq9jiskimuvFUZ.png"
            alt="Plateau State Map"
            className="w-full h-auto"
          />

          {selectedLandmark && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-w-md">
              <h3 className="text-xl font-bold text-black mb-2">{selectedLandmark.name}</h3>
              <p className="text-gray-600 mb-4">{selectedLandmark.description}</p>
              <button className="px-6 py-2 bg-[#5A8E00] text-white rounded-full hover:bg-[#4A7D00] transition-colors">
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
