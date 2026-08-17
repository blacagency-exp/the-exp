import { useState, useEffect } from "react"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { Newsletter } from "@/Components/Shop/newsletter"
import axios from "axios"
import { API_URL } from "@/config/api"


// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  category: "kits" | "training" | "hoodies" | "tracksuits"
  price: number
  promoPrice: number | null
  bgColor: string
  textColor: string
  description: string
  image?: string
}

interface DeliveryZone {
  zone: string
  label: string
  price: number
  areas: string[]
}

interface BankTransferDetails {
  accountId: string
  accountNumber: string
  bankName: string
  accountName: string
  amount: number
  reference: string
  validUntil: Date
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "home-kit",
    name: "Home Kit",
    category: "kits",
    price: 20,
    promoPrice: 10,
    bgColor: "#F7D000",
    textColor: "#1A6B2C",
    description: "The iconic yellow & green. Wear the colours of Plateau United on matchday.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/23d1d5252b0c466edae5b150548807a5cca05fd2-900x1200.jpg",
  },
  {
    id: "away-kit",
    name: "Away Kit",
    category: "kits",
    price: 20,
    promoPrice: 10,
    bgColor: "#f0f0f0",
    textColor: "#1A6B2C",
    description: "The away strip — clean white, built for the road and the faithful who travel.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/3f834e7125278af9e4a2902d23c9f47e749d74f2-900x1200.jpg",
  },
  {
    id: "alternate-kit",
    name: "Alternate Kit",
    category: "kits",
    price: 20,
    promoPrice: 10,
    bgColor: "#2a1a0a",
    textColor: "#FFFFFF",
    description: "The cultural strip — bold stripes inspired by the diversity of Plateau State.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/e2d92c3d9779d37b8b38b8fd677532462422b3cc-900x1200.jpg",
  },
  {
    id: "training-kit-1",
    name: "Training Kit I",
    category: "training",
    price: 10,
    promoPrice: null,
    bgColor: "#1a6b6b",
    textColor: "#F7D000",
    description: "Train like a Tin City Soldier. Official Plateau United training kit by Galaxy.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/c30125fe52917e35f26d22b986da23e85e8ffc57-900x1200.jpg",
  },
  {
    id: "training-kit-2",
    name: "Training Kit II",
    category: "training",
    price: 10,
    promoPrice: null,
    bgColor: "#f0f0f0",
    textColor: "#1A6B2C",
    description: "Second colourway of the official PU training range — lightweight, performance-ready.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/af1bc68097e1ed62395e0fb518d0b6338de90e85-900x1200.jpg",
  },
  {
    id: "training-kit-3",
    name: "Training Kit III",
    category: "training",
    price: 10,
    promoPrice: null,
    bgColor: "#0d4a3a",
    textColor: "#7EFFD4",
    description: "Third colourway — mint and teal, built for the pitch and the gym.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/fa51c05688db0133bca37472ccc23c363ce40eb8-900x1200.jpg",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    category: "hoodies",
    price: 10,
    promoPrice: null,
    bgColor: "#7FE000",
    textColor: "#FFFFFF",
    description: "Premium PU hoodie — lime green feather print for the stands, the streets, and everything in between.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/9c47ecc1cdb73813a87d83105d9aef4119776596-900x1200.jpg",
  },
  {
    id: "tracksuit",
    name: "Tracksuit",
    category: "tracksuits",
    price: 10,
    promoPrice: null,
    bgColor: "#f5f5f5",
    textColor: "#1A6B2C",
    description: "Full Plateau United tracksuit. Travel in style, arrive representing the Pride.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/1ac52ff4175e1868f6c9a716c917cfd7678565fa-900x1200.jpg",
  },
]

