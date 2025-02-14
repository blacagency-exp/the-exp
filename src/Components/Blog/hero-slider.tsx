"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { styles } from "../../constants/styles"
import img1 from "../../assets/blogimg.png"

interface Slide {
  image: string
  title: string
  featured?: boolean
}

const slides: Slide[] = [
  {
    image: img1,
    title: "Discover Plateau: A Journey Through Nature, Culture, and Adventure",
    featured: true,
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "Exploring the Hidden Gems of Jos Plateau",
  },
  {
    image: "/placeholder.svg?height=600&width=1200",
    title: "A Guide to Local Cuisine and Traditional Dishes",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className={`${styles.section.container} mb-16`}>
      <h1 className="text-[160px] font-semibold text-[#1A2E02] mb-6">Blog</h1>

      <div className="relative pb-16">
        <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden">
          {/* Slides */}
          <div
            className="absolute inset-0 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="absolute inset-0 w-full h-full" style={{ left: `${index * 100}%` }}>
                {/* Image and Gradient Overlay */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-12">
                  <div>
                    {slide.featured && (
                      <span className="inline-flex px-12 py-2 rounded-full bg-[#97E12B] text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-medium text-white max-w-3xl">{slide.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows and Dots - Bottom, outside the image */}
        <div className="absolute -bottom-2 left-0 right-0 flex justify-between items-center px-4">
          <div className="flex-1">{/* This empty div maintains layout balance */}</div>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-[#5A8E00]" : "bg-[#5A8E00]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3 flex-1 justify-end">
            <button
              onClick={prevSlide}
              className="w-8 h-8 border border-[#5A8E00] rounded-full bg-white flex items-center justify-center hover:bg-[#97E12B] transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-[#5A8E00]" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 border border-[#5A8E00]  rounded-full bg-white flex items-center justify-center hover:bg-[#97E12B] transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-[#5A8E00]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

