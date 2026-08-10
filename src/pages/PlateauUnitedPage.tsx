import { BaseLayout } from "../Components/layout/BaseLayout";
import { ShopFeatures } from "@/Components/Shop/shop-features";
import { Newsletter } from "@/Components/Shop/newsletter";

const kits = [
  {
    name: "Home Kit",
    price: 20000,
    promoPrice: 15000,
    tag: "5K OFF",
    description: "Official Plateau United Home Jersey",
    color: "#1A6B2C",
  },
  {
    name: "Away Kit",
    price: 20000,
    promoPrice: 15000,
    tag: "5K OFF",
    description: "Official Plateau United Away Jersey",
    color: "#F7D000",
  },
  {
    name: "Alternate Kit",
    price: 20000,
    promoPrice: 15000,
    tag: "5K OFF",
    description: "Official Plateau United Third Jersey",
    color: "#141E03",
  },
  {
    name: "Training Kit",
    price: 25000,
    promoPrice: null,
    tag: null,
    description: "Official Plateau United Training Kit",
    color: "#1A6B2C",
  },
  {
    name: "Hoodie",
    price: 40000,
    promoPrice: null,
    tag: null,
    description: "Plateau United Premium Hoodie",
    color: "#141E03",
  },
  {
    name: "Tracksuit",
    price: 50000,
    promoPrice: null,
    tag: null,
    description: "Plateau United Full Tracksuit",
    color: "#1A6B2C",
  },
];

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString()}`
}

function handleOrder(kitName: string) {
  const msg = encodeURIComponent(`Hi, I'd like to order the Plateau United ${kitName}. Please share more details.`)
  window.open(`https://wa.me/2349137049586?text=${msg}`, "_blank")
}

export function PlateauUnitedPage() {
  return (
    <BaseLayout>
      <div className="flex flex-col">

        {/* Hero */}
        <section className="relative w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] bg-[#F7D000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="select-none font-black text-[#1A6B2C] opacity-10 text-[28vw] leading-none uppercase tracking-tighter pointer-events-none">
              PUFC
            </span>
          </div>
          <div className="relative z-10 text-center mb-12 lg:mb-20 px-4">
            <p className="text-[#1A6B2C] text-sm font-semibold tracking-widest uppercase mb-4">
              Official Merchandise
            </p>
            <h1 className="text-[52px] md:text-[72px] font-black leading-none mb-2 text-[#141E03] uppercase tracking-tight">
              Plateau
            </h1>
            <h1 className="text-[52px] md:text-[72px] font-black leading-none mb-8 text-[#1A6B2C] uppercase tracking-tight">
              United
            </h1>
            <button
              onClick={() => document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#1A6B2C] hover:bg-[#145422] text-[#F7D000] px-10 py-3 rounded-lg text-[15px] font-semibold tracking-wide uppercase transition-colors"
            >
              Shop Kits
            </button>
          </div>
        </section>

        {/* Promo Banner */}
        <div className="bg-[#1A6B2C] py-4 px-6 text-center">
          <p className="text-[#F7D000] font-semibold text-sm tracking-widest uppercase">
            🏆 Limited Promo — ₦5,000 Off All Match Kits
          </p>
        </div>

        {/* Product Grid */}
        <section id="kits" className="bg-white py-16 px-4 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-[36px] md:text-[48px] font-black text-[#141E03] uppercase tracking-tight">
                Kits & Apparel
              </h2>
              <p className="text-[#6F706F] mt-2 text-base">
                Rep the Pride of Plateau — official kits, hoodies and tracksuits
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map((kit) => (
                <div
                  key={kit.name}
                  className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Card visual */}
                  <div
                    className="h-56 flex items-center justify-center relative"
                    style={{ backgroundColor: kit.color }}
                  >
                    {kit.tag && (
                      <span className="absolute top-4 right-4 bg-[#F7D000] text-[#141E03] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                        {kit.tag}
                      </span>
                    )}
                    <span className="text-white/20 font-black text-[96px] leading-none select-none uppercase">
                      PU
                    </span>
                    {/* Jersey icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-60">
                        <path d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-5 bg-white">
                    <h3 className="text-[18px] font-bold text-[#141E03]">{kit.name}</h3>
                    <p className="text-[#6F706F] text-sm mt-1">{kit.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {kit.promoPrice ? (
                        <>
                          <span className="text-[22px] font-black text-[#1A6B2C]">
                            {formatNGN(kit.promoPrice)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatNGN(kit.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[22px] font-black text-[#141E03]">
                          {formatNGN(kit.price)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleOrder(kit.name)}
                      className="mt-4 w-full bg-[#F7D000] hover:bg-[#e0bc00] text-[#141E03] font-bold py-3 rounded-lg text-sm uppercase tracking-wide transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />

        {/* Features */}
        <ShopFeatures />
      </div>
    </BaseLayout>
  )
}

export default PlateauUnitedPage