const DELIVERY_ZONES: DeliveryZone[] = [
  {
    zone: "A",
    label: "Zone A — Rayfield Core",
    price: 10,
    areas: ["Rayfield", "GRA Jos", "Dogon Dutse", "Kwarrarafa"],
  },
  {
    zone: "B",
    label: "Zone B — Near Town",
    price: 10,
    areas: ["Terminus", "Jos Main Market", "Ahmadu Bello Way", "Bukuru Road (near town)", "Anglo Jos", "Yan Trailer", "Congo Russia"],
  },
  {
    zone: "C",
    label: "Zone C — Mid Jos",
    price: 10,
    areas: ["Farin Gada", "Gada Biyu", "Katako Market", "Jenta", "Laranto", "Tudun Wada", "Rikkos", "Nasarawa Gwom"],
  },
  {
    zone: "D",
    label: "Zone D — Outer Jos",
    price: 10,
    areas: ["Bauchi Road", "Zaria Road", "Angwan Rukuba", "Naraguta (UNIJOS)", "Old Airport Road", "Kabong", "Angwan Rimi"],
  },
  {
    zone: "E",
    label: "Zone E — Extended/Satellite",
    price: 10,
    areas: ["Bukuru Town", "Vom", "Miango Road", "Barkin Ladi"],
  },
]

const SIZES = ["S", "M", "L", "XL", "XXL"]
const CATEGORIES = ["All", "Kits", "Training", "Hoodies", "Tracksuits"] as const



function formatNGN(n: number) {
  return `₦${n.toLocaleString()}`
}

// ─── Partner Strip ─────────────────────────────────────────────────────────────

// ─── Bank Transfer Screen ──────────────────────────────────────────────────────

