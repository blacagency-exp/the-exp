"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { styles } from "../../constants/styles"
import { client, urlFor } from "@/sanity/lib/client"

interface Slide {
  image: string
  title: string
  featured?: boolean
  slug: string
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchAndPreload = async () => {
      try {
        const query = `*[_type == "blog"] | order(date desc)[0...3] {
          title,
          "slug": slug.current,
          mainImage
        }`
        const data = await client.fetch(query)

        const mappedSlides: Slide[] = data.map((blog: any, index: number) => ({
          image: urlFor(blog.mainImage).url(),
          title: blog.title,
          featured: index === 0,
          slug: blog.slug,
        }))

        setSlides(mappedSlides)

        if (mappedSlides.length > 0) {
          // Create an array of promises for loading all images
          const imagePromises = mappedSlides.map((slide, index) => {
            return new Promise<void>((resolve) => {
              const img = new Image()
              img.src = slide.image

              img.onload = () => {
                setLoadedImages((prev) => ({ ...prev, [index]: true }))
                resolve()
              }

              img.onerror = () => {
                setLoadedImages((prev) => ({ ...prev, [index]: true }))
                resolve()
              }
            })
          })

          // Wait for the first image to load before showing the slider
          await imagePromises[0]
          setIsInitialLoading(false)

          // Continue loading the rest of the images in the background
          Promise.all(imagePromises).then(() => {
            console.log("All slider images loaded")
          })
        } else {
          setIsInitialLoading(false)
        }
      } catch (error) {
        console.error("Error fetching/preloading slider data:", error)
        setIsInitialLoading(false)
      }
    }

    fetchAndPreload()
  }, [])

  const nextSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Generate a low-quality placeholder color based on the slide index
  const getPlaceholderColor = (index: number) => {
    const colors = ["#1A2E02", "#2A3E12", "#3A4E22"]
    return colors[index % colors.length]
  }

  return (
    <section className={`${styles.section.container} mb-8 md:mb-16`}>
      <h1 className="text-5xl sm:text-7xl md:text-[160px] font-semibold text-[#1A2E02] mb-4 md:mb-6">Blog</h1>

      <div className="relative pb-12 md:pb-16">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#1A2E02]">
          {/* Loading Skeleton */}
          {isInitialLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A2E02] z-10">
              <div className="w-12 h-12 border-4 border-t-[#97E12B] border-opacity-50 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Slides */}
          {!isInitialLoading && slides.length > 0 ? (
            <div
              className={`absolute inset-0 transition-transform duration-500 ease-in-out`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <Link
                  key={index}
                  to={`/blog/${slide.slug}`}
                  className="absolute inset-0 w-full h-full block"
                  style={{ left: `${index * 100}%` }}
                >
                  {/* Placeholder Color */}
                  <div className="absolute inset-0" style={{ backgroundColor: getPlaceholderColor(index) }} />

                  {/* Image with Loading State */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${loadedImages[index] ? "opacity-100" : "opacity-0"
                      }`}
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      filter: loadedImages[index] ? "none" : "blur(10px)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-12 z-10">
                    <div>
                      {slide.featured && (
                        <span className="inline-flex px-4 sm:px-8 md:px-12 py-1 sm:py-2 rounded-full bg-[#97E12B] text-xs sm:text-sm font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white max-w-3xl">{slide.title}</h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !isInitialLoading && <div className="absolute inset-0 flex items-center justify-center text-white">No stories found.</div>
          )}
        </div>

        {/* Navigation Arrows and Dots - Bottom, outside the image */}
        {slides.length > 0 && (
          <div
            className={`absolute -bottom-2 left-0 right-0 flex justify-between items-center px-2 sm:px-4 transition-opacity duration-300 ${isInitialLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            <div className="flex-1">{/* This empty div maintains layout balance */}</div>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? "bg-[#5A8E00]" : "bg-[#5A8E00]/50"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isInitialLoading}
                />
              ))}
            </div>
            <div className="flex gap-2 sm:gap-3 flex-1 justify-end">
              <button
                onClick={prevSlide}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-[#5A8E00] rounded-full bg-white flex items-center justify-center hover:bg-[#97E12B] transition-colors"
                aria-label="Previous slide"
                disabled={isInitialLoading}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8E00]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-[#5A8E00] rounded-full bg-white flex items-center justify-center hover:bg-[#97E12B] transition-colors"
                aria-label="Next slide"
                disabled={isInitialLoading}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8E00]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

