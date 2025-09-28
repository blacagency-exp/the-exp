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

// Simplified gallery data with only id and image
const galleryData = [
  { id: 1, image: art1 },
  { id: 2, image: art2 },
  { id: 3, image: art3 },
  { id: 4, image: art4 },
  { id: 5, image: art5 },
  { id: 6, image: art6 },
  { id: 7, image: art7 },
  { id: 8, image: fash1 },
  { id: 9, image: fash2 },
  { id: 10, image: fash3 },
  { id: 11, image: fash4 },
  { id: 12, image: fash5 },
  { id: 13, image: fash6 },
  { id: 14, image: fest1 },
  { id: 15, image: fest2 },
  { id: 16, image: fest3 },
  { id: 17, image: fest4 },
  { id: 18, image: fest5 },
  { id: 19, image: fest6 },
]

export function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryData)[0] | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const {  } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

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

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <AnimatePresence mode="wait">
            {galleryData.map((item) => (
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
                    alt={`Gallery image ${item.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

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
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
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
                  alt={`Gallery image ${selectedImage.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Bar */}
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-gray-800"></div>

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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
