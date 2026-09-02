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

interface CartItem {
  product: Product
  size: string
  gender: string
  quality: string
  quantity: number
  unitPrice: number
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
    price: 10,
    promoPrice: null,
    bgColor: "#F7D000",
    textColor: "#1A6B2C",
    description: "The iconic yellow & green. Wear the colours of Plateau United on matchday.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/23d1d5252b0c466edae5b150548807a5cca05fd2-900x1200.jpg",
  },
  {
    id: "away-kit",
    name: "Away Kit",
    category: "kits",
    price: 10,
    promoPrice: null,
    bgColor: "#f0f0f0",
    textColor: "#1A6B2C",
    description: "The away strip — clean white, built for the road and the faithful who travel.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/3f834e7125278af9e4a2902d23c9f47e749d74f2-900x1200.jpg",
  },
  {
    id: "alternate-kit",
    name: "Alternate Kit",
    category: "kits",
    price: 10,
    promoPrice: null,
    bgColor: "#2a1a0a",
    textColor: "#FFFFFF",
    description: "The cultural strip — bold stripes inspired by the diversity of Plateau State.",
    image: "https://cdn.sanity.io/images/252rx5c8/production/e2d92c3d9779d37b8b38b8fd677532462422b3cc-900x1200.jpg",
  },
  {
    id: "training-kit-1",
    name: "Fwavei",
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
    name: "Farin Gada",
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
    name: "Terminus",
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
    price: 1500,
    areas: ["Rayfield", "GRA Jos", "Dogon Dutse", "Kwarrarafa"],
  },
  {
    zone: "B",
    label: "Zone B — Near Town",
    price: 2000,
    areas: ["Terminus", "Jos Main Market", "Ahmadu Bello Way", "Bukuru Road (near town)", "Anglo Jos", "Yan Trailer", "Congo Russia"],
  },
  {
    zone: "C",
    label: "Zone C — Mid Jos",
    price: 2500,
    areas: ["Farin Gada", "Gada Biyu", "Katako Market", "Jenta", "Laranto", "Tudun Wada", "Rikkos", "Nasarawa Gwom"],
  },
  {
    zone: "D",
    label: "Zone D — Outer Jos",
    price: 3000,
    areas: ["Bauchi Road", "Zaria Road", "Angwan Rukuba", "Naraguta (UNIJOS)", "Old Airport Road", "Kabong", "Angwan Rimi"],
  },
  {
    zone: "E",
    label: "Zone E — Extended/Satellite",
    price: 3750,
    areas: ["Bukuru Town", "Vom", "Miango Road", "Barkin Ladi"],
  },
]

const HERO_IMAGES = [
  "https://cdn.sanity.io/images/252rx5c8/production/dbd0eabca62e9d59504bdafd3719afd8af91b6f2-5760x3240.jpg",
  "https://cdn.sanity.io/images/252rx5c8/production/714e0b7b7cad614f4d1333b981c1cd4ed24d3164-5760x3240.jpg",
]

const MOBILE_HERO_IMAGES = [
  "https://cdn.sanity.io/images/252rx5c8/production/c67b475b796d4a2f5ce6587dd357b8f029593862-2700x3600.jpg",
  "https://cdn.sanity.io/images/252rx5c8/production/14d9061dfe6f338bf00a9d001205b8062f557f28-2700x3600.jpg",
  "https://cdn.sanity.io/images/252rx5c8/production/bc170535390abeadc95ca977375533d1ebca1a1c-2700x3600.jpg",
]

const SIZES = ["S", "M", "L", "XL", "XXL"]
const CATEGORIES = ["All", "Kits", "Training", "Hoodies", "Tracksuits"] as const



function formatNGN(n: number) {
  return `₦${n.toLocaleString()}`
}

