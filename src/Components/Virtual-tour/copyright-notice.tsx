"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Lock } from "lucide-react"

interface CopyrightNoticeProps {
  tourTitle: string
  companyName?: string
}

export function CopyrightNotice({ tourTitle, companyName = "Plateau Tourism" }: CopyrightNoticeProps) {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    // Show copyright notice briefly when the component mounts
    setShowNotice(true)
    const timer = setTimeout(() => {
      setShowNotice(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: showNotice ? 1 : 0,
        y: showNotice ? 0 : 50,
      }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50 max-w-xs bg-[#1A2E0D]/90 backdrop-blur-sm text-white rounded-lg shadow-lg p-3"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-[#97E12B]">
          <Lock size={18} />
        </div>
        <div>
          <h3 className="font-medium text-[#97E12B] text-sm">Protected Content</h3>
          <p className="text-xs text-white/90 mt-1">
            This {tourTitle} virtual tour is copyright protected content owned by {companyName}. Unauthorized sharing or
            distribution is prohibited.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
