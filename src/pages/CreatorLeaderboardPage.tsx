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

export function CreatorLeaderboardPage() {
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

  const topThree = creators.slice(0, 3)
  const remaining = creators.slice(3)

  return (
    <BaseLayout>
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative bg-gradient-to-br from-[#141E03] via-[#1a2805] to-[#141E03] py-32 overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #97E12B 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🏆
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 text-6xl opacity-20"
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
              <div className="w-24 h-24 bg-gradient-to-br from-[#97E12B] to-[#7BC91D] rounded-full flex items-center justify-center shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Creator Leaderboard</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Celebrating Plateau State's top content creators who bring our culture and stories to life
            </p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-8"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Users className="w-6 h-6 text-[#97E12B]" />
                <div className="text-left">
                  <p className="text-sm text-gray-400">Total Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm text-gray-400">Elite Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.filter((c) => c.tier === "Elite").length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-[#97E12B]" />
                <div className="text-left">
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">
                    {(creators.reduce((sum, c) => sum + c.totalViews, 0) / 1000000).toFixed(0)}M+
                  </p>
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
              className="inline-flex items-center gap-2 bg-[#97E12B] text-[#141E03] px-6 py-3 rounded-full font-semibold hover:bg-[#7BC91D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#97E12B] animate-spin" />
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Top 3 Creators</h2>
                  <p className="text-lg text-gray-600">The leading content creators of Plateau State</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topThree.map((creator, index) => (
                    <LeaderboardCard key={creator.creatorId} creator={creator} index={index} />
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">All Rankings</h2>
                    <p className="text-lg text-gray-600">Complete leaderboard standings</p>
                  </div>
                  <LeaderboardTable creators={remaining} />
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </BaseLayout>
  )
}
