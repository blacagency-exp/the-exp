import { styles } from "@/constants/styles"
import img from "../../assets/logo_down.png"
import logo from "../../assets/Union.png"

const sectors = [
  {
    title: "Renewable Energy",
    description: "Plateau's sunlight hours and elevation are perfect for solar and wind energy projects.",
    opportunities: "Solar farms, wind installations, and small hydroelectric ventures.",
    width: "w-full",
    height: "h-auto md:h-[322px]",
  },
  {
    title: "Real Estate and Infrastructure Development",
    description: "Increasing urbanization drives demand for housing, commercial spaces, and infrastructure.",
    opportunities: "Residential estates, shopping malls, and transport infrastructure projects.",
    width: "w-full",
    height: "h-auto md:h-[439px]",
  },
  {
    title: "Mining and Mineral Processing",
    description:
      "Known for its rich deposits of tin, columbite, and gemstones, Plateau offers a profitable environment for sustainable mining.",
    opportunities: "Mineral extraction, processing plants, and equipment leasing.",
    width: "w-full",
    height: "h-auto md:h-[364px]",
  },
  {
    title: "Agriculture and Agribusiness",
    description:
      "Plateau's unique highland climate supports diverse crops like strawberries, potatoes, and wheat, making it ideal for agribusiness.",
    opportunities: "Commercial farming, dairy processing, cold storage, and crop exports.",
    width: "w-full",
    height: "h-auto md:h-[364px]",
  },
  {
    title: "Tourism and Hospitality",
    description:
      "With scenic landscapes and cool climate, Plateau is a growing destination for eco-tourism and adventure travel.",
    opportunities: "Hotels, eco-lodges, tour services, and cultural attractions.",
    width: "w-full",
    height: "h-auto md:h-[333px]",
  },
]

export function KeyInvestmentSectors() {
  return (
    <section className="bg-[#141E03] py-12 md:py-24">
      <div className={`${styles.section.container} px-4 md:px-6`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8 lg:gap-24">
          {/* Left Column */}
          <div className="space-y-6 mt-8 lg:mt-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Key Investment
              <br />
              Sectors in
              <br />
              Plateau State
            </h2>
            <p className="text-white/80 max-w-xl text-base md:text-lg pt-8 md:pt-24">
              With its unique highland climate, Plateau State is ideal for year-round farming, including crops and
              livestock. The cooler weather supports crops that are difficult to cultivate elsewhere in Nigeria, such as
              strawberries, potatoes, and high-quality vegetables. According to recent state agricultural data, Plateau
              produces over 200,000 metric tons of Irish potatoes annually, making it Nigeria's leading producer and a
              prime region for agro-based investments.
            </p>
            {/* Decorative Logo */}
            <div className="pt-12 md:pt-[360px]">
              <img src={img || "/placeholder.svg"} alt="Plateau State Logo" className="w-32 h-24 md:w-42 md:h-32" />
            </div>
          </div>

          {/* Right Column - Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6">
            {/* First Column of Sectors (2 sectors) */}
            <div className="space-y-6 mt-8 md:mt-[300px]">
              {sectors.slice(0, 2).map((sector) => (
                <div
                  key={sector.title}
                  className={`bg-[#1C2805] rounded-3xl p-6 md:p-8 space-y-4 ${sector.width} ${sector.height}`}
                >
                  <div className="w-20 h-12 md:w-24 md:h-14 flex items-center justify-start">
                    <img className="w-12 h-10 md:w-14 md:h-12" src={logo || "/placeholder.svg"} alt="" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{sector.title}</h3>
                  <p className="text-white/80 text-sm md:text-md font-normal">{sector.description}</p>
                  <div className="text-sm md:text-md">
                    <span className="text-white font-medium">Opportunities: </span>
                    <span className="text-white/80">{sector.opportunities}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Column of Sectors (3 sectors) */}
            <div className="space-y-6 mt-6 md:mt-36">
              {sectors.slice(2).map((sector, index) => (
                <div
                  key={sector.title}
                  className={`bg-[#1C2805] rounded-3xl p-6 md:p-8 space-y-4 ${sector.width} ${sector.height} ${
                    index === 0 ? "md:-mt-16" : ""
                  }`}
                >
                  <div className="w-20 h-12 md:w-24 md:h-14 flex items-center justify-start">
                    <img className="w-12 h-10 md:w-14 md:h-12" src={logo || "/placeholder.svg"} alt="" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{sector.title}</h3>
                  <p className="text-white/80 text-sm md:text-md font-normal">{sector.description}</p>
                  <div className="text-sm md:text-md">
                    <span className="text-white font-bold">Opportunities: </span>
                    <span className="text-white/80">{sector.opportunities}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

