"use client"
import { useState } from "react"

import { motion, Variants } from "framer-motion"
import { styles } from "../../constants/styles"
import { API_URL } from "../../config/api"
import axios from "axios"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function ContactHero() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("loading")

    try {
      const response = await axios.post(`${API_URL}/api/contact`, {
        firstName,
        lastName,
        email,
        comment,
      })

      if (response.status === 200) {
        setSubmitStatus("success")
        setFirstName("")
        setLastName("")
        setEmail("")
        setComment("")
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    }
  }
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className={`${styles.section.container} px-4 sm:px-6 md:px-8`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto md:mx-0 md:max-w-3xl"
        >
          <motion.span
            variants={itemVariants}
            className="text-[#9FE870] text-base sm:text-lg font-medium mb-2 sm:mb-4 block"
          >
            CONTACT US
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#0A1400] mb-8 sm:mb-12"
          >
            We're here to help
          </motion.h1>

          <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <motion.div variants={itemVariants}>
              <label className="text-gray-600 mb-2 block text-sm sm:text-base">Name</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-600 mb-2 block text-sm sm:text-base">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all text-sm sm:text-base"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-600 mb-2 block text-sm sm:text-base">Comment</label>
              <textarea
                placeholder="Write your message here"
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all resize-none text-sm sm:text-base"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-[#0A1400] text-white rounded-lg hover:bg-[#0A1400]/90 transition-colors text-sm sm:text-base"
              >
                {submitStatus === "loading" ? "Submitting..." : "Submit"}
              </button>
              {submitStatus === "success" && (
                <p className="mt-2 text-green-600">Your message has been sent successfully!</p>
              )}
              {submitStatus === "error" && (
                <p className="mt-2 text-red-600">An error occurred. Please try again later.</p>
              )}
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

