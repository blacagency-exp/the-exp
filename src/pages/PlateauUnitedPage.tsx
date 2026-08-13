import { useState, useEffect } from "react"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { Newsletter } from "@/Components/Shop/newsletter"
import axios from "axios"
import { API_URL } from "@/config/api"
import "../../src/types/paystack-global"

const kits = [
  { name: "Home Kit",      price: 20000, promoPrice: 15000, bgColor: "#1A6B2C", textColor: "#F7D000" },
  { name: "Away Kit",      price: 20000, promoPrice: 15000, bgColor: "#F7D000", textColor: "#1A6B2C" },
  { name: "Alternate Kit", price: 20000, promoPrice: 15000, bgColor: "#111111", textColor: "#FFFFFF" },
  { name: "Training Kit",  price: 25000, promoPrice: null,  bgColor: "#1A6B2C", textColor: "#F7D000" },
  { name: "Hoodie",        price: 40000, promoPrice: null,  bgColor: "#111111", textColor: "#FFFFFF" },
  { name: "Tracksuit",     price: 50000, promoPrice: null,  bgColor: "#F7D000", textColor: "#1A6B2C" },
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ""

const condensed: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.01em",
  lineHeight: 1,
}

function formatNGN(n: number) {
  return `₦${n.toLocaleString()}`
}

interface OrderModalProps {
  kit: typeof kits[0]
  onClose: () => void
}

