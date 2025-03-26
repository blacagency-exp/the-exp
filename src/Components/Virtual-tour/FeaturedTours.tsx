import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { styles } from "../../constants/styles";
import shere from "../../assets/shereHills.png";
import { useNavigate } from "react-router-dom";
import hotspotIcon from "../../assets/hotspot-icon.png";



interface Hotspot {
  id: string;
  position: { x: number; y: number }; // Position in percentages (e.g., { x: 50, y: 50 })
  targetTourId: number; // ID of the target tour to navigate to
  icon?: string;
}
// Define the TourCard interface
interface TourCard {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  videoUrl: string;
  hotspots?: Hotspot[]; // Add videoUrl to the TourCard interface
}

// Export tourData so it can be used in other files
export const tourData: TourCard[] = [
  {
    id: 1,
    title: "Shere Hills",
    description: "Explore the stunning Shere Hills with its rugged terrain",
    image: shere,
    tags: ["Virtual tour", "Rock Climbing", "Sailing"],
    videoUrl: "https://www.youtube.com/embed/_XoQ31Y6iAE",
    hotspots: [
      { id: "to-assop", position: { x: 30, y: 70 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 70, y: 70 }, targetTourId: 3, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 50, y: 70 }, targetTourId: 4, icon: hotspotIcon }
    ],
  },
  {
    id: 2,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls",
    image: shere,
    tags: ["Virtual tour", "Hiking", "Photography"],
    videoUrl: "https://www.youtube.com/embed/U2makrXtxoI",
    hotspots: [
      { id: "to-shere", position: { x: 20, y: 80 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 80, y: 20 }, targetTourId: 3, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 60, y: 40 }, targetTourId: 4, icon: hotspotIcon }
    ],
  },
  {
    id: 3,
    title: "Rayfield Resort",
    description: "Relax at the beautiful Rayfield Resort",
    image: shere,
    tags: ["Virtual tour", "Luxury", "Resort"],
    videoUrl: "https://www.youtube.com/embed/2zBDneZUgJM",
    hotspots: [
      { id: "to-shere", position: { x: 25, y: 75 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-assop", position: { x: 75, y: 25 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 50, y: 50 }, targetTourId: 4, icon: hotspotIcon }
    ],
  },
  {
    id: 4,
    title: "Wildlife Park",
    description: "Discover the diverse wildlife of Plateau State",
    image: shere,
    tags: ["Virtual tour", "Animals", "Nature"],
    videoUrl: "https://www.youtube.com/embed/WVw2d42GLK8",
    hotspots: [
      { id: "to-shere", position: { x: 40, y: 60 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-assop", position: { x: 60, y: 40 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 40, y: 20 }, targetTourId: 3, icon: hotspotIcon }
    ],
  }
];

export function FeaturedTours() {
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 4;
  const totalPages = Math.ceil(tourData.length / toursPerPage);
  const navigate = useNavigate();

  // Calculate tours to show on current page
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tourData.slice(indexOfFirstTour, indexOfLastTour);

  // Generate page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleTourClick = (tourId: number) => {
    // Navigate to the individual tour page
    navigate(`/virtual-tour/${tourId}`);
  };

  return (
    <section className="w-full py-24">
      <div className={styles.section.container}>
        <h2 className="text-[7rem] leading-[1] font-bold text-black mb-4">Featured Tours</h2>
        <p className="text-xl text-gray-400 max-w-2xl mb-16">
          Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
        </p>
        <div className="grid grid-cols-2 gap-16">
          {currentTours.map((tour) => (
            <div
              key={tour.id}
              className="space-y-4 cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleTourClick(tour.id)}
            >
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
  );
}