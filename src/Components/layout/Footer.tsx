"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { Instagram } from "lucide-react"
import logo from "../../assets/logo_white.png"

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
    scale: 1.2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
}

// Custom WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.494-1.78-1.67-2.079-.173-.3-.018-.462.13-.61.134-.133.3-.347.45-.52.149-.174.199-.3.299-.498.1-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172 0-.372-.025-.572-.025-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.209 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347z" />
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22z" />
  </svg>
)

// Custom Telegram SVG icon
const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

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
              <Link to="/opp" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Investments
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link to="/blog" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Blogs
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link to="/travel-booking" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Travel Bookings
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link to="/culture" className="block text-3xl md:text-5xl  hover:text-white/90 font-normal">
                Cultural Heritage
              </Link>
            </motion.div>
          </motion.div>

          {/* Middle section */}
          <motion.div className="flex flex-col justify-between h-full mt-8 md:mt-0" variants={itemVariants}>
            {/* Top links */}
            <motion.div className="space-y-2">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="#" className="block text-white/90 hover:text-white font-normal">
                  For designers
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="#" className="block text-white/90 hover:text-white font-normal">
                  Articles
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link to="#" className="block text-white/90 hover:text-white font-normal">
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
            <motion.div className="flex gap-4" variants={itemVariants}>
              <motion.div variants={socialLinkVariants} whileHover="hover">
                <Link
                  to="https://www.instagram.com/experienceplateau?igsh=MXNpdm5obW9qdnY3bQ=="
                  className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-full hover:bg-white/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div variants={socialLinkVariants} whileHover="hover">
                <Link
                  to="https://wa.me/qr/UHL7VTCKPC5VJ1"
                  className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-full hover:bg-white/10"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
                </Link>
              </motion.div>
              <motion.div variants={socialLinkVariants} whileHover="hover">
                <Link
                  to="http://t.me/@Experience_Plateau"
                  className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-full hover:bg-white/10"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

