"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Info, X } from "lucide-react"
import { styles } from "../../constants/styles"
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet"
import { motion, AnimatePresence } from "framer-motion"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import "./leaflet-fix"

interface Landmark {
  id: number
  name: string
  description: string
  number: number
  isLight?: boolean
  coordinates: {
    longitude: number
    latitude: number
  }
}

const landmarks: Landmark[] = [
  {
    id: 1,
    name: "Naraguta Tourist Village",
    description: "Experience the rich cultural heritage of Plateau State at the Naraguta Tourist Village.",
    number: 1,
    isLight: true,
    coordinates: {
      longitude: 8.8921,
      latitude: 9.9647,
    },
  },
  {
    id: 2,
    name: "Jos National Museum and Zoo",
    description: "Discover the history and wildlife of Jos at the National Museum and Zoo complex.",
    number: 2,
    coordinates: {
      longitude: 8.8924,
      latitude: 9.9176,
    },
  },
  {
    id: 3,
    name: "Rayfield Resort",
    description: "Enjoy recreational activities at the scenic Rayfield Resort.",
    number: 3,
    coordinates: {
      longitude: 8.8736,
      latitude: 9.8684,
    },
  },
  {
    id: 4,
    name: "Assop Falls",
    description: "Witness the natural beauty of the cascading Assop Falls.",
    number: 4,
    coordinates: {
      longitude: 8.7778,
      latitude: 9.6833,
    },
  },
  {
    id: 5,
    name: "Jos Wildlife Park",
    description:
      "Jos Wildlife Park is a peaceful conservation area in Plateau State, home to native animals like lions and monkeys. Visitors can enjoy nature walks and wildlife viewing in its lush landscapes.",
    number: 5,
    coordinates: {
      longitude: 8.8544,
      latitude: 9.8965,
    },
  },
]

// Component to handle map view changes with smoother animations
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  const flyRef = useRef(false)

  useEffect(() => {
    if (flyRef.current) {
      // Use flyTo for smoother animations when changing landmarks
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      })
    } else {
      // Just set the initial view without animation
      map.setView(center, zoom)
      flyRef.current = true
    }
  }, [center, zoom, map])

  return null
}

export function PopularLandmarks() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(landmarks[4])
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.8965, 8.8544]) // [lat, lng]
  const [mapZoom, setMapZoom] = useState(11)
  const [showInfoCard, setShowInfoCard] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapRef = useRef(null)

  // Update map view when selected landmark changes
  useEffect(() => {
    if (selectedLandmark) {
      setMapCenter([selectedLandmark.coordinates.latitude, selectedLandmark.coordinates.longitude])
      setMapZoom(16) // Increased zoom level from 13 to 16 for a closer view
      setShowInfoCard(true)
    }
  }, [selectedLandmark])

  const handleLandmarkClick = (landmark: Landmark) => {
    setSelectedLandmark(landmark)
  }

  // Create custom icon for each landmark with pulse effect for selected landmark
  const createCustomIcon = (landmark: Landmark, isSelected: boolean) => {
    return L.divIcon({
      className: `custom-marker ${isSelected ? "selected-marker" : ""}`,
      html: `
        <div class="${isSelected ? "bg-[#5A8E00] text-white" : "bg-white text-[#1A2E0D]"} 
                    w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer
                    ${isSelected ? "marker-pulse" : ""}">
          <div class="marker-content">${landmark.number}</div>
          ${isSelected ? '<div class="pulse-ring"></div>' : ""}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }

  // Handle map load event
  const handleMapLoad = () => {
    setIsMapLoaded(true)
  }

  // Reset map view to show all landmarks
  const handleResetView = () => {
    // Calculate the center point of all landmarks
    const totalLat = landmarks.reduce((sum, landmark) => sum + landmark.coordinates.latitude, 0)
    const totalLng = landmarks.reduce((sum, landmark) => sum + landmark.coordinates.longitude, 0)
    const centerLat = totalLat / landmarks.length
    const centerLng = totalLng / landmarks.length

    setMapCenter([centerLat, centerLng])
    setMapZoom(10) // Zoom level that should show most or all landmarks
    setShowInfoCard(false)
  }

  return (
    <section className="w-full py-24">
      <div className={styles.section.container}>
        <motion.h2
          className="text-[4rem] leading-[1] font-bold text-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Popular Landmarks
        </motion.h2>

        <motion.p
          className="text-xl text-[#5A8E00] mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Iconic sites and must-see destinations
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarks.slice(0, 2).map((landmark) => (
              <motion.button
                key={landmark.id}
                onClick={() => handleLandmarkClick(landmark)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-xl transition-colors
                  ${selectedLandmark?.id === landmark.id ? "bg-[#5A8E00]" : "bg-[#1A2E0D]"}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative flex-shrink-0">
                  <MapPin className="w-8 h-8" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {landmark.number}
                  </div>
                </div>
                <span className="text-left text-sm sm:text-base lg:text-xl">{landmark.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Bottom row - Mobile optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {landmarks.slice(2).map((landmark) => (
              <motion.button
                key={landmark.id}
                onClick={() => handleLandmarkClick(landmark)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl text-white transition-colors
                  ${selectedLandmark?.id === landmark.id ? "bg-[#5A8E00]" : "bg-[#1A2E0D]"}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative flex-shrink-0">
                  <MapPin className="w-8 h-8" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {landmark.number}
                  </div>
                </div>
                {/* Text size adjusts based on screen size */}
                <span className="text-left text-sm sm:text-base lg:text-xl">{landmark.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative rounded-[2rem] overflow-hidden h-[500px] z-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {!isMapLoaded && (
              <motion.div
                className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-[#5A8E00] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map container */}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
            zoomControl={false}
            className="z-0"
            whenReady={handleMapLoad}
            ref={mapRef}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />

            {/* Modern map style with Stadia Maps */}
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />

            {/* Add zoom controls in a better position */}
            <ZoomControl position="bottomright" />

            {landmarks.map((landmark) => (
              <Marker
                key={landmark.id}
                position={[landmark.coordinates.latitude, landmark.coordinates.longitude]}
                icon={createCustomIcon(landmark, selectedLandmark?.id === landmark.id)}
                eventHandlers={{
                  click: () => handleLandmarkClick(landmark),
                }}
              />
            ))}
          </MapContainer>

          {/* Floating info card instead of popup - without the Start Virtual Tour button */}
          <AnimatePresence>
            {selectedLandmark && showInfoCard && (
              <motion.div
                className="absolute bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="bg-white rounded-xl p-4 shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setShowInfoCard(false)}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#5A8E00] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Info className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">{selectedLandmark.name}</h3>
                      <p className="text-gray-600">{selectedLandmark.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map controls overlay */}
          <div className="absolute top-4 left-4 z-[400]">
            <button
              className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
              onClick={handleResetView}
              title="Reset view"
            >
              <MapPin className="w-5 h-5 text-[#5A8E00]" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

