import { Check } from "lucide-react"

interface PackageFeature {
  text: string
}

interface PackageProps {
  title: string
  duration: string
  price: number
  features: PackageFeature[]
  description: string
  type: "Discoverer" | "Explorer" | "Adventurer"
}

export function PackageCard({ title, duration, price, features, description, type }: PackageProps) {
  const styles = {
    Discoverer: {
      clipPath: "polygon(45px 10px, calc(100% - 45px) 10px, 100% 100%, 0 100%)",
      background: "white",
      border: {
        background: "#97E12B",
      },
      maxWidth: "542px",
      padding: "px-10 sm:px-12 py-6 sm:py-8",
      gap: "gap-4",
      featureGap: "gap-2",
      marginBottom: "mb-5",
    },
    Explorer: {
      clipPath: "polygon(45px 0, calc(100% - 45px) 0, 100% 100%, 0 100%)",
      background: "#5A8E00",
      border: {
        background: "#5A8E00",
      },
      maxWidth: "720px",
      padding: "px-10 sm:px-12 py-7 sm:py-9",
      gap: "gap-5",
      featureGap: "gap-3",
      marginBottom: "mb-6",
    },
    Adventurer: {
      clipPath: "polygon(45px 0, calc(100% - 45px) 0, 100% 100%, 0 100%)",
      background: "white",
      border: {
        background: "#97E12B",
      },
      maxWidth: "1200px",
      padding: "px-12 sm:px-14 py-8 sm:py-10",
      gap: "gap-6",
      featureGap: "gap-3",
      marginBottom: "mb-8",
    },
  }

  const currentStyle = styles[type]

  return (
    <div className="relative mb-16 mx-auto overflow-hidden rounded-lg" style={{ maxWidth: currentStyle.maxWidth }}>
      {/* Border wrapper */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: currentStyle.border.background,
          clipPath: currentStyle.clipPath,
        }}
      />

      {/* Content */}
      <div
        className={`relative ${currentStyle.padding} m-[2px] rounded-lg`}
        style={{
          background: currentStyle.background,
          clipPath: currentStyle.clipPath,
        }}
      >
        <div className={`flex justify-between items-start ${currentStyle.marginBottom}`}>
          <div>
            <h3 className={`text-xl font-semibold mb-1 ${type === "Explorer" ? "text-white" : "text-black"}`}>
              {title}
            </h3>
            <p className={`text-sm ${type === "Explorer" ? "text-white/80" : "text-gray-600"}`}>{duration}</p>
          </div>
          <div className="px-4 py-1 bg-white border border-[#5A8E00] text-[#5A8E00] text-sm font-medium rounded-md">
            ${price}
          </div>
        </div>

        <div className={`grid grid-cols-2 ${currentStyle.gap} ${currentStyle.marginBottom}`}>
          {features.map((feature, index) => (
            <div key={index} className={`flex items-center ${currentStyle.featureGap}`}>
              <div className={`rounded-full p-0.5 ${type === "Explorer" ? "bg-white" : "bg-[#5A8E00]"}`}>
                <Check className={`w-4 h-4 ${type === "Explorer" ? "text-[#5A8E00]" : "text-white"}`} />
              </div>
              <span className={`text-sm ${type === "Explorer" ? "text-white" : "text-gray-600"}`}>{feature.text}</span>
            </div>
          ))}
        </div>

        <p className={`text-sm ${type === "Explorer" ? "text-white/80" : "text-gray-600"}`}>{description}</p>
      </div>
    </div>
  )
}