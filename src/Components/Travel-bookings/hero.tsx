"use client"

import img1 from "../../assets/travel-image.png"

export function Hero() {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
            backgroundImage: `url(${img1})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" /> {/* Overlay for better text visibility */}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <h1 className="text-[8rem] leading-none font-bold text-white text-center max-w-[12ch]">Plan your Adventure</h1>
        
      </div>
    </div>
  )
}

