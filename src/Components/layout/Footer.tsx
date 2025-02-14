"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import logo from "../../assets/logomobile.png"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const linkVariants = {
  hover: { scale: 1.05, x: 10, transition: { type: "spring", stiffness: 400, damping: 10 } },
}

const socialLinkVariants = {
  hover: {
    scale: 1.1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
}

export function Footer() {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.2 })

  return (
    <motion.footer
      ref={footerRef}
      className="w-full bg-[#141E03] text-white py-12 md:py-24"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-8">
          {/* Left section - Main navigation */}
          <motion.div className="space-y-4 md:space-y-2" variants={itemVariants}>
            {/* Logo for mobile, above Virtual Tour */}
            <div className="md:hidden mb-4">
              <img src={logo || "/placeholder.svg"} alt="Logo" className="h-10 w-50 mb-24" />
            </div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to="/investment"
                className="block text-3xl md:text-5xl  hover:text-white/90 font-normal"
              >
                Investments
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link to="/blogs" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Blogs
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to="/travel-bookings"
                className="block text-3xl md:text-5xl  hover:text-white/90 font-normal"
              >
                Travel Bookings
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link to="/tour-guides" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Cultural Heritage
              </Link>
            </motion.div>
          </motion.div>

          {/* Middle section */}
          <motion.div className="flex flex-col justify-between h-full mt-8 md:mt-0" variants={itemVariants}>
            {/* Top links */}
            <motion.div className="space-y-2">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="/designers" className="block text-white/90 hover:text-white font-normal">
                  For designers
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="/articles" className="block text-white/90 hover:text-white font-normal">
                  Articles
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="/contacts" className="block text-white/90 hover:text-white font-normal">
                  Contacts
                </Link>
              </motion.div>
            </motion.div>

            {/* Contact info */}
            <motion.div className="space-y-4 mt-8 md:mt-0" variants={itemVariants}>
              <h3 className="text-sm text-white/50 font-medium uppercase tracking-wider">Contact us</h3>
              <div className="space-y-2">
                <p className="text-white/90 font-normal">+2347086855211</p>
                <p className="text-white/90 font-normal">info@experienceplateau.com</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right section - Copyright and social links */}
          <motion.div
            className="flex flex-col justify-between items-start md:items-end mt-8 md:mt-0"
            variants={itemVariants}
          >
            <motion.p className="text-sm text-white/60 text-left md:text-right mb-4 md:mb-0" variants={itemVariants}>
              © 2023 — Copyright
            </motion.p>
            <motion.div className="flex flex-wrap md:flex-nowrap gap-4" variants={itemVariants}>
              <motion.div variants={socialLinkVariants} >
                <Link
                  to="https://www.instagram.com/experienceplateau?igsh=MXNpdm5obW9qdnY3bQ=="
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 whitespace-nowrap"
                >
                  Instagram
                </Link>
              </motion.div>
              <motion.div variants={socialLinkVariants} >
                <Link
                  to="https://wa.me/qr/UHL7VTCKPC5VJ1"
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 whitespace-nowrap"
                >
                  Whatsapp
                </Link>
              </motion.div>
              <motion.div variants={socialLinkVariants} >
                <Link
                  to="http://t.me/@Experience_Plateau"
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 whitespace-nowrap"
                >
                  Telegram
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