function OrderModal({ kit, onClose }: OrderModalProps) {
  const [firstName, setFirstName]             = useState("")
  const [lastName, setLastName]               = useState("")
  const [email, setEmail]                     = useState("")
  const [phone, setPhone]                     = useState("")
  const [size, setSize]                       = useState("")
  const [quantity, setQuantity]               = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [isScriptLoaded, setIsScriptLoaded]   = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [success, setSuccess]                 = useState(false)

  const unitPrice = kit.promoPrice ?? kit.price
  const total = unitPrice * quantity

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
            { display_name: "Kit",   variable_name: "kit",   value: kit.name },
            { display_name: "Size",  variable_name: "size",  value: size },
            { display_name: "Qty",   variable_name: "qty",   value: String(quantity) },
            { display_name: "Phone", variable_name: "phone", value: phone },
          ]
        },
        onClose: () => setLoading(false),
        callback: async (response: { reference: string }) => {
          try {
            await axios.get(`${API_URL}/api/plateau-united/verify-payment/${response.reference}`)
            setSuccess(true)
          } catch {
            setError("Payment received. Contact us with reference: " + response.reference)
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p style={condensed} className="text-2xl text-[#111]">{kit.name}</p>
            <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">Plateau United FC</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-xl">✕</button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-[#1A6B2C] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={condensed} className="text-3xl text-[#111] mb-2">Order Confirmed</p>
            <p className="text-gray-500 text-sm leading-relaxed">A confirmation has been sent to <strong>{email}</strong>. We'll be in touch about delivery.</p>
            <button onClick={onClose} className="mt-8 w-full bg-[#111] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#333] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-5">
            {/* Size */}
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-10 text-sm border transition-colors ${
                      size === s ? "border-[#111] bg-[#111] text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Quantity</p>
              <div className="flex items-center gap-4 border border-gray-200 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg hover:bg-gray-50">−</button>
                <span className="text-sm w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg hover:bg-gray-50">+</button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", value: firstName, set: setFirstName, placeholder: "First" },
                { label: "Last Name",  value: lastName,  set: setLastName,  placeholder: "Last" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-1.5">{label}</p>
                  <input value={value} onChange={(e) => set(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder={placeholder} />
                </div>
              ))}
            </div>

            {[
              { label: "Email",   value: email,  set: setEmail,  type: "email", placeholder: "your@email.com" },
              { label: "Phone",   value: phone,  set: setPhone,  type: "tel",   placeholder: "08012345678" },
            ].map(({ label, value, set, type, placeholder }) => (
              <div key={label}>
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-1.5">{label}</p>
                <input type={type} value={value} onChange={(e) => set(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                  placeholder={placeholder} />
              </div>
            ))}

            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1.5">Delivery Address</p>
              <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none"
                placeholder="Full delivery address" />
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-400">Total</p>
                <p style={condensed} className="text-2xl text-[#111]">{formatNGN(total)}</p>
              </div>
              {kit.promoPrice && (
                <span className="text-xs bg-[#F7D000] text-[#111] px-2 py-1 font-bold tracking-wider uppercase">5K OFF</span>
              )}
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handlePay}
              disabled={!formComplete || loading || !isScriptLoaded}
              className="w-full bg-[#1A6B2C] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#145422] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
      <div className="flex flex-col bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full min-h-[92vh] flex flex-col lg:flex-row">
          {/* Left: editorial text */}
          <div className="flex-1 flex flex-col justify-end px-8 md:px-14 pb-12 pt-20 bg-white">
            <p className="text-xs tracking-[0.25em] uppercase text-[#1A6B2C] mb-6">Official Merchandise · 2026</p>
            <h1 style={condensed} className="text-[clamp(72px,14vw,180px)] text-[#111] mb-6 leading-none">
              Plateau<br/>
              <span className="text-[#1A6B2C]">United</span>
            </h1>
            <p className="text-gray-500 text-base max-w-xs mb-10 leading-relaxed">
              Wear the Pride of Plateau. Official kits, training gear and apparel — for those who rep the green.
            </p>
            <button
              onClick={() => document.getElementById("kits")?.scrollIntoView({ behavior: "smooth" })}
              className="self-start border border-[#111] px-8 py-3.5 text-xs tracking-widest uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors"
            >
              Shop the Collection
            </button>
          </div>

          {/* Right: visual block */}
          <div className="lg:w-[45%] min-h-[50vh] lg:min-h-0 bg-[#1A6B2C] flex items-center justify-center relative overflow-hidden">
            <span
              style={{ ...condensed, fontSize: "clamp(120px, 22vw, 320px)", lineHeight: 1 }}
              className="text-white/10 select-none absolute"
            >
              PU
            </span>
            <svg width="160" height="160" viewBox="0 0 80 80" fill="none" className="relative z-10 opacity-70">
              <path d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z"
                fill="#F7D000" strokeLinejoin="round"/>
            </svg>
            {/* Promo tag */}
            <div className="absolute bottom-8 left-8 bg-[#F7D000] px-4 py-2">
              <p style={condensed} className="text-[#111] text-lg">5K Off Match Kits</p>
            </div>
          </div>
        </section>

        {/* ── Divider line ─────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 mx-8 md:mx-14" />

        {/* ── Collection header ─────────────────────────────────────────── */}
        <section id="kits" className="px-8 md:px-14 pt-16 pb-8">
          <div className="flex items-end justify-between">
            <p style={condensed} className="text-[clamp(40px,6vw,80px)] text-[#111]">The Collection</p>
            <p className="text-gray-400 text-sm tracking-widest uppercase hidden md:block">{kits.length} Products</p>
          </div>
        </section>

        {/* ── Product grid ──────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {kits.map((kit) => (
              <div key={kit.name} className="bg-white group">
                {/* Image area */}
                <div
                  className="relative overflow-hidden"
                  style={{ backgroundColor: kit.bgColor, aspectRatio: "3/4" }}
                >
                  {kit.promoPrice && (
                    <span className="absolute top-4 left-4 z-10 bg-[#F7D000] text-[#111] text-[10px] font-black tracking-widest uppercase px-2.5 py-1">
                      5K OFF
                    </span>
                  )}
                  {/* Large background letter */}
                  <span
                    style={{ ...condensed, color: kit.textColor, opacity: 0.08, fontSize: "clamp(140px, 20vw, 240px)" }}
                    className="absolute -bottom-4 -right-4 leading-none select-none"
                  >
                    PU
                  </span>
                  {/* Jersey SVG */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      width="120" height="120" viewBox="0 0 80 80" fill="none"
                      className="transition-transform duration-500 group-hover:scale-110"
                    >
                      <path
                        d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z"
                        fill={kit.textColor} opacity="0.7" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {/* Kit name watermark */}
                  <div className="absolute bottom-5 left-5">
                    <p style={{ ...condensed, color: kit.textColor, fontSize: 13, opacity: 0.5, letterSpacing: "0.15em" }}>
                      {kit.name.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="px-5 py-5 border-t border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={condensed} className="text-[22px] text-[#111]">{kit.name}</p>
                      <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">Plateau United FC</p>
                    </div>
                    <div className="text-right">
                      {kit.promoPrice ? (
                        <>
                          <p style={condensed} className="text-xl text-[#1A6B2C]">{formatNGN(kit.promoPrice)}</p>
                          <p className="text-xs text-gray-400 line-through mt-0.5">{formatNGN(kit.price)}</p>
                        </>
                      ) : (
                        <p style={condensed} className="text-xl text-[#111]">{formatNGN(kit.price)}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedKit(kit)}
                    className="mt-4 w-full border border-[#111] py-3 text-xs tracking-widest uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                  >
                    Select & Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial strip ───────────────────────────────────────────── */}
        <section className="bg-[#1A6B2C] px-8 md:px-14 py-16 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
          <p style={{ ...condensed, fontSize: "clamp(36px,5vw,72px)" }} className="text-white max-w-lg leading-none">
            Free Shipping within Jos City
          </p>
          <div className="space-y-2 text-white/70 text-sm">
            <p>📦 Nationwide delivery available</p>
            <p>📧 Order confirmation by email</p>
            <p>💬 Support via WhatsApp</p>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────────────────────── */}
        <Newsletter />
      </div>

      {selectedKit && <OrderModal kit={selectedKit} onClose={() => setSelectedKit(null)} />}
    </BaseLayout>
  )
}

export default PlateauUnitedPage
