"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LearnMoreModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white p-8 rounded-lg max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Learn More About Our Blog</h2>
            <p className="mb-4">
              Our blog is dedicated to sharing the beauty, culture, and adventures of Plateau State. By subscribing,
              you'll receive:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Weekly travel tips and destination highlights</li>
              <li>Exclusive cultural insights and event announcements</li>
              <li>Special offers on tours and accommodations</li>
              <li>Opportunities to engage with local communities</li>
            </ul>
            <p className="mb-4">
              Join our community of travel enthusiasts and cultural explorers. Stay updated on the latest stories from
              Plateau State!
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#97E12B] text-black rounded-lg hover:bg-[#8ED060] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

