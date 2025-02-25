"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { API_URL } from "../config/api"

interface SubscribeFormProps {
  onLearnMore: () => void
}

export const SubscribeForm: React.FC<SubscribeFormProps> = ({ onLearnMore }) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      setStatus("success")
      setEmail("")
    } catch (error) {
      setStatus("error")
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setErrorMessage("Unable to connect to the server. Please try again later.")
        } else if (error.message === "Email already subscribed") {
          setErrorMessage("This email is already subscribed.")
        } else if (error.message.includes("Failed to check existing subscriber")) {
          setErrorMessage("An error occurred while checking your subscription. Please try again.")
        } else {
          setErrorMessage(error.message || "An unexpected error occurred")
        }
      } else {
        setErrorMessage("An unexpected error occurred")
      }
      console.error("Subscription error:", error)
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="p-6 rounded-lg border-2 border-[#97E12B]"
    >
      <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
      <p className="text-gray-600 mb-4">
        Subscribe to our blog for the latest travel tips and cultural insights about Plateau State.
      </p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#97E12B]"
            disabled={status === "loading"}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#97E12B] text-black rounded-lg hover:bg-[#8ED060] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
        {status === "error" && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {status === "success" && <p className="text-green-500 mt-2">Successfully subscribed!</p>}
      </form>
      <button
        onClick={onLearnMore}
        className="w-full px-4 py-2 bg-[#97E12B] text-black rounded-lg hover:bg-[#8ED060] transition-colors"
      >
        Learn More
      </button>
    </motion.div>
  )
}