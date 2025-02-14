"use client"

import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    id: "01",
    question: "Are the hotels listed on your platform safe?",
    answer:
      "You can filter guides by specialty, language, rating, and more to find one that best matches your interests. Each guide's profile includes their expertise, language skills, and reviews from previous travelers.",
  },
  {
    id: "02",
    question: "What payment options are available?",
    answer:
      "We accept all major credit cards, debit cards, and digital wallets including Visa, Mastercard, American Express, PayPal, and Apple Pay. We also offer secure bank transfers for certain bookings.",
  },
  {
    id: "03",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, most bookings can be cancelled or modified up to 24-48 hours before check-in, depending on the hotel's policy. Some rates offer more flexibility while others may be non-refundable. The specific cancellation policy is always clearly displayed before you complete your booking.",
  },
  {
    id: "04",
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes! We regularly offer seasonal discounts, early booking promotions, and special deals for our members. Sign up for our newsletter to stay updated on our latest offers and promotional campaigns.",
  },
]

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<string | null>("01")

  return (
    <section className="bg-white py-24">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-black text-center mb-16"
        >
          Frequently asked questions
        </motion.h2>

        <div className="space-y-8">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-[#97E12B] rounded-2xl overflow-hidden"
            >
              <div
                className="flex cursor-pointer"
                onClick={() => setActiveIndex(activeIndex === faq.id ? null : faq.id)}
              >
                <div className="flex-1">
                  <div className="w-full flex items-center text-left p-6">
                    <div className="flex items-center gap-6">
                      <span className="text-[#97E12B] text-xl font-medium">{faq.id}</span>
                      <h3 className="text-black text-xl">{faq.question}</h3>
                    </div>
                  </div>
                </div>
                <div
                  className={`bg-[#97E12B] flex items-center justify-center ${activeIndex === faq.id ? "w-[72px] h-[72px] rounded-bl-2xl" : "w-[72px]"}`}
                >
                  {activeIndex === faq.id ? (
                    <Minus className="w-6 h-6 text-[#1B2E02]" />
                  ) : (
                    <Plus className="w-6 h-6 text-[#1B2E02]" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {activeIndex === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: {
                          duration: 0.3,
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.15,
                        },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: {
                          duration: 0.3,
                        },
                        opacity: {
                          duration: 0.25,
                        },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-black ml-[72px]">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

