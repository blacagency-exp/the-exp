import { styles } from "../../constants/styles"
import img1 from "../../assets/boat.jpg"
import img2 from "../../assets/bright.jpg"
import img3 from "../../assets/horses.jpg"
import img4 from "../../assets/stadium.jpg"
import img5 from "../../assets/iwang2.jpg"
import img6 from "../../assets/iwang1.jpg"
import { Marquee } from "./Marquee"

export function ExperienceGrid() {
  const GridContent = () => (
    <div className="hidden md:block flex-shrink-0 px-3">
      <div className="grid grid-cols-[1fr_1fr_1.6fr_1fr] gap-6 h-[300px] lg:h-[478px]">
        <div className="row-span-2 relative rounded-3xl overflow-hidden">
          <img
            src={img4 || "/placeholder.svg"}
            alt="Rock formations in Plateau"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col space-y-6">
          <div className="relative rounded-3xl overflow-hidden h-[145px] lg:h-[230px]">
            <img
              src={img5 || "/placeholder.svg"}
              alt="Traditional mud building"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative rounded-3xl overflow-hidden h-[145px] lg:h-[230px]">
            <img src={img1 || "/placeholder.svg"} alt="Boat on water" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="row-span-2 relative rounded-3xl overflow-hidden col-span-1">
          <img src={img2 || "/placeholder.svg"} alt="Large rock formations" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col space-y-6">
          <div className="relative rounded-3xl overflow-hidden h-[145px] lg:h-[230px]">
            <img src={img3 || "/placeholder.svg"} alt="Covered entrance" className="w-full h-full object-cover" />
          </div>
          <div className="relative rounded-3xl overflow-hidden h-[145px] lg:h-[230px]">
            <img src={img6 || "/placeholder.svg"} alt="Final image" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )

  const MobileContent = () => {
    const images = [img4, img5, img1, img2, img3, img6]

    return (
      <div className="md:hidden overflow-hidden relative">
        <div
          className="flex pointer-events-none"
          style={{
            animation: "scroll 40s linear infinite",
          }}
        >
          {/* First set of images */}
          {images.map((img, index) => (
            <div
              key={`first-${index}`}
              className="flex-none w-[280px] h-[200px] mx-2 relative rounded-3xl overflow-hidden"
            >
              <img src={img || "/placeholder.svg"} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Duplicate set of images for seamless loop */}
          {images.map((img, index) => (
            <div
              key={`second-${index}`}
              className="flex-none w-[280px] h-[200px] mx-2 relative rounded-3xl overflow-hidden"
            >
              <img src={img || "/placeholder.svg"} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Third set of images for extra smoothness */}
          {images.map((img, index) => (
            <div
              key={`third-${index}`}
              className="flex-none w-[280px] h-[200px] mx-2 relative rounded-3xl overflow-hidden"
            >
              <img src={img || "/placeholder.svg"} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#141E03] mt-24 overflow-hidden">
      <div className={styles.section.container}>
        <div className="space-y-6 mb-12 text-center lg:text-left px-4">
          <h3 className="text-[#97E12B] text-2xl lg:text-2xl uppercase tracking-wider font-medium">Explore</h3>
          <h2 className="text-[2.5rem] lg:text-5xl font-bold text-white leading-tight whitespace-nowrap">
            The experience
          </h2>
          <p className="text-[#5A8E00] text-lg lg:text-xl font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
            Special events and activities happening in Plateau State
          </p>
        </div>
      </div>
      <div className="relative w-full">
        {/* Desktop Marquee */}
        <div className="hidden md:block overflow-hidden">
          <Marquee className="[--duration:40s]">
            <GridContent />
            <GridContent />
          </Marquee>
        </div>
        {/* Mobile Scroll */}
        <MobileContent />
      </div>
    </div>
  )
}

