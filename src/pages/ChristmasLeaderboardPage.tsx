"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { LeaderboardCard } from "../Components/Leaderboard/LeaderboardCard"
import { fetchCreatorLeaderboardData, type CreatorData } from "../utils/googleSheet"
import { Trophy, TrendingUp, Users, RefreshCw, Loader2 } from "lucide-react"
import { useRef } from "react"
import { LeaderboardTable } from "../Components/Leaderboard/LeaderboardTable"

const GOOGLE_SHEET_ID = "1Wvav-yaVf5wgLky4g2_FHKOTjeTfZdUaGIk6VaY4dCg"

export function ChristmasLeaderboardPage() {
  const [creators, setCreators] = useState<CreatorData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const loadLeaderboardData = async () => {
    setLoading(true)
    const data = await fetchCreatorLeaderboardData(GOOGLE_SHEET_ID)
    setCreators(data)
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    loadLeaderboardData()
  }, [])

  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      initial={{ y: -100, x: Math.random() * 100 - 50, opacity: 0 }}
      animate={{
        y: window.innerHeight + 100,
        x: Math.random() * 100 - 50,
        opacity: [0, 1, 1, 0],
        rotate: 360,
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className="absolute text-2xl md:text-4xl"
      style={{ left: `${Math.random() * 100}%` }}
    >
      ❄️
    </motion.div>
  )

  const topThree = creators.slice(0, 3)
  const remaining = creators.slice(3)

  return (
    <BaseLayout>
      {/* Christmas Hero Section */}
      <div
        ref={heroRef}
        className="relative bg-gradient-to-br from-red-900 via-green-900 to-red-900 py-32 overflow-hidden"
      >
        {/* Snowfall Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <Snowflake key={i} delay={i * 0.5} />
          ))}
        </div>

        {/* Christmas Lights Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #FFD700 3px, transparent 3px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Floating Christmas Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl"
        >
          🎄
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 text-6xl"
        >
          🎅
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-40 right-20 text-5xl"
        >
          ⭐
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isHeroInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">🎄 Christmas Creator Leaderboard 🎄</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
              Celebrating the festive season with Plateau State's most creative content creators
            </p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-8"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-gold/30">
                <Users className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm text-gray-200">Total Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-gold/30">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm text-gray-200">Elite Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.filter((c) => c.tier === "Elite").length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-gold/30">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm text-gray-200">Total Views</p>
                  
                </div>
              </div>
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={loadLeaderboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Refresh Data
                </>
              )}
            </motion.button>

            <p className="text-sm text-gray-300 mt-4">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </motion.div>
        </div>
      </div>

      {/* Christmas Leaderboard Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 50%, #ffebee 100%)",
        }}
      >
        {/* Decorative Christmas Elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse">🎁</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse">🔔</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading Christmas magic...</p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">🎄 Top 3 Christmas Creators 🎄</h2>
                  <p className="text-lg text-gray-600">Celebrating the festive spirit of Plateau State</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topThree.map((creator, index) => (
                    <LeaderboardCard key={creator.creatorId} creator={creator} index={index} isChristmas={true} />
                  ))}
                </div>
              </motion.div>

              {remaining.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">🎅 Complete Rankings 🎅</h2>
                    <p className="text-lg text-gray-600">All our amazing creators this Christmas season</p>
                  </div>
                  <LeaderboardTable creators={remaining} isChristmas={true} />
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </BaseLayout>
  )
}
