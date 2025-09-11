"use client"

import { useState, useEffect, useRef } from "react"
import { styles } from "@/constants/styles"
import { ArrowLeft, ArrowRight } from "lucide-react"
import img1 from "../../assets/bg_count.jpg"
import img2 from "../../assets/water_front.jpg"
import img3 from "../../assets/need1.png"
import img4 from "../../assets/peoplem.png"
import img5 from "../../assets/need2.png"

const investmentOptions = [
  {
    title: "Strategic Location and Accessibility",
    description:
      "Plateau State's central location in Nigeria places it at a logistical advantage for trade and commerce. The state is well-connected through road and air links. With a growing population and skilled workforce, the state and regions are ready for further infrastructure development, including expanded road networks and utilities. The investment climate in Plateau is a rising competitor to its top North-Central rivals.",
    image: img1,
  },
  {
    title: "Favorable Climate for Agriculture",
    description:
      "Plateau State boasts a unique climate that's ideal for diverse agricultural activities. Its temperate weather and rich soil support the cultivation of a wide range of crops, from temperate vegetables to tropical fruits. This climate advantage opens up numerous opportunities in agribusiness, from large-scale farming to food processing industries.",
    image: img2,
  },
  {
    title: "Abundant Natural Resources",
    description:
      "The state is rich in mineral resources, including tin, columbite, and kaolin. These natural endowments present significant opportunities for mining and related industries. Additionally, the picturesque landscapes and unique rock formations offer potential for eco-tourism development.",
    image: img3,
  },
  {
    title: "Growing Population and Workforce",
    description:
      "With a rapidly growing population, Plateau State offers a large consumer market and a young, energetic workforce. This demographic dividend provides a solid foundation for businesses looking to tap into a vibrant market or establish labor-intensive industries.",
    image: img4,
  },
  {
    title: "Supportive Government Policies",
    description:
      "The Plateau State government has implemented investor-friendly policies to attract and retain investments. These include tax incentives, streamlined business registration processes, and dedicated support for investors. The government's commitment to creating an enabling environment makes Plateau an attractive destination for both local and foreign investments.",
    image: img5,
  },
]

export function OpportunitiesHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  // Removed unused isInitialLoad state
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to get image src from imported image
  const getImageSrc = (img: { src?: string } | string) => {
    if (typeof img === "string") return img
    if (img && typeof img === "object" && "src" in img) return img.src
    return "/placeholder.svg"
  }

  // Preload images with priority
  useEffect(() => {
    // First, prioritize loading the currently active image
    const loadActiveImage = () => {
      const img = new Image()
      img.src = getImageSrc(investmentOptions[activeIndex].image) || "/placeholder.svg"
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [activeIndex]: true }))

        // After the active image is loaded, preload the rest in the background
        setTimeout(() => {
          preloadRemainingImages()
        }, 100)
      }
      img.onerror = () => {
        setLoadedImages((prev) => ({ ...prev, [activeIndex]: true }))
        setTimeout(() => {
          preloadRemainingImages()
        }, 100)
      }
    }

    // Then load the rest of the images
    const preloadRemainingImages = () => {
      investmentOptions.forEach((option, index) => {
        // Skip the active image as it's already loaded
        if (index === activeIndex) return

        const img = new Image()
        img.src = getImageSrc(option.image) || "/placeholder.svg"
        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [index]: true }))
        }
        img.onerror = () => {
          setLoadedImages((prev) => ({ ...prev, [index]: true }))
        }
      })
    }

    loadActiveImage()

    // Removed unused timer logic for isInitialLoad
  }, [activeIndex])

  // Preload the next image when hovering
  const handleMouseEnter = (index: number) => {
    // Change the active index immediately for a responsive feel
    setActiveIndex(index)

    // If the image isn't loaded yet, prioritize loading it
    if (!loadedImages[index]) {
      const img = new Image()
      img.src = getImageSrc(investmentOptions[index].image) || "/placeholder.svg"
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }))
      }
    }
  }

  // Apply a blur-up effect for images
  const getImageStyle = (index: number) => {
    return {
      filter: loadedImages[index] ? "none" : "blur(10px)",
      transition: "filter 0.3s ease-out, opacity 0.5s ease-out",
    }
  }

  return (
    <>
      {/* Title Section */}
      <section className="relative pb-16 md:pb-32">
        <div className={styles.section.container}>
          <h1 className="text-5xl md:text-7xl lg:text-[120px] text-center font-semibold leading-none mb-8 md:mb-16 mt-12 md:mt-24">
            Meet
            <br />
            Opportunities
          </h1>
        </div>

        {/* Stats Card - Positioned to overlap */}
        <div className={`${styles.section.container} relative z-10 px-4 md:px-0`}>
          <div className="bg-[#5A8E00] rounded-[2rem] p-8 md:p-12 max-w-[999px] mx-auto">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-8">
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">Population</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">
                  4 Million
                </div>
              </div>
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">Languages</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">
                  English, Hausa
                </div>
              </div>
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">Literacy Rate</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">70%</div>
              </div>
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">Life Expectancy</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">54 Years</div>
              </div>
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">Employment Rate</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">78%</div>
              </div>
              <div className="space-y-2 md:space-y-1">
                <div className="text-white/90 text-center text-lg md:text-base order-1 md:order-2">GDP</div>
                <div className="text-4xl md:text-4xl font-bold text-white text-center order-2 md:order-1">
                  8 Billion USD
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section - Full width background */}
      <section className="bg-[#141E03] -mt-32 md:-mt-64 pt-12 md:pt-24 pb-12 md:pb-24 relative">
        <div className={`${styles.section.container} px-4 md:px-0`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-24 md:mt-48">
            <div className="space-y-4">
              <div className="space-y-1 mb-8 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Why Invest in Plateau State?</h2>
                <p className="text-[#97E12B]">Dive into unforgettable experiences</p>
              </div>

              <div
                ref={imageContainerRef}
                className="relative w-full md:w-[570px] aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0F01]"
              >
                {/* Enhanced loading skeleton */}
                {!loadedImages[activeIndex] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1A2A04] animate-pulse z-10">
                    <div className="w-12 h-12 border-4 border-t-[#97E12B] border-opacity-50 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Optimized image rendering */}
                {investmentOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
                    }`}
                    style={{
                      willChange: "opacity",
                    }}
                  >
                    <img
                      src={getImageSrc(option.image) || "/placeholder.svg"}
                      alt={`Plateau State - ${option.title}`}
                      className="w-full h-full object-cover"
                      style={getImageStyle(index)}
                      onLoad={() => {
                        setLoadedImages((prev) => ({ ...prev, [index]: true }))
                      }}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>

              <p className="text-sm md:text-md text-white/70 max-w-[570px]">
                {investmentOptions[activeIndex].description}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-white/50 text-sm text-right mb-8 md:mb-16 mt-6 md:mt-12">
                Are there more places you want to see?
              </p>

              <div className="space-y-4 md:space-y-6">
                {investmentOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full ${
                      index === activeIndex ? "bg-white/90 text-black" : "bg-[#5A8E00] text-white"
                    } font-bold py-4 md:py-8 px-4 md:px-6 rounded-full flex items-center gap-2 md:gap-4 hover:bg-white hover:text-black transition-colors text-left`}
                    onMouseEnter={() => handleMouseEnter(index)}
                  >
                    {index === activeIndex ? (
                      <ArrowLeft className="h-4 w-4 md:h-6 md:w-6" />
                    ) : (
                      <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
                    )}
                    <span className="text-base md:text-lg">{option.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

