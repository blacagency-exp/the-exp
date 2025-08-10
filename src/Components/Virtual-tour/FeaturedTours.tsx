"use client"

import { styles } from "../../constants/styles"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { activeTours } from "../../data/tour-data"
import { Lock, Play, Clock } from "lucide-react"
import { VirtualTourPaymentModal } from "./VirtualTourPaymentModal"
import { AccessCodeModal } from "./AccessCodeModal"
import axios from "axios"
import { API_URL } from "../../config/api"

// Define tour pricing - UPDATED WITH JOS MUSEUM (ID 9)
const TOUR_PRICING = {
  1: 0, // Rayfield Resort - Free
  4: 100, // Assop Falls - Paid (₦15,000)
  8: 100, // Riyom Rock - Paid (₦18,000)
  9: 100, // Jos Museum FULL TOUR - Paid (₦12,000) - cultural/educational pricing
}

export function FeaturedTours() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [accessCodeModalOpen, setAccessCodeModalOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<any>(null)
  const [userAccess, setUserAccess] = useState<{ [key: number]: boolean }>({})

  // Check user access on component mount and periodically
  useEffect(() => {
    checkUserAccess()

    // Check access every 5 minutes to handle expiration
    const interval = setInterval(checkUserAccess, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const checkUserAccess = async () => {
    try {
      // Get user email from localStorage
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) {
        return
      }

      const response = await axios.post(`${API_URL}/api/check-user-access`, {
        email: userEmail,
        tourIds: [4, 8, 9], // Check access for Assop Falls, Riyom Rock, and Jos Museum FULL TOUR
      })

      if (response.data.success) {
        const accessMap: { [key: number]: boolean } = {}
        response.data.access.forEach((item: any) => {
          // Only mark as accessible if not expired
          const now = new Date()
          const expiresAt = new Date(item.expires_at)
          if (now <= expiresAt) {
            accessMap[item.tour_id] = true
          }
        })
        setUserAccess(accessMap)
      }
    } catch (error) {
      console.error("Error checking user access:", error)
    }
  }

  const handleTourClick = (tour: any) => {
    const tourPrice = TOUR_PRICING[tour.id as keyof typeof TOUR_PRICING]

    // If tour is free or user has access, navigate directly
    if (tourPrice === undefined || tourPrice === 0 || userAccess[tour.id]) {
      navigate(`/virtual-tour/${tour.id}?scene=1`)
      return
    }

    // If tour is paid and user doesn't have access, show access options
    setSelectedTour(tour)
    setAccessCodeModalOpen(true)
  }

  const handlePaymentSuccess = (accessCode: string) => {
    // Immediately refresh access check after successful payment
    checkUserAccess()

    // Update user access
    setUserAccess((prev) => ({
      ...prev,
      [selectedTour.id]: true,
    }))

    // Navigate to tour
    navigate(`/virtual-tour/${selectedTour.id}?scene=1`)
  }

  const handleAccessGranted = () => {
    // Update user access
    setUserAccess((prev) => ({
      ...prev,
      [selectedTour.id]: true,
    }))

    // Navigate to tour
    navigate(`/virtual-tour/${selectedTour.id}?scene=1`)
  }

  const showPaymentModal = () => {
    setAccessCodeModalOpen(false)
    setPaymentModalOpen(true)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  const tagContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  }

  const tagVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  }

  const hintVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
      },
    },
  }

  return (
    <motion.section
      className="w-full py-12 md:py-24"
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className={`${styles.section.container} text-left px-4 md:px-6`}>
        <motion.h2
          className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] leading-[1.1] md:leading-[1] font-bold text-black mb-2 md:mb-4"
          variants={itemVariants}
        >
          Featured Tour
        </motion.h2>
        <motion.p className="text-base md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-16" variants={itemVariants}>
          Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
        </motion.p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
          {activeTours.map((tour) => {
            const tourPrice = TOUR_PRICING[tour.id as keyof typeof TOUR_PRICING]
            const isLocked = tourPrice !== undefined && tourPrice > 0 && !userAccess[tour.id]
            const isFree = tourPrice === undefined || tourPrice === 0

            return (
              <motion.div
                key={tour.id}
                className="cursor-pointer hover:scale-[1.02] transition-transform relative"
                variants={cardVariants}
                onClick={() => handleTourClick(tour)}
              >
                <motion.div className="overflow-hidden rounded-2xl relative" variants={imageVariants}>
                  <motion.img
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    className={`w-full h-[250px] sm:h-[300px] object-cover ${isLocked ? "filter brightness-75" : ""}`}
                    whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
                  />

                  {/* Overlay for locked tours */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Premium Tour</p>
                        <p className="text-sm">₦{tourPrice.toLocaleString()}</p>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>24-hour access</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Play icon for accessible tours */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
                      <Play className="w-16 h-16 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-4 right-4">
                    {isFree ? (
                      <span className="px-3 py-1 bg-[#97E12B] text-[#1A2E0D] rounded-full text-sm font-semibold">
                        FREE
                      </span>
                    ) : userAccess[tour.id] ? (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">
                        ₦{tourPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div className="mt-4 flex flex-wrap gap-2" variants={tagContainerVariants}>
                  {tour.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 text-xs bg-[#97E12B] text-[#1A2E0D] rounded-full"
                      variants={tagVariants}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.h3 className="mt-2 text-xl font-bold flex items-center gap-2" variants={cardVariants}>
                  {tour.title}
                  {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                </motion.h3>

                <motion.p className="text-sm text-gray-600" variants={cardVariants}>
                  {tour.description}
                </motion.p>

                {isLocked && (
                  <motion.p className="text-xs text-orange-600 mt-1 flex items-center gap-1" variants={cardVariants}>
                    <Clock className="w-3 h-3" />
                    24-hour access • Click to unlock this premium virtual tour
                  </motion.p>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div className="mt-8 text-gray-500 text-sm" variants={hintVariants}>
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
              transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            {/* Your hint text here if needed */}
          </motion.p>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {selectedTour && (
        <VirtualTourPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          tourId={selectedTour.id}
          tourName={selectedTour.title}
          tourPrice={TOUR_PRICING[selectedTour.id as keyof typeof TOUR_PRICING] || 0}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Access Code Modal */}
      {selectedTour && (
        <AccessCodeModal
          isOpen={accessCodeModalOpen}
          onClose={() => setAccessCodeModalOpen(false)}
          tourId={selectedTour.id}
          tourName={selectedTour.title}
          onAccessGranted={handleAccessGranted}
          onPurchaseAccess={showPaymentModal}
        />
      )}

      {/* Purchase button overlay when access code modal is open */}
      {accessCodeModalOpen && selectedTour && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={showPaymentModal}
            className="px-6 py-3 bg-[#5A8E00] text-white rounded-lg hover:bg-[#4A7500] transition-colors font-medium shadow-lg flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Purchase 24h Access - ₦{TOUR_PRICING[selectedTour.id as keyof typeof TOUR_PRICING]?.toLocaleString()}
          </button>
        </div>
      )}
    </motion.section>
  )
}
