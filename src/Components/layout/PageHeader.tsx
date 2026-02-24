"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/Logomark 1 (1).png"

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
}

const linkVariants = {
  hover: { scale: 1.1, color: "#97E12B" },
}

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
}

const navLinks = [
  { to: "/count", label: "Home" },
  { to: "/opp", label: "Investments" },
  { to: "/blog", label: "Blogs" },
  { to: "/virtual-tour", label: "Virtual Tours" },
  { to: "/travel-booking", label: "Travel Booking" },
  { to: "/culture", label: "Cultural Heritage" },
  { to: "/contact", label: "Contact Us" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/shop", label: "Shop" },
]

// Split navigation links for balanced layout
const leftNavLinks = [
  { to: "/count", label: "Home" },
  { to: "/opp", label: "Investments" },
  { to: "/blog", label: "Blogs" },
  { to: "/virtual-tour", label: "Virtual Tours" },
  { to: "/shop", label: "Shop" },
]
const rightNavLinks = [
  { to: "/travel-booking", label: "Travel Booking" },
  { to: "/culture", label: "Cultural Heritage" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/contact", label: "Contact Us" },
]

export function PageHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      className="w-full sticky top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-100"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
          },
        },
      }}
    >
      <div className={styles.section.container}>
        {/* Desktop Layout - Grid with balanced columns */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:h-20 lg:gap-4 xl:gap-8 xl:px-8">
          {/* Left Navigation */}
          <motion.nav className="flex items-center justify-between max-w-[700px]" variants={navVariants}>
            {leftNavLinks.map((link) => (
              <motion.div key={link.to} variants={linkVariants} whileHover="hover">
                <Link to={link.to} className="text-gray-800 hover:text-[#97E12B] transition-colors whitespace-nowrap">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Centered Logo - Minimal width */}
          <motion.div className="flex justify-center items-center" variants={logoVariants}>
            <Link to="/" className="flex items-center">
              <img
                src={img1}
                alt="Experience Plateau Logo"
                className="h-14 w-auto"
              />
            </Link>
          </motion.div>

          {/* Right Navigation */}
          <motion.nav className="flex items-center justify-between max-w-[700px]" variants={navVariants}>
            {rightNavLinks.map((link) => (
              <motion.div key={link.to} variants={linkVariants} whileHover="hover">
                <Link to={link.to} className="text-gray-800 hover:text-[#97E12B] transition-colors whitespace-nowrap">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        {/* Mobile Layout - Flexbox for mobile */}
        <div className="flex lg:hidden items-center justify-between h-16">
          {/* Logo */}
          <motion.div variants={logoVariants}>
            <Link to="/" className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZMA1GAfNCpxkzl0eUFI6VhTWoSV1NR.png"
                alt="Experience Plateau Logo"
                className="h-10"
              />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-gray-800 transform transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              <span
                className={`w-full h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-gray-800 transform transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-[300px] bg-white shadow-lg lg:hidden z-50"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="p-6 bg-white">
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 focus:outline-none"
                  aria-label="Close mobile menu"
                >
                  <div className="w-6 h-6 relative">
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform -rotate-45" />
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform rotate-45" />
                  </div>
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-gray-800 hover:text-[#97E12B] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
    </motion.header>
  )
}
