import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import axios from "axios"
import { API_URL } from "../../config/api"

// Import the images directly
import img1 from "../../assets/dommun.png"
import img2 from "../../assets/jid.png"
import img3 from "../../assets/yakubu.png"
import img4 from "../../assets/uche.png"
import img5 from "../../assets/tor.png"
import img6 from "../../assets/grace.jpg"


// Create an image mapping object
const imageMap: Record<string, string> = {
    "/assets/dommun.png": img1,
    "/assets/jid.png": img2,
    "/assets/yakubu.png": img3,
    "/assets/uche.png": img4,
    "/assets/tor.png": img5,
    "/assets/grace.jpg": img6,
  }

interface Guide {
  id: number
  name: string
  specialty: string
  languages: string
  rating: number
  image: string
  number: string
  email?: string // Add email for contacting the guide
}

interface GuideSelectorProps {
  onSelectGuide: (guideId: number | null) => void
}

export const GuideSelector: React.FC<GuideSelectorProps> = ({ onSelectGuide }) => {
  const [guides, setGuides] = useState<Guide[]>([])
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // You can either fetch guides from your backend or use the static data
    // For this implementation, I'll use the static data similar to your MeetGuides component
    // In a production app, you should fetch this from your API
    
    // Simulating API call with setTimeout
    // setTimeout(() => {
    //   const staticGuides = [
    //     {
    //       id: 1,
    //       name: "Danjuma Madaki",
    //       specialty: "Wildlife tours and eco-trail guiding",
    //       languages: "English, Hausa",
    //       rating: 5,
    //       image: "/assets/dommun.png",
    //       email: "danjuma@experienceplateau.com"
    //     },
    //     {
    //       id: 2,
    //       name: "Jidangtok Ephraim Philemon",
    //       specialty: "Cultural heritage tours, traditional crafts",
    //       languages: "English, Hausa",
    //       rating: 5,
    //       image: "/assets/jid.png",
    //       email: "jidangtok@experienceplateau.com"
    //     },
    //     {
    //       id: 3,
    //       name: "Yakubu Danlaye",
    //       specialty: "Wildlife tours and eco-trail guiding",
    //       languages: "English, Yoruba, Igbo, Hausa",
    //       rating: 5,
    //       image: "/assets/yakubu.png",
    //       email: "yakubu@experienceplateau.com"
    //     },
    //     {
    //       id: 4,
    //       name: "Sunday Ocha",
    //       specialty: "Cultural heritage tours, traditional crafts",
    //       languages: "English, Hausa",
    //       rating: 5,
    //       image: "/assets/uche.png",
    //       email: "sunday@experienceplateau.com"
    //     },
    //     {
    //       id: 5,
    //       name: "Masephina Tor",
    //       specialty: "Local cuisine experiences",
    //       languages: "English, Hausa",
    //       rating: 5,
    //       image: "/assets/tor.png",
    //       email: "masephina@experienceplateau.com"
    //     }
    //   ]
      
    //   setGuides(staticGuides)
    //   setLoading(false)
    // }, 500)
    
    // Uncomment this for actual API integration:
    
    const fetchGuides = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/guides`)
        const processedGuides = response.data.map((guide: Guide) => ({
            ...guide,
        }))
        setGuides(processedGuides)
        setLoading(false)
      } catch {
        setError("Failed to load guides. Please try again.")
        setLoading(false)
      }
    }
    
    fetchGuides()
    
  }, [])

  const handleGuideSelect = (guideId: number) => {
    setSelectedGuide(guideId)
    onSelectGuide(guideId)
  }

  if (loading) {
    return <div className="text-center py-6">Loading guides...</div>
  }

  if (error) {
    return <div className="text-red-500 py-6">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => handleGuideSelect(guide.id)}
            className={`
              border rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedGuide === guide.id ? 'ring-2 ring-[#5A8E00] border-[#5A8E00]' : 'border-gray-200 hover:border-[#97E12B]'}
            `}
          >
            <div className="aspect-[3/5] overflow-hidden">
            <img 
                src={imageMap[guide.image] || "/placeholder.svg"} 
                alt={guide.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{guide.name}</h3>
              <p className="text-sm text-gray-600">{guide.specialty}</p>
              <div className="flex items-center mt-1">
                {Array.from({ length: guide.rating }).map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-[#97E12B] text-[#97E12B]" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedGuide && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
          You've selected {guides.find(g => g.id === selectedGuide)?.name} as your guide.
        </div>
      )}
    </div>
  )
}