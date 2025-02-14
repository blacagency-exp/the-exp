import { styles } from "@/constants/styles"
import { ArrowLeft, ArrowRight } from "lucide-react"
import img1 from '../../assets/elephant.png'

export function OpportunitiesHero() {
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
          <div className="grid grid-cols-2 gap-16 mt-48">
            <div className="space-y-4">
              <div className="space-y-1 mb-16">
                <h2 className="text-4xl font-bold text-white">Why Invest in Plateau State?</h2>
                <p className="text-[#97E12B]">Dive into unforgettable experiences</p>
              </div>
              <img
                src={img1}
                alt="Plateau State wildlife"
                className="w-[470px] aspect-[4/3] object-cover rounded-2xl"
              />
              <p className="text-md text-white/70 max-w-[480px]">
                Plateau State's central location in Nigeria places it at a logistical advantage for trade and commerce.
                The state is well-connected through road and air links. With a growing population and skilled workforce,
                the state and regions are ready for further infrastructure development, including expanded road networks
                and utilities. The investment climate in Plateau is a rising competitor to its top North-Central rivals.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-white/50 text-sm text-right mb-16 mt-12">Is there more places you want to see?</p>

              <div className="space-y-6">
                <button className="w-full bg-white/90 text-black font-bold py-8 px-6 rounded-3xl flex items-center gap-4 hover:bg-white transition-colors text-left">
                  <ArrowLeft className="h-6 w-6" />
                  <span className="text-lg">Strategic Location and Accessibility</span>
                </button>

                <button className="w-full bg-[#5A8E00] text-white font-bold py-8 px-6 rounded-3xl flex items-center gap-4 hover:bg-[#97E12B] transition-colors text-left">
                  <ArrowRight className="h-6 w-6" />
                  <span className="text-lg">Favorable Climate for Agriculture</span>
                </button>

                <button className="w-full bg-[#5A8E00] text-white font-bold py-8 px-6 rounded-3xl flex items-center gap-4 hover:bg-[#97E12B] transition-colors text-left">
                  <ArrowRight className="h-6 w-6" />
                  <span className="text-lg">Abundant Natural Resources</span>
                </button>

                <button className="w-full bg-[#5A8E00] text-white font-bold py-8 px-6 rounded-3xl flex items-center gap-4 hover:bg-[#97E12B] transition-colors text-left">
                  <ArrowRight className="h-6 w-6" />
                  <span className="text-lg">Growing Population and Workforce</span>
                </button>

                <button className="w-full bg-[#5A8E00] text-white font-bold py-8 px-6 rounded-3xl flex items-center gap-4 hover:bg-[#97E12B] transition-colors text-left">
                  <ArrowRight className="h-6 w-6" />
                  <span className="text-lg">Supportive Government Policies</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