function computeUnitPrice(product: Product, quality: string): number {
  if (product.category === "kits") return quality === "Player grade" ? 10 : 10
  return product.promoPrice ?? product.price
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
    <div className="px-4 md:px-6 py-5 md:py-6 space-y-4 md:space-y-5">
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Transfer exactly</p>
        <p className="text-3xl md:text-4xl text-[#111]">{formatNGN(details.amount)}</p>
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
            <p style={{ fontFamily: "monospace" }} className="text-xl md:text-2xl font-bold text-[#111] tracking-wider">
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

// ─── Add-to-Cart Picker ───────────────────────────────────────────────────────

function AddToCartPicker({ product, onAdd, onClose }: {
  product: Product
  onAdd: (item: CartItem) => void
  onClose: () => void
}) {
  const [size, setSize] = useState("")
  const [gender, setGender] = useState("")
  const [quality, setQuality] = useState("")
  const [quantity, setQuantity] = useState(1)

  const isKit = product.category === "kits"
  const canAdd = !!size && (!isKit || (!!gender && !!quality))

  const handleAdd = () => {
    if (!canAdd) return
    onAdd({ product, size, gender, quality, quantity, unitPrice: computeUnitPrice(product, quality) })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base text-[#111]">{product.name}</p>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Add to cart</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>
        <div className="px-5 py-5 space-y-5">
          {isKit && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Gender</p>
              <div className="flex gap-6">
                {["Male", "Female"].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="radio" name="atp-gender" value={g} checked={gender === g}
                      onChange={() => setGender(g)} className="accent-[#1A6B2C] w-4 h-4" />
                    <span className="text-sm text-[#111]">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {isKit && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Jersey Quality</p>
              <div className="space-y-2">
                {(["Player grade", "Fan grade"] as const).map(q => (
                  <label key={q} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="radio" name="atp-quality" value={q} checked={quality === q}
                      onChange={() => { setQuality(q); if (q === "Player grade" && size === "XXL") setSize("") }}
                      className="accent-[#1A6B2C] w-4 h-4" />
                    <span className="text-sm text-[#111]">{q}</span>
                    <span className="text-xs text-gray-400 ml-auto">{formatNGN(q === "Player grade" ? 10 : 10)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.filter(s => !(isKit && quality === "Player grade" && s === "XXL")).map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`min-w-[44px] h-[44px] text-xs border transition-colors ${
                    size === s ? "border-[#111] bg-[#111] text-white" : "border-gray-200 text-[#111] hover:border-[#111]"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 border border-gray-200 flex items-center justify-center text-lg hover:border-[#111] transition-colors">−</button>
              <span className="text-base w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(10, q + 1))}
                className="w-9 h-9 border border-gray-200 flex items-center justify-center text-lg hover:border-[#111] transition-colors">+</button>
            </div>
          </div>
          <button onClick={handleAdd} disabled={!canAdd}
            className="w-full bg-[#1A6B2C] text-white py-3.5 text-xs tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#145422] transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ cart, onRemove, onUpdateQty, onCheckout, onClose }: {
  cart: CartItem[]
  onRemove: (idx: number) => void
  onUpdateQty: (idx: number, qty: number) => void
  onCheckout: () => void
  onClose: () => void
}) {
  const subtotal = cart.reduce((s, item) => s + item.unitPrice * item.quantity, 0)
  const totalQty = cart.reduce((s, item) => s + item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base text-[#111]">Your Cart</p>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">{totalQty} item{totalQty !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">Your cart is empty</p>
          ) : cart.map((item, idx) => (
            <div key={idx} className="border border-gray-100 p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-[#111] font-medium">{item.product.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Size: {item.size}
                    {item.gender && ` · ${item.gender}`}
                    {item.quality && ` · ${item.quality}`}
                  </p>
                </div>
                <p className="text-sm text-[#111] shrink-0">{formatNGN(item.unitPrice * item.quantity)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => item.quantity > 1 ? onUpdateQty(idx, item.quantity - 1) : onRemove(idx)}
                    className="w-7 h-7 border border-gray-200 flex items-center justify-center text-sm hover:border-[#111] transition-colors">−</button>
                  <span className="text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(idx, Math.min(10, item.quantity + 1))}
                    className="w-7 h-7 border border-gray-200 flex items-center justify-center text-sm hover:border-[#111] transition-colors">+</button>
                </div>
                <button onClick={() => onRemove(idx)}
                  className="text-[10px] text-gray-400 hover:text-red-500 tracking-widest uppercase transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4">
            <div className="flex justify-between text-base text-[#111]">
              <span>Subtotal</span>
              <span>{formatNGN(subtotal)}</span>
            </div>
            <p className="text-[10px] text-gray-400">Delivery fee calculated at checkout</p>
            <button onClick={onCheckout}
              className="w-full bg-[#1A6B2C] text-white py-4 text-xs tracking-widest uppercase hover:bg-[#145422] transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cart Checkout Modal ──────────────────────────────────────────────────────

function CartCheckoutModal({ cart, onClose }: { cart: CartItem[]; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const subtotal = cart.reduce((s, item) => s + item.unitPrice * item.quantity, 0)

  // Step 1 — contact + fulfillment
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery")
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [isInterstate, setIsInterstate] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const deliveryFee = fulfillmentType === "pickup" ? 0 : (isInterstate ? 0 : (selectedZone?.price ?? 0))
  const total = subtotal + deliveryFee

  const step1Complete = !!(firstName && lastName && email && whatsapp) &&
    (fulfillmentType === "pickup" || !!(deliveryAddress && (isInterstate || selectedZone)))

  const handleZoneChange = (value: string) => {
    if (value === "interstate") { setIsInterstate(true); setSelectedZone(null) }
    else { setIsInterstate(false); setSelectedZone(DELIVERY_ZONES.find(z => z.zone === value) ?? null) }
  }

  // Step 2 — bank transfer
  const [bankDetails, setBankDetails] = useState<BankTransferDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  const handleInitPayment = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await axios.post(`${API_URL}/api/plateau-united/initialize-cart-payment`, {
        email, firstName, lastName, phone: whatsapp,
        items: cart.map(item => ({
          kitName: item.product.name,
          size: item.size,
          gender: item.gender || undefined,
          quality: item.quality || undefined,
          quantity: item.quantity,
        })),
        fulfillmentType,
        deliveryAddress: fulfillmentType === "pickup" ? null : deliveryAddress,
        deliveryZone: fulfillmentType === "pickup" ? null : (isInterstate ? "interstate" : selectedZone?.zone),
        deliveryFee,
        isInterstate: fulfillmentType === "pickup" ? false : isInterstate,
        totalAmount: total,
      })
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
      setStep(2)
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
      const { data } = await axios.get(`${API_URL}/api/plateau-united/verify-payment/${bankDetails.accountId}`)
      if (data.status === "completed" || data.payment_status === "SUCCESSFUL") setStep(3)
      else setError("Payment not yet received. Please wait a moment and try again.")
    } catch {
      setError("Could not verify payment. Contact us with your reference: " + bankDetails.reference)
    } finally {
      setVerifying(false)
    }
  }

  const stepLabel = step === 1 ? "Your Details" : step === 2 ? "Bank Transfer" : "Confirmed"

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md max-h-[95vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3 min-w-0">
            {step === 1 ? null : step < 3 ? (
              <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)} className="text-gray-400 hover:text-black text-sm shrink-0">←</button>
            ) : null}
            <div className="min-w-0">
              <p className="text-base md:text-xl text-[#111]">Cart — {cart.length} item{cart.length !== 1 ? "s" : ""}</p>
              <p className="text-[10px] tracking-widest uppercase text-gray-400">{stepLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        {step < 3 && (
          <div className="flex border-b border-gray-100">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-0.5 ${s <= step ? "bg-[#1A6B2C]" : "bg-gray-100"} transition-all`} />
            ))}
          </div>
        )}

        {/* Step 1 — Contact + Fulfillment */}
        {step === 1 && (
          <div className="px-4 md:px-6 py-5 space-y-4">
            {/* Cart summary */}
            <div className="bg-gray-50 p-3 space-y-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} × {item.quantity}
                    {item.size && <span className="text-gray-400 text-xs"> ({item.size}{item.gender ? `, ${item.gender}` : ""}{item.quality ? `, ${item.quality}` : ""})</span>}
                  </span>
                  <span>{formatNGN(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", value: firstName, set: setFirstName, placeholder: "First" },
                { label: "Last Name",  value: lastName,  set: setLastName,  placeholder: "Last" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">{label}</p>
                  <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]" />
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Email</p>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]" />
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">WhatsApp Number</p>
              <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="08012345678"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]" />
            </div>

            {/* Fulfillment toggle */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Fulfillment</p>
              <div className="grid grid-cols-2 gap-2">
                {(["delivery", "pickup"] as const).map(type => (
                  <button key={type} type="button" onClick={() => setFulfillmentType(type)}
                    className={`py-2.5 text-xs tracking-widest uppercase border transition-colors ${
                      fulfillmentType === type
                        ? "bg-[#1A6B2C] text-white border-[#1A6B2C]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}>
                    {type === "delivery" ? "🚚 Delivery" : "🏟 Pickup"}
                  </button>
                ))}
              </div>
            </div>

            {fulfillmentType === "pickup" ? (
              <div className="bg-green-50 border border-green-200 p-3 text-xs text-green-800 leading-relaxed">
                📍 <strong>Pickup Address:</strong> No. 6, Amazing Grace House, Shok Bature Street, off Peter Gyang Sha Road, from Rayfield Golf Club, Rayfield, Jos. No delivery fee applies.
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Delivery Area</p>
                  <select onChange={e => handleZoneChange(e.target.value)} defaultValue=""
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] bg-white">
                    <option value="" disabled>Select your area</option>
                    {DELIVERY_ZONES.map(z => (
                      <optgroup key={z.zone} label={`${z.label} — ${formatNGN(z.price)}`}>
                        {z.areas.map(area => <option key={area} value={z.zone}>{area}</option>)}
                      </optgroup>
                    ))}
                    <option value="interstate">Outside Jos / Plateau State</option>
                  </select>
                </div>
                {isInterstate && (
                  <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 leading-relaxed">
                    ⭐ <strong>Manual Dispatch Order</strong> — Interstate delivery is arranged manually. Our team will contact you via WhatsApp after payment.
                  </div>
                )}
                {selectedZone && (
                  <div className="bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600">
                    📦 Delivery to <strong>{selectedZone.label}</strong> — {formatNGN(selectedZone.price)} via Bamjiye
                  </div>
                )}
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Full Delivery Address</p>
                  <textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} rows={2}
                    placeholder="House number, street, area..."
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] resize-none" />
                </div>
              </>
            )}

            {/* Order total */}
            <div className="bg-gray-50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatNGN(subtotal)}</span>
              </div>
              {fulfillmentType === "pickup" ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pickup</span>
                  <span className="text-green-700">Free</span>
                </div>
              ) : !isInterstate && selectedZone ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery ({selectedZone.zone})</span>
                  <span>{formatNGN(selectedZone.price)}</span>
                </div>
              ) : isInterstate ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-amber-600">Arranged manually</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-base">Total</span>
                <span className="text-base">{formatNGN(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button onClick={handleInitPayment} disabled={!step1Complete || loading}
              className="w-full bg-[#1A6B2C] text-white py-4 text-xs tracking-widest uppercase hover:bg-[#145422] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "Generating account..." : `Pay ${formatNGN(total)} via Bank Transfer`}
            </button>
            <p className="text-[10px] text-gray-400 text-center tracking-wide">Powered by Lint · SafeHaven MFB</p>
          </div>
        )}

        {/* Step 2 — Bank Transfer */}
        {step === 2 && bankDetails && (
          <>
            {error && <p className="text-red-500 text-xs px-6 pt-4">{error}</p>}
            <BankTransferScreen details={bankDetails} onVerify={handleVerify} verifying={verifying} />
          </>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="px-6 py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#1A6B2C] rounded-full flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-3xl text-[#111]">Order Confirmed</p>
            {fulfillmentType === "pickup" ? (
              <div className="bg-green-50 border border-green-200 p-3 text-xs text-green-800 text-left leading-relaxed">
                🏟 <strong>Pickup Address:</strong> No. 6, Amazing Grace House, Shok Bature Street, off Peter Gyang Sha Road, from Rayfield Golf Club, Rayfield, Jos. Our team will confirm timing via WhatsApp ({whatsapp}).
              </div>
            ) : isInterstate ? (
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 text-left leading-relaxed">
                ⭐ <strong>Manual Dispatch</strong> — Our team will contact you on WhatsApp ({whatsapp}) to arrange interstate delivery.
              </div>
            ) : null}
            <p className="text-gray-500 text-sm leading-relaxed">
              A confirmation has been sent to <strong>{email}</strong>.
              {fulfillmentType === "delivery" && !isInterstate && selectedZone && ` Delivery to ${selectedZone.label} — expect your order within 1–3 days.`}
            </p>
            <button onClick={onClose}
              className="mt-4 border border-[#111] px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#111] hover:text-white transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Order Modal ──────────────────────────────────────────────────────────────

function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [gender, setGender] = useState("")
  const [quality, setQuality] = useState("")

  const isKit = product.category === "kits"

  // Step 2
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery")
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [isInterstate, setIsInterstate] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")

  // Step 3
  const [bankDetails, setBankDetails] = useState<BankTransferDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  const unitPrice = isKit
    ? (quality === "Player grade" ? 10 : 10)
    : (product.promoPrice ?? product.price)
  const deliveryFee = fulfillmentType === "pickup" ? 0 : (isInterstate ? 0 : (selectedZone?.price ?? 0))
  const total = unitPrice * quantity + deliveryFee

  const step1Complete = !!size && (!isKit || (!!gender && !!quality))
  const step2Complete = !!(firstName && lastName && email && whatsapp) &&
    (fulfillmentType === "pickup" || !!(deliveryAddress && (isInterstate || selectedZone)))

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
        gender: isKit ? gender : undefined,
        quality: isKit ? quality : undefined,
        quantity,
        fulfillmentType,
        deliveryAddress: fulfillmentType === "pickup" ? null : deliveryAddress,
        deliveryZone: fulfillmentType === "pickup" ? null : (isInterstate ? "interstate" : selectedZone?.zone),
        deliveryFee,
        isInterstate: fulfillmentType === "pickup" ? false : isInterstate,
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
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3 min-w-0">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
                className="text-gray-400 hover:text-black text-sm shrink-0"
              >
                ←
              </button>
            )}
            <div className="min-w-0">
              <p className="text-base md:text-xl text-[#111] truncate">{product.name}</p>
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
          <div className="px-4 md:px-6 py-5 md:py-6 space-y-5 md:space-y-6">

            {/* Gender — kits only */}
            {isKit && (
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Gender</p>
                <div className="flex gap-6">
                  {["Male", "Female"].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="accent-[#1A6B2C] w-4 h-4"
                      />
                      <span className="text-sm text-[#111]">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Jersey Quality — kits only */}
            {isKit && (
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Jersey Quality</p>
                <div className="flex gap-6">
                  {["Player grade", "Fan grade"].map((q) => (
                    <label key={q} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="quality"
                        value={q}
                        checked={quality === q}
                        onChange={() => { setQuality(q); if (q === "Player grade" && size === "XXL") setSize("") }}
                        className="accent-[#1A6B2C] w-4 h-4"
                      />
                      <span className="text-sm text-[#111]">{q}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Size</p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.filter(s => !(isKit && quality === "Player grade" && s === "XXL")).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSize(s) }}
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
          <div className="px-4 md:px-6 py-5 md:py-6 space-y-4">
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

            {/* Fulfillment toggle */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Fulfillment</p>
              <div className="grid grid-cols-2 gap-2">
                {(["delivery", "pickup"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFulfillmentType(type)}
                    className={`py-2.5 text-xs tracking-widest uppercase border transition-colors ${
                      fulfillmentType === type
                        ? "bg-[#1A6B2C] text-white border-[#1A6B2C]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {type === "delivery" ? "🚚 Delivery" : "🏟 Pickup"}
                  </button>
                ))}
              </div>
            </div>

            {fulfillmentType === "pickup" ? (
              <div className="bg-green-50 border border-green-200 p-3 text-xs text-green-800 leading-relaxed">
                📍 <strong>Pickup Address:</strong> No. 6, Amazing Grace House, Shok Bature Street, off Peter Gyang Sha Road, from Rayfield Golf Club, Rayfield, Jos. No delivery fee applies.
              </div>
            ) : (
              <>
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
              </>
            )}

            {/* Order summary */}
            <div className="bg-gray-50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{product.name} × {quantity}</span>
                <span>{formatNGN(unitPrice * quantity)}</span>
              </div>
              {fulfillmentType === "pickup" ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pickup</span>
                  <span className="text-green-700">Free</span>
                </div>
              ) : (
                <>
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
                </>
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
              {loading ? "Generating account..." : <><span className="block sm:hidden">Pay {formatNGN(total)}</span><span className="hidden sm:block">Pay {formatNGN(total)} via Bank Transfer</span></>}
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
            {fulfillmentType === "pickup" ? (
              <div className="bg-green-50 border border-green-200 p-3 text-xs text-green-800 text-left leading-relaxed">
                🏟 <strong>Pickup Address:</strong> No. 6, Amazing Grace House, Shok Bature Street, off Peter Gyang Sha Road, from Rayfield Golf Club, Rayfield, Jos. Our team will confirm timing via WhatsApp ({whatsapp}).
              </div>
            ) : isInterstate ? (
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 text-left leading-relaxed">
                ⭐ <strong>Manual Dispatch</strong> — Our team will contact you on WhatsApp ({whatsapp}) to arrange interstate delivery.
              </div>
            ) : null}
            <p className="text-gray-500 text-sm leading-relaxed">
              A confirmation has been sent to <strong>{email}</strong>.
              {fulfillmentType === "delivery" && !isInterstate && selectedZone && ` Delivery to ${selectedZone.label} — expect your order within 1–3 days.`}
            </p>
            <div className="pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-400">
              <p className="break-all">Reference: <span className="font-mono">{bankDetails?.reference}</span></p>
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
  const [heroIndex, setHeroIndex] = useState(0)
  const [mobileHeroIndex, setMobileHeroIndex] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCheckout, setCartCheckout] = useState(false)
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null)

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const idx = prev.findIndex(
        c => c.product.id === item.product.id && c.size === item.size && c.gender === item.gender && c.quality === item.quality
      )
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: Math.min(10, next[idx].quantity + item.quantity) }
        return next
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx))
  const updateCartQty = (idx: number, qty: number) =>
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item))
  const cartCount = cart.reduce((s, item) => s + item.quantity, 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileHeroIndex((i) => (i + 1) % MOBILE_HERO_IMAGES.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const filtered = PRODUCTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory.toLowerCase()
  )

  return (
    <BaseLayout>
      <div className="flex flex-col bg-white">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="w-full h-[calc(100vh-64px)] relative overflow-hidden">
          {/* Mobile hero slideshow */}
          {MOBILE_HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Plateau United"
              className="md:hidden absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
              style={{ opacity: i === mobileHeroIndex ? 1 : 0 }}
            />
          ))}

          {/* Desktop slideshow */}
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Plateau United"
              className="hidden md:block absolute inset-0 w-full h-full object-cover object-[center_35%] transition-opacity duration-1000"
              style={{ opacity: i === heroIndex ? 1 : 0 }}
            />
          ))}


          {/* Full-width bottom gradient — ensures text is readable on both slides */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/60 to-transparent z-[1] pointer-events-none" />

          {/* Text — bottom left */}
          <div className="absolute bottom-8 md:bottom-12 left-4 md:left-12 z-10 max-w-[calc(100vw-32px)] md:max-w-lg pr-10 md:pr-0">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold uppercase tracking-tight mb-2 leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]" style={{ color: "#F7D000" }}>
              The Peace Boys. Official Collection.
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mb-4 md:mb-5 leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              Official kits, training gear and apparel for Plateau United FC.
            </p>
            <button
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
              className="border px-4 md:px-5 py-2 md:py-2.5 text-xs tracking-widest uppercase transition-colors hover:text-[#111]"
              style={{ borderColor: "#F7D000", color: "#F7D000", backgroundColor: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F7D000")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Shop the Collection
            </button>
          </div>

          {/* Left / Right arrows — desktop only */}
          <button
            onClick={() => setHeroIndex((heroIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => setHeroIndex((heroIndex + 1) % HERO_IMAGES.length)}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Dots — mobile only */}
          <div className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {MOBILE_HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileHeroIndex(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === mobileHeroIndex ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === mobileHeroIndex ? "#F7D000" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>

          {/* Dots — desktop only */}
          <div className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 gap-2 z-10">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === heroIndex ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === heroIndex ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </section>

        {/* ── Collection ────────────────────────────────── */}
        <section id="collection" className="px-4 md:px-8 lg:px-14 pt-8 md:pt-14">
          <div className="flex items-end justify-between mb-4 md:mb-6">
            <p className="text-[clamp(26px,7vw,72px)] text-[#111]">The Collection</p>
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
        <section className="px-4 md:px-8 lg:px-14 pb-16 md:pb-20">
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

                <div className="px-4 py-4 md:px-5 md:py-5 border-t border-gray-100">
                  <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                    <div className="min-w-0">
                      <p className="text-base md:text-[22px] text-[#111] truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Plateau United FC</p>
                    </div>
                    <div className="text-right shrink-0">
                      {product.promoPrice ? (
                        <>
                          <p className="text-base md:text-xl text-[#1A6B2C]">{formatNGN(product.promoPrice)}</p>
                          <p className="text-xs text-gray-400 line-through">{formatNGN(product.price)}</p>
                        </>
                      ) : (
                        <p className="text-base md:text-xl text-[#111]">{formatNGN(product.price)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddToCartProduct(product)}
                      className="flex-1 border border-[#1A6B2C] py-3 text-[10px] tracking-wide uppercase text-[#1A6B2C] hover:bg-[#1A6B2C] hover:text-white transition-colors"
                    >
                      + Cart
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 border border-[#111] py-3 text-[10px] tracking-wide uppercase text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Delivery Info ─────────────────────────────── */}
        <section id="delivery" className="px-4 md:px-8 lg:px-14 py-12 md:py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-[clamp(22px,4vw,56px)] text-[#111] mb-5 md:mb-8">Delivery Zones — Jos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              {DELIVERY_ZONES.map((z) => (
                <div key={z.zone} className="border border-gray-100 p-3 md:p-4">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <p className="text-sm md:text-base text-[#111]">{z.label}</p>
                    <p className="text-sm md:text-base text-[#1A6B2C] shrink-0">{formatNGN(z.price)}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{z.areas.join(" · ")}</p>
                </div>
              ))}
              <div className="border border-amber-200 bg-amber-50 p-3 md:p-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <p className="text-sm md:text-base text-[#111]">Interstate ⭐</p>
                  <p className="text-xs text-amber-700 font-semibold shrink-0">Manual</p>
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
        <div className="bg-[#111] py-6 md:py-8 px-4 md:px-8 lg:px-14">
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

      {addToCartProduct && (
        <AddToCartPicker
          product={addToCartProduct}
          onAdd={item => { addToCart(item); setCartOpen(true) }}
          onClose={() => setAddToCartProduct(null)}
        />
      )}

      {cartOpen && !cartCheckout && (
        <CartDrawer
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQty={updateCartQty}
          onCheckout={() => { setCartOpen(false); setCartCheckout(true) }}
          onClose={() => setCartOpen(false)}
        />
      )}

      {cartCheckout && (
        <CartCheckoutModal
          cart={cart}
          onClose={() => { setCartCheckout(false); setCart([]) }}
        />
      )}

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && !cartCheckout && !selectedProduct && !addToCartProduct && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1A6B2C] text-white px-5 py-3 flex items-center gap-3 shadow-lg hover:bg-[#145422] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span className="text-xs tracking-widest uppercase">Cart</span>
          <span className="bg-[#F7D000] text-[#111] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}
    </BaseLayout>
  )
}

export default PlateauUnitedPage
