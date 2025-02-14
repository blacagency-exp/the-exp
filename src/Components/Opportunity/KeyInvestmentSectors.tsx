import { styles } from "@/constants/styles"
import img from "../../assets/logo_down.png"

const sectors = [
  {
    title: "Renewable Energy",
    description: "Plateau's sunlight hours and elevation are perfect for solar and wind energy projects.",
    opportunities: "Solar farms, wind installations, and small hydroelectric ventures.",
    width: "w-full",
    height: "h-[322px]",
  },
  {
    title: "Real Estate and Infrastructure Development",
    description: "Increasing urbanization drives demand for housing, commercial spaces, and infrastructure.",
    opportunities: "Residential estates, shopping malls, and transport infrastructure projects.",
    width: "w-full",
    height: "h-[439px]",
  },
  {
    title: "Mining and Mineral Processing",
    description:
      "Known for its rich deposits of tin, columbite, and gemstones, Plateau offers a profitable environment for sustainable mining.",
    opportunities: "Mineral extraction, processing plants, and equipment leasing.",
    width: "w-full",
    height: "h-[364px]",
  },
  {
    title: "Agriculture and Agribusiness",
    description:
      "Plateau's unique highland climate supports diverse crops like strawberries, potatoes, and wheat, making it ideal for agribusiness.",
    opportunities: "Commercial farming, dairy processing, cold storage, and crop exports.",
    width: "w-full",
    height: "h-[364px]",
  },
  {
    title: "Tourism and Hospitality",
    description:
      "With scenic landscapes and cool climate, Plateau is a growing destination for eco-tourism and adventure travel.",
    opportunities: "Hotels, eco-lodges, tour services, and cultural attractions.",
    width: "w-full",
    height: "h-[333px]",
  },
]

export function KeyInvestmentSectors() {
  return (
    <section className="bg-[#141E03] py-24">
      <div className={styles.section.container}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-24">
          {/* Left Column */}
          <div className="space-y-6 mt-32">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Key Investment
              <br />
              Sectors in
              <br />
              Plateau State
            </h2>
            <p className="text-white/80 max-w-xl text-lg pt-24">
              With its unique highland climate, Plateau State is ideal for year-round farming, including crops and
              livestock. The cooler weather supports crops that are difficult to cultivate elsewhere in Nigeria, such as
              strawberries, potatoes, and high-quality vegetables. According to recent state agricultural data, Plateau
              produces over 200,000 metric tons of Irish potatoes annually, making it Nigeria's leading producer and a
              prime region for agro-based investments.
            </p>
            {/* Decorative Logo */}
            <div className="pt-[360px] ">
              <img src={img} alt="Plateau State Logo" className="w-42 h-32" />
            </div>
          </div>

          {/* Right Column - Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6">
            {/* First Column of Sectors (2 sectors) */}
            <div className="space-y-6 md:mt-[300px]">
              {sectors.slice(0, 2).map((sector) => (
                <div
                  key={sector.title}
                  className={`bg-[#1C2805] rounded-3xl p-8 space-y-4 ${sector.width} ${sector.height}`}
                >
                  <div className="w-12 h-12 bg-[#97E12B] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L24 20.7846H0L12 0Z" fill="#1C2805" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">{sector.title}</h3>
                  <p className="text-white/80 text-md font-normal">{sector.description}</p>
                  <div className="text-md">
                    <span className="text-[#97E12B] font-medium">Opportunities: </span>
                    <span className="text-white/80 ">{sector.opportunities}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Column of Sectors (3 sectors) */}
            <div className="space-y-6 md:mt-36">
              {sectors.slice(2).map((sector, index) => (
                <div
                  key={sector.title}
                  className={`bg-[#1C2805] rounded-3xl p-8 space-y-4 ${sector.width} ${sector.height} ${
                    index === 0 ? "md:-mt-16" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-[#97E12B] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L24 20.7846H0L12 0Z" fill="#1C2805" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">{sector.title}</h3>
                  <p className="text-white/80 text-md font-normal">{sector.description}</p>
                  <div className="text-md">
                    <span className="text-[#97E12B] font-bold">Opportunities: </span>
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

