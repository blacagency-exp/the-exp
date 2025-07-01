"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/logo_white.png"

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
  
  { to: "/travel-booking", label: "Travel Booking" },
  { to: "/culture", label: "Cultural Heritage" },
  { to: "/contact", label: "Contact Us" },
]

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      className="w-full absolute top-0 left-0 z-50 bg-black/5 backdrop-blur-sm"
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
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation - Left Side */}
          <motion.nav className="hidden lg:flex items-center space-x-24" variants={navVariants}>
            {navLinks.slice(0, 3).map((link) => (
              <motion.div key={link.to} variants={linkVariants} whileHover="hover">
                <Link to={link.to} className="text-white hover:text-[#97E12B] transition-colors">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Logo */}
          <motion.div variants={logoVariants}>
            <Link to="/" className="flex items-center">
              <img src={img1 || "/placeholder.svg"} alt="Experience Plateau Logo" className="h-8 text-white " />
            </Link>
          </motion.div>

          {/* Desktop Navigation - Right Side */}
          <motion.nav className="hidden lg:flex items-center space-x-24" variants={navVariants}>
            {navLinks.slice(3).map((link) => (
              <motion.div key={link.to} variants={linkVariants} whileHover="hover">
                <Link to={link.to} className="text-white hover:text-[#97E12B] transition-colors">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 focus:outline-none">
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-[#97E12B] transform transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-[#97E12B] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-[#97E12B] transform transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
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
                <button onClick={() => setIsMenuOpen(false)} className="p-2 focus:outline-none">
                  <div className="w-6 h-6 relative">
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#97E12B] transform -rotate-45" />
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#97E12B] transform rotate-45" />
                  </div>
                </button>
              </div>
              <nav className="flex flex-col gap-6 ">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 hover:text-[#97E12B] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
    </motion.header>
  )
}

