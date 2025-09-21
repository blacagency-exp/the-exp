"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion"
import { X, Heart, Share2, Download } from "lucide-react"
import art1 from "../../assets/GRstudios354.jpg"
import art2 from "../../assets/GRstudios404.jpg"
import art3 from "../../assets/GRstudios403.jpg"
import art4 from "../../assets/GRstudios401.jpg"
import art5 from "../../assets/GRstudios357.jpg"
import art6 from "../../assets/GRstudios356.jpg"
import art7 from "../../assets/GRstudios355.jpg"
import fash1 from "../../assets/551A9467.jpg"
import fash2 from "../../assets/LAZ_4524.jpg"
import fash3 from "../../assets/LAZ_4348.jpg"
import fash4 from "../../assets/551A9490.jpg"
import fash5 from "../../assets/GRstudios33.jpg"
import fash6 from "../../assets/551A9963(1).jpg"
import fest1 from "../../assets/GRstudios96.jpg"
import fest2 from "../../assets/GRstudios93.jpg"
import fest3 from "../../assets/551A0258.jpg"
import fest4 from "../../assets/GRstudios100.jpg"
import fest5 from "../../assets/551A0245.jpg"
import fest6 from "../../assets/551A9990.jpg"

// Updated gallery data with realistic Plateau State events
const galleryData = [
  // Art Category
  {
    id: 1,
    title: "Contemporary Art Showcase",
    category: "Art",
    image: art1,
    description:
      "A vibrant display of contemporary artworks by emerging and established artists from Plateau State, showcasing the creative spirit of the region.",
    date: "March 2024",
    location: "Jos Museum, Jos",
  },
  {
    id: 2,
    title: "Traditional Pottery Exhibition",
    category: "Art",
    image: art2,
    description:
      "An exhibition celebrating the ancient art of pottery making, featuring traditional techniques passed down through generations in Plateau communities.",
    date: "February 2024",
    location: "Cultural Centre, Jos",
  },
  {
    id: 3,
    title: "Modern Sculpture Gallery",
    category: "Art",
    image: art3,
    description:
      "Innovative sculptures that blend traditional African motifs with contemporary artistic expressions, created by local Plateau State artists.",
    date: "January 2024",
    location: "Plateau Arts Council, Jos",
  },
  {
    id: 4,
    title: "Mixed Media Art Fair",
    category: "Art",
    image: art4,
    description:
      "A diverse collection of mixed media artworks exploring themes of identity, culture, and modernity in Plateau State.",
    date: "December 2023",
    location: "University of Jos Art Gallery",
  },
  {
    id: 5,
    title: "Photography & Visual Arts",
    category: "Art",
    image: art5,
    description:
      "Stunning photography and visual arts capturing the natural beauty and cultural richness of Plateau State landscapes and people.",
    date: "November 2023",
    location: "Jos Photography Studio",
  },
  {
    id: 6,
    title: "Abstract Art Collection",
    category: "Art",
    image: art6,
    description:
      "Bold abstract paintings and installations that represent the dynamic energy and spirit of Plateau State's artistic community.",
    date: "October 2023",
    location: "Modern Art Gallery, Jos",
  },
  {
    id: 7,
    title: "Cultural Art Heritage",
    category: "Art",
    image: art7,
    description:
      "Traditional art forms and cultural artifacts showcasing the rich heritage of the various ethnic groups in Plateau State.",
    date: "September 2023",
    location: "Heritage Museum, Jos",
  },

  // Culture Category (Fashion & Cultural Events)
  {
    id: 8,
    title: "Plateau Fashion Week",
    category: "Culture",
    image: fash1,
    description:
      "The premier fashion event showcasing traditional and contemporary designs by Plateau State fashion designers, celebrating local textile traditions.",
    date: "August 2024",
    location: "Yakubu Gowon Stadium, Jos",
  },
  {
    id: 9,
    title: "Traditional Attire Showcase",
    category: "Culture",
    image: fash2,
    description:
      "A beautiful display of traditional clothing from various ethnic groups in Plateau State, highlighting the diversity of cultural dress.",
    date: "July 2024",
    location: "Cultural Centre, Jos",
  },
  {
    id: 10,
    title: "Modern African Fashion",
    category: "Culture",
    image: fash3,
    description:
      "Contemporary African fashion designs that blend traditional patterns with modern cuts, representing the evolution of Plateau State fashion.",
    date: "June 2024",
    location: "Fashion Hub, Jos",
  },
  {
    id: 11,
    title: "Cultural Dress Festival",
    category: "Culture",
    image: fash4,
    description:
      "A celebration of cultural identity through traditional dress, featuring authentic costumes from Berom, Anaguta, Afizere, and other Plateau communities.",
    date: "May 2024",
    location: "Jos Main Market Square",
  },
  {
    id: 15,
    title: "Youth Fashion Show",
    category: "Culture",
    image: fash5,
    description:
      "Young designers from Plateau State showcase their innovative fashion creations, blending traditional motifs with contemporary style.",
    date: "April 2024",
    location: "University of Jos Campus",
  },
  {
    id: 19,
    title: "Bridal Fashion Exhibition",
    category: "Culture",
    image: fash6,
    description:
      "Elegant bridal wear showcasing traditional wedding attire from different Plateau State communities, celebrating matrimonial customs.",
    date: "March 2024",
    location: "Wedding Expo Centre, Jos",
  },

  // Festival Category
  {
    id: 12,
    title: "Jos Carnival Celebration",
    category: "Festival",
    image: fest1,
    description:
      "The annual Jos Carnival featuring colorful parades, traditional dances, and cultural performances celebrating the unity and diversity of Plateau State.",
    date: "December 2024",
    location: "Jos City Centre",
  },
  {
    id: 13,
    title: "Nzem Berom Festival",
    category: "Festival",
    image: fest2,
    description:
      "The traditional harvest festival of the Berom people, celebrating agricultural abundance with traditional dances, music, and cultural displays.",
    date: "November 2024",
    location: "Berom Land, Jos South",
  },
  {
    id: 14,
    title: "Cultural Unity Festival",
    category: "Festival",
    image: fest3,
    description:
      "A festival promoting peace and unity among the diverse ethnic groups of Plateau State through music, dance, and cultural exchange.",
    date: "October 2024",
    location: "Rwang Pam Stadium, Jos",
  },
  {
    id: 16,
    title: "Traditional Music Festival",
    category: "Festival",
    image: fest4,
    description:
      "A celebration of traditional music and instruments from various Plateau State communities, featuring live performances and cultural storytelling.",
    date: "September 2024",
    location: "Jos Township Stadium",
  },
  {
    id: 17,
    title: "Plateau Peace Festival",
    category: "Festival",
    image: fest5,
    description:
      "An annual festival dedicated to promoting peace, harmony, and coexistence among all communities in Plateau State through cultural activities.",
    date: "August 2024",
    location: "Government House Grounds, Jos",
  },
  {
    id: 18,
    title: "Youth Cultural Festival",
    category: "Festival",
    image: fest6,
    description:
      "Young people from across Plateau State come together to celebrate their cultural heritage through dance, music, and traditional performances.",
    date: "July 2024",
    location: "Youth Centre, Jos",
  },
]

