"use client"

import { useState } from "react"
import { styles } from "@/constants/styles"
import { ArrowLeft, ArrowRight } from "lucide-react"
import img1 from "../../assets/bg_count.jpg"
import img2 from "../../assets/water_front.jpg"
import img3 from "../../assets/boat.jpg"
import img4 from "../../assets/enoch.jpg"
import img5 from "../../assets/horses.jpg"

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

  return (
    <>
      {/* Title Section */}
      <section className="relative pb-32">
        <div className={styles.section.container}>
          <h1 className="text-[120px] text-center font-semibold leading-none mb-16 mt-24">
            Meet
            <br />
            Opportunities
          </h1>
        </div>

        {/* Stats Card - Positioned to overlap */}
        <div className={`${styles.section.container} relative z-10`}>
          <div className="bg-[#5A8E00] rounded-[2rem] p-12 max-w-[999px] mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">4 Million</div>
                <div className="text-white/90 text-center">Population</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">English, Hausa</div>
                <div className="text-white/90 text-center">Official Language(s)</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">70%</div>
                <div className="text-white/90 text-center">Literacy Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">54 Years</div>
                <div className="text-white/90 text-center">Life Expectancy</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">78%</div>
                <div className="text-white/90 text-center">Employment Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white text-center">8 Billion USD</div>
                <div className="text-white/90 text-center">GDP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section - Full width background */}
      <section className="bg-[#141E03] -mt-64 pt-24 pb-24 relative">
        <div className={styles.section.container}>
          <div className="grid grid-cols-2 gap-12 mt-48">
            <div className="space-y-4">
              <div className="space-y-1 mb-16">
                <h2 className="text-4xl font-bold text-white">Why Invest in Plateau State?</h2>
                <p className="text-[#97E12B]">Dive into unforgettable experiences</p>
              </div>
              <img
                src={investmentOptions[activeIndex].image || "/placeholder.svg"}
                alt={`Plateau State - ${investmentOptions[activeIndex].title}`}
                className="w-[570px] aspect-[4/3] object-cover rounded-2xl"
              />
              <p className="text-md text-white/70 max-w-[570px]">{investmentOptions[activeIndex].description}</p>
            </div>

            <div className="space-y-6">
              <p className="text-white/50 text-sm text-right mb-16 mt-12">Is there more places you want to see?</p>

              <div className="space-y-6">
                {investmentOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full ${
                      index === activeIndex ? "bg-white/90 text-black" : "bg-[#5A8E00] text-white"
                    } font-bold py-8 px-6 rounded-full flex items-center gap-4 hover:bg-white hover:text-black transition-colors text-left`}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {index === activeIndex ? <ArrowLeft className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
                    <span className="text-lg">{option.title}</span>
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

