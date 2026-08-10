import { useState, useEffect } from "react"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { ShopFeatures } from "@/Components/Shop/shop-features"
import { Newsletter } from "@/Components/Shop/newsletter"
import axios from "axios"
import { API_URL } from "@/config/api"
import "../../src/types/paystack-global"

const kits = [
  { name: "Home Kit",      price: 20000, promoPrice: 15000, tag: "5K OFF", color: "#1A6B2C" },
  { name: "Away Kit",      price: 20000, promoPrice: 15000, tag: "5K OFF", color: "#F7D000" },
  { name: "Alternate Kit", price: 20000, promoPrice: 15000, tag: "5K OFF", color: "#141E03" },
  { name: "Training Kit",  price: 25000, promoPrice: null,  tag: null,      color: "#1A6B2C" },
  { name: "Hoodie",        price: 40000, promoPrice: null,  tag: null,      color: "#141E03" },
  { name: "Tracksuit",     price: 50000, promoPrice: null,  tag: null,      color: "#1A6B2C" },
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

function formatNGN(n: number) {
  return `₦${n.toLocaleString()}`
}

interface OrderModalProps {
  kit: typeof kits[0]
  onClose: () => void
}

function OrderModal({ kit, onClose }: OrderModalProps) {
  const [firstName, setFirstName]       = useState("")
  const [lastName, setLastName]         = useState("")
  const [email, setEmail]               = useState("")
  const [phone, setPhone]               = useState("")
  const [size, setSize]                 = useState("")
  const [quantity, setQuantity]         = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [isScriptLoaded, setIsScriptLoaded]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [success, setSuccess]           = useState(false)

  const unitPrice = kit.promoPrice ?? kit.price
  const total     = unitPrice * quantity

  useEffect(() => {
    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')
    if (existing) { setIsScriptLoaded(true); return }
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  const formComplete = firstName && lastName && email && phone && size && deliveryAddress

  const handlePay = async () => {
    if (!formComplete || !isScriptLoaded) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(`${API_URL}/api/plateau-united/initialize-payment`, {
        email, firstName, lastName, phone,
        kitName: kit.name, size, quantity, deliveryAddress,
      })

      if (!data.data?.reference) throw new Error("Invalid response from server")

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: total * 100,
        ref: data.data.reference,
        metadata: {
          custom_fields: [
            { display_name: "Kit",     variable_name: "kit",     value: kit.name },
            { display_name: "Size",    variable_name: "size",    value: size },
            { display_name: "Qty",     variable_name: "qty",     value: String(quantity) },
            { display_name: "Phone",   variable_name: "phone",   value: phone },
          ]
        },
        onClose: () => setLoading(false),
        callback: async (response: { reference: string }) => {
          try {
            await axios.get(`${API_URL}/api/plateau-united/verify-payment/${response.reference}`)
            setSuccess(true)
          } catch {
            setError("Payment received but verification failed. Contact us with your reference: " + response.reference)
          } finally {
            setLoading(false)
          }
        },
      })
      handler.openIframe()
    } catch (e) {
      setError(axios.isAxiosError(e) ? e.response?.data?.error ?? e.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A6B2C] px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-[#F7D000] font-black text-xl">{kit.name}</h2>
            <p className="text-white/80 text-sm">Plateau United Official Merchandise</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">✕</button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-black text-[#1A6B2C] mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 text-sm">A confirmation email has been sent to <strong>{email}</strong>. Our team will reach out to arrange delivery.</p>
            <button onClick={onClose} className="mt-6 bg-[#F7D000] text-[#141E03] font-bold px-8 py-3 rounded-lg w-full">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Size */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Size</label>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                      size === s
                        ? "bg-[#1A6B2C] text-white border-[#1A6B2C]"
                        : "border-gray-200 text-gray-700 hover:border-[#1A6B2C]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-full border border-gray-200 text-lg font-bold hover:bg-gray-50">−</button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-full border border-gray-200 text-lg font-bold hover:bg-gray-50">+</button>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B2C]" placeholder="First name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B2C]" placeholder="Last name" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B2C]" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B2C]" placeholder="08012345678" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Delivery Address</label>
              <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B2C] resize-none" placeholder="Full delivery address" />
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-black text-[#141E03]">{formatNGN(total)}</p>
              </div>
              {kit.promoPrice && (
                <span className="text-xs bg-[#F7D000] text-[#141E03] font-bold px-2 py-1 rounded-full">5K OFF Promo</span>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handlePay}
              disabled={!formComplete || loading || !isScriptLoaded}
              className="w-full bg-[#F7D000] hover:bg-[#e0bc00] text-[#141E03] font-black py-3.5 rounded-lg uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay ${formatNGN(total)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function PlateauUnitedPage() {
  const [selectedKit, setSelectedKit] = useState<typeof kits[0] | null>(null)

  return (
    <BaseLayout>
      <div className="flex flex-col">

        {/* Hero */}
        <section className="relative w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] bg-[#F7D000] flex flex-col items-center justify-end">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <span className="font-black text-[#1A6B2C] opacity-10 text-[28vw] leading-none uppercase tracking-tighter">
              PUFC
            </span>
          </div>
          <div className="relative z-10 text-center mb-12 lg:mb-20 px-4">
            <p className="text-[#1A6B2C] text-sm font-semibold tracking-widest uppercase mb-4">Official Merchandise</p>
            <h1 className="text-[52px] md:text-[72px] font-black leading-none mb-2 text-[#141E03] uppercase tracking-tight">Plateau</h1>
            <h1 className="text-[52px] md:text-[72px] font-black leading-none mb-8 text-[#1A6B2C] uppercase tracking-tight">United</h1>
            <button
              onClick={() => document.getElementById("kits")?.scrollIntoView({ behavior: "smooth" })}
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
              <h2 className="text-[36px] md:text-[48px] font-black text-[#141E03] uppercase tracking-tight">Kits & Apparel</h2>
              <p className="text-[#6F706F] mt-2 text-base">Rep the Pride of Plateau — official kits, hoodies and tracksuits</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map((kit) => (
                <div key={kit.name} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-56 flex items-center justify-center relative" style={{ backgroundColor: kit.color }}>
                    {kit.tag && (
                      <span className="absolute top-4 right-4 bg-[#F7D000] text-[#141E03] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                        {kit.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <path d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z" fill="white" opacity="0.6" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  <div className="p-5 bg-white">
                    <h3 className="text-[18px] font-bold text-[#141E03]">{kit.name}</h3>
                    <p className="text-[#6F706F] text-sm mt-1">Plateau United Official</p>
                    <div className="flex items-center gap-3 mt-3">
                      {kit.promoPrice ? (
                        <>
                          <span className="text-[22px] font-black text-[#1A6B2C]">{formatNGN(kit.promoPrice)}</span>
                          <span className="text-sm text-gray-400 line-through">{formatNGN(kit.price)}</span>
                        </>
                      ) : (
                        <span className="text-[22px] font-black text-[#141E03]">{formatNGN(kit.price)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedKit(kit)}
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

        <Newsletter />
        <ShopFeatures />
      </div>

      {selectedKit && <OrderModal kit={selectedKit} onClose={() => setSelectedKit(null)} />}
    </BaseLayout>
  )
}

export default PlateauUnitedPage