function BankTransferScreen({
  details,
  onVerify,
  verifying,
}: {
  details: BankTransferDetails
  onVerify: () => void
  verifying: boolean
}) {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.floor((details.validUntil.getTime() - Date.now()) / 1000))
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const expired = secondsLeft === 0

  const copyAccount = () => {
    navigator.clipboard.writeText(details.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-6 py-6 space-y-5">
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Transfer exactly</p>
        <p className="text-4xl text-[#111]">{formatNGN(details.amount)}</p>
        <p className="text-xs text-gray-400 mt-1">to the account below</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 tracking-wider uppercase">Bank</p>
            <p className="font-semibold text-sm text-[#111]">{details.bankName}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 tracking-wider uppercase">Account Number</p>
            <p style={{ fontFamily: "monospace" }} className="text-2xl font-bold text-[#111] tracking-wider">
              {details.accountNumber}
            </p>
          </div>
          <button
            onClick={copyAccount}
            className="text-xs border border-[#111] px-3 py-1.5 uppercase tracking-wider hover:bg-[#111] hover:text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div>
          <p className="text-xs text-gray-400 tracking-wider uppercase">Account Name</p>
          <p className="text-sm font-semibold text-[#111]">{details.accountName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 tracking-wider uppercase">Reference</p>
          <p className="text-sm text-[#111] font-mono">{details.reference}</p>
        </div>
      </div>

      <div className={`flex items-center justify-between text-sm px-3 py-2 ${expired ? "bg-red-50 text-red-600" : "bg-[#F7D000]/20 text-[#111]"}`}>
        <span className="text-xs tracking-wider uppercase font-semibold">
          {expired ? "Account expired" : "Account expires in"}
        </span>
        <span className="font-mono font-bold">
          {expired ? "00:00" : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`}
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed text-center">
        ⚠️ Transfer the <strong>exact amount</strong> shown above. Do not include any description or reference in your transfer — the account number is unique to this order.
      </p>

      <button
        onClick={onVerify}
        disabled={verifying || expired}
        className="w-full bg-[#1A6B2C] text-white py-4 text-xs tracking-widest uppercase hover:bg-[#145422] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {verifying ? "Checking payment..." : "I've made the transfer"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Payment not reflecting? Wait 2–3 minutes and try again.
      </p>
    </div>
  )
}

// ─── Order Modal ──────────────────────────────────────────────────────────────

function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Step 2
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [isInterstate, setIsInterstate] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")

  // Step 3
  const [bankDetails, setBankDetails] = useState<BankTransferDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  const unitPrice = product.promoPrice ?? product.price
  const deliveryFee = isInterstate ? 0 : (selectedZone?.price ?? 0)
  const total = unitPrice * quantity + deliveryFee

  const step1Complete = !!size
  const step2Complete = firstName && lastName && email && whatsapp && deliveryAddress && (isInterstate || selectedZone)

  const handleZoneChange = (value: string) => {
    if (value === "interstate") {
      setIsInterstate(true)
      setSelectedZone(null)
    } else {
      setIsInterstate(false)
      const zone = DELIVERY_ZONES.find((z) => z.zone === value) ?? null
      setSelectedZone(zone)
    }
  }

  const handleInitPayment = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(`${API_URL}/api/plateau-united/initialize-payment`, {
        email,
        firstName,
        lastName,
        phone: whatsapp,
        kitName: product.name,
        size,
        quantity,
        deliveryAddress,
        deliveryZone: isInterstate ? "interstate" : selectedZone?.zone,
        deliveryFee,
        isInterstate,
        totalAmount: total,
      })

      // Lint virtual account response
      const account = data.data
      setBankDetails({
        accountId: account.id,
        accountNumber: account.account_number,
        bankName: account.bank_name,
        accountName: account.account_name,
        amount: total,
        reference: account.reference,
        validUntil: new Date(Date.now() + 3600 * 1000),
      })
      setStep(3)
    } catch (e) {
      setError(axios.isAxiosError(e) ? e.response?.data?.error ?? e.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!bankDetails) return
    setVerifying(true)
    try {
      const { data } = await axios.get(
        `${API_URL}/api/plateau-united/verify-payment/${bankDetails.accountId}`
      )
      if (data.status === "completed" || data.payment_status === "SUCCESSFUL") {
        setStep(4)
      } else {
        setError("Payment not yet received. Please wait a moment and try again.")
      }
    } catch {
      setError("Could not verify payment. Contact us with your reference: " + bankDetails.reference)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md max-h-[95vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ←
              </button>
            )}
            <div>
              <p className="text-xl text-[#111]">{product.name}</p>
              <p className="text-[10px] tracking-widest uppercase text-gray-400">
                {step === 1 ? "Select Size" : step === 2 ? "Your Details" : step === 3 ? "Bank Transfer" : "Confirmed"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex border-b border-gray-100">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-0.5 ${s <= step ? "bg-[#1A6B2C]" : "bg-gray-100"} transition-all`}
              />
            ))}
          </div>
        )}

        {/* ── Step 1: Size + Qty ────────────────────────── */}
        {step === 1 && (
          <div className="px-6 py-6 space-y-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Size</p>
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

            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Quantity</p>
              <div className="flex items-center gap-4 border border-gray-200 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg hover:bg-gray-50">−</button>
                <span className="text-sm w-6 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg hover:bg-gray-50">+</button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Subtotal</p>
                <p className="text-2xl text-[#111]">
                  {formatNGN(unitPrice * quantity)}
                </p>
              </div>
              {product.promoPrice && (
                <div className="text-right">
                  <span className="text-[10px] bg-[#F7D000] text-[#111] px-2 py-1 font-black tracking-wider uppercase block mb-1">Save ₦5,000</span>
                  <span className="text-xs text-gray-400 line-through">{formatNGN(product.price * quantity)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 italic leading-relaxed">{product.description}</p>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Complete}
              className="w-full border border-[#111] py-4 text-xs tracking-widest uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Step 2: Details + Delivery ───────────────── */}
        {step === 2 && (
          <div className="px-6 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", value: firstName, set: setFirstName, placeholder: "First" },
                { label: "Last Name",  value: lastName,  set: setLastName,  placeholder: "Last" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">{label}</p>
                  <input
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]"
                  />
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]"
              />
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">WhatsApp Number</p>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08012345678"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]"
              />
              <p className="text-[10px] text-gray-400 mt-1">We'll send order updates to this number</p>
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Delivery Area</p>
              <select
                onChange={(e) => handleZoneChange(e.target.value)}
                defaultValue=""
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] bg-white"
              >
                <option value="" disabled>Select your area</option>
                {DELIVERY_ZONES.map((z) => (
                  <optgroup key={z.zone} label={`${z.label} — ${formatNGN(z.price)}`}>
                    {z.areas.map((area) => (
                      <option key={area} value={z.zone}>{area}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="interstate">Outside Jos / Plateau State</option>
              </select>
            </div>

            {isInterstate && (
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 leading-relaxed">
                ⭐ <strong>Manual Dispatch Order</strong> — Interstate delivery is arranged manually. Our team will contact you via WhatsApp after payment to confirm delivery details and timeline.
              </div>
            )}

            {selectedZone && (
              <div className="bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600">
                📦 Delivery to <strong>{selectedZone.label}</strong> — {formatNGN(selectedZone.price)} via Bamjiye
              </div>
            )}

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Full Delivery Address</p>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                placeholder="House number, street, area..."
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] resize-none"
              />
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{product.name} × {quantity}</span>
                <span>{formatNGN(unitPrice * quantity)}</span>
              </div>
              {!isInterstate && selectedZone && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery ({selectedZone.zone})</span>
                  <span>{formatNGN(selectedZone.price)}</span>
                </div>
              )}
              {isInterstate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-amber-600">Arranged manually</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-base">Total</span>
                <span className="text-base">{formatNGN(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handleInitPayment}
              disabled={!step2Complete || loading}
              className="w-full bg-[#1A6B2C] text-white py-4 text-xs tracking-widest uppercase hover:bg-[#145422] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Generating account..." : `Pay ${formatNGN(total)} via Bank Transfer`}
            </button>

            <p className="text-[10px] text-gray-400 text-center tracking-wide">
              Powered by Lint · SafeHaven MFB
            </p>
          </div>
        )}

        {/* ── Step 3: Bank Transfer ─────────────────────── */}
        {step === 3 && bankDetails && (
          <>
            {error && <p className="text-red-500 text-xs px-6 pt-4">{error}</p>}
            <BankTransferScreen
              details={bankDetails}
              onVerify={handleVerify}
              verifying={verifying}
            />
          </>
        )}

        {/* ── Step 4: Success ───────────────────────────── */}
        {step === 4 && (
          <div className="px-6 py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#1A6B2C] rounded-full flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-3xl text-[#111]">Order Confirmed</p>
            {isInterstate && (
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 text-left leading-relaxed">
                ⭐ <strong>Manual Dispatch</strong> — Our team will contact you on WhatsApp ({whatsapp}) to arrange interstate delivery.
              </div>
            )}
            <p className="text-gray-500 text-sm leading-relaxed">
              A confirmation has been sent to <strong>{email}</strong>.
              {!isInterstate && selectedZone && ` Delivery to ${selectedZone.label} — expect your order within 1–3 days.`}
            </p>
            <div className="pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-400">
              <p>Reference: <span className="font-mono">{bankDetails?.reference}</span></p>
              <p>Kit: {product.name} · Size {size} · Qty {quantity}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full border border-[#111] py-4 text-xs tracking-widest uppercase hover:bg-[#111] hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function PlateauUnitedPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = PRODUCTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory.toLowerCase()
  )

  return (
    <BaseLayout>
      <div className="flex flex-col bg-white">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="w-full min-h-[90vh] flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-end px-8 md:px-14 pb-12 pt-20 bg-white">
            <h1 className="text-[clamp(64px,12vw,160px)] text-[#111] mb-5 leading-none">
              Plateau<br />
              <span className="text-[#1A6B2C]">United</span>
            </h1>
            <p className="text-gray-500 text-base max-w-xs mb-10 leading-relaxed">
              Official kits, training gear and apparel for the peace boys
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="border border-[#111] px-8 py-3.5 text-xs tracking-widest uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors"
              >
                Shop the Collection
              </button>
              <button
                onClick={() => document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 text-xs tracking-widest uppercase text-gray-400 hover:text-[#111] transition-colors"
              >
                Delivery Info
              </button>
            </div>
          </div>

          <div className="lg:w-[45%] min-h-[50vh] lg:min-h-0 bg-[#1A6B2C] flex items-center justify-center relative overflow-hidden">
            <span
              style={{ fontSize: "clamp(120px,22vw,320px)" }}
              className="text-white/10 select-none absolute"
            >
              PU
            </span>
            <svg width="160" height="160" viewBox="0 0 80 80" fill="none" className="relative z-10 opacity-70">
              <path d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z"
                fill="#F7D000" strokeLinejoin="round" />
            </svg>
            <div className="absolute bottom-8 left-8 bg-[#F7D000] px-4 py-2">
              <p className="text-[#111] text-lg">5K Off Match Kits</p>
            </div>
          </div>
        </section>

        {/* ── Collection ────────────────────────────────── */}
        <section id="collection" className="px-8 md:px-14 pt-14">
          <div className="flex items-end justify-between mb-6">
            <p className="text-[clamp(36px,5vw,72px)] text-[#111]">The Collection</p>
            <p className="text-gray-400 text-sm tracking-widest uppercase hidden md:block">{filtered.length} Products</p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-6 border-b border-gray-100 overflow-x-auto pb-px mb-0 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-3 text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "border-b-2 border-[#111] text-[#111] -mb-px"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product grid */}
        <section className="px-8 md:px-14 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white group">
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{ backgroundColor: product.bgColor, aspectRatio: "3/4" }}
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.promoPrice && (
                    <span className="absolute top-4 left-4 z-10 bg-[#F7D000] text-[#111] text-[10px] font-black tracking-widest uppercase px-2.5 py-1">
                      Save ₦5,000
                    </span>
                  )}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="120" height="120" viewBox="0 0 80 80" fill="none"
                        className="transition-transform duration-500 group-hover:scale-110">
                        <path
                          d="M20 12 L10 28 L22 30 L22 68 L58 68 L58 30 L70 28 L60 12 L50 18 C50 18 46 22 40 22 C34 22 30 18 30 18 Z"
                          fill={product.textColor} opacity="0.7" strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="px-5 py-5 border-t border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[22px] text-[#111]">{product.name}</p>
                      <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">Plateau United FC</p>
                    </div>
                    <div className="text-right">
                      {product.promoPrice ? (
                        <>
                          <p className="text-xl text-[#1A6B2C]">{formatNGN(product.promoPrice)}</p>
                          <p className="text-xs text-gray-400 line-through">{formatNGN(product.price)}</p>
                        </>
                      ) : (
                        <p className="text-xl text-[#111]">{formatNGN(product.price)}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full border border-[#111] py-3 text-xs tracking-widest uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                  >
                    Select & Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Delivery Info ─────────────────────────────── */}
        <section id="delivery" className="px-8 md:px-14 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-[clamp(28px,4vw,56px)] text-[#111] mb-8">Delivery Zones — Jos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DELIVERY_ZONES.map((z) => (
                <div key={z.zone} className="border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-lg text-[#111]">{z.label}</p>
                    <p className="text-lg text-[#1A6B2C]">{formatNGN(z.price)}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{z.areas.join(" · ")}</p>
                </div>
              ))}
              <div className="border border-amber-200 bg-amber-50 p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg text-[#111]">Interstate ⭐</p>
                  <p className="text-xs text-amber-700 font-semibold">Manual</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Outside Jos/Plateau State — our team contacts you via WhatsApp to arrange delivery after payment.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Delivered by Bamjiye Logistics · Stadium pickup option coming soon
            </p>
          </div>
        </section>

        {/* ── Partner strip footer ──────────────────────── */}
        <div className="bg-[#111] py-8 px-8 md:px-14">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
              <span className="text-white/40 text-xs uppercase">Experience Plateau</span>
              <span className="text-white/20">×</span>
              <span className="text-white/40 text-xs uppercase">Plateau United FC</span>
            </div>
            <p className="text-white/30 text-[10px] tracking-widest uppercase">Official Merchandise 2026</p>
          </div>
        </div>

        <Newsletter />
      </div>

      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </BaseLayout>
  )
}

export default PlateauUnitedPage