const categories = ["All", "Festival", "Culture", "Art"]

export function InteractiveGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<(typeof galleryData)[0] | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const { } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const filteredImages =
    selectedCategory === "All" ? galleryData : galleryData.filter((item) => item.category === selectedCategory)

  const toggleLike = (id: number) => {
    setLikedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <section ref={containerRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #97E12B 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-[#141E03] mb-6">Event Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the beauty and vibrancy of Plateau State through our curated collection of event photography
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#97E12B] text-[#141E03] shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <AnimatePresence mode="wait">
            {filteredImages.map((item,) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content Overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredId === item.id ? 0 : 20,
                      opacity: hoveredId === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="inline-block px-3 py-1 bg-[#97E12B] text-[#141E03] text-sm font-medium rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-200">
                      {item.date} • {item.location}
                    </p>
                  </motion.div>

                  {/* Like Button */}
                  <motion.button
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredId === item.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(item.id)
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedImages.has(item.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="aspect-[16/10] relative">
                <img
                  src={selectedImage.image || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#97E12B] text-[#141E03] text-sm font-medium rounded-full mb-3">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-3xl font-bold text-[#141E03] mb-2">{selectedImage.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedImage.date} • {selectedImage.location}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={() => toggleLike(selectedImage.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedImages.has(selectedImage.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
