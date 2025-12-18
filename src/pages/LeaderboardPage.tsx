  "use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { LeaderboardCard } from "../Components/Leaderboard/LeaderboardCard"
import { LeaderboardTable } from "../Components/Leaderboard/LeaderboardTable"
import { fetchCreatorLeaderboardData, type CreatorData } from "../utils/googleSheet"
import { Trophy, TrendingUp, Users, RefreshCw, Loader2, Sparkles } from "lucide-react"
import { useRef } from "react"

const REGULAR_SHEET_ID = "1BFbiM7PjifV8H9nf7GAQpYUJSE-OW-uj7CUtDjUd2Ms"
const CHRISTMAS_SHEET_ID = "1vEwKkugn6MFSh65iSlewu9HWT2a_TDCWy6CXNaSnafI"

type LeaderboardTab = "regular" | "christmas"

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("regular")
  const [creators, setCreators] = useState<CreatorData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const loadLeaderboardData = async () => {
    setLoading(true)
    const sheetId = activeTab === "christmas" ? CHRISTMAS_SHEET_ID : REGULAR_SHEET_ID
    const data = await fetchCreatorLeaderboardData(sheetId)
    setCreators(data)
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    loadLeaderboardData()
  }, [activeTab])

  const topThree = creators.slice(0, 3)
  const remaining = creators.slice(3)

  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      initial={{ y: -100, x: Math.random() * 100 - 50, opacity: 0 }}
      animate={{
        y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
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
      className="absolute text-2xl md:text-4xl pointer-events-none"
      style={{ left: `${Math.random() * 100}%` }}
    >
      ❄️
    </motion.div>
  )

  const isChristmas = activeTab === "christmas"

  return (
    <BaseLayout>
      {/* Hero Section with Dynamic Background */}
      <div
        ref={heroRef}
        className={`relative py-32 overflow-hidden transition-colors duration-700 ${
          isChristmas
            ? "bg-gradient-to-br from-red-900 via-green-900 to-red-900"
            : "bg-gradient-to-br from-[#141E03] via-[#1a2805] to-[#141E03]"
        }`}
      >
        <AnimatePresence mode="wait">
          {isChristmas ? (
            <motion.div
              key="christmas-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
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
            </motion.div>
          ) : (
            <motion.div
              key="regular-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
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
            </motion.div>
          )}
        </AnimatePresence>

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
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  isChristmas
                    ? "bg-gradient-to-br from-red-500 to-green-600"
                    : "bg-gradient-to-br from-[#97E12B] to-[#7BC91D]"
                }`}
              >
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6"
              >
                {isChristmas ? "🎄 Christmas Creator Leaderboard 🎄" : "Creator Leaderboard"}
              </motion.h1>
            </AnimatePresence>

            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 ${isChristmas ? "text-gray-200" : "text-gray-300"}`}
            >
              {isChristmas
                ? "Celebrating the festive season with Plateau State's most creative content creators"
                : "Celebrating Plateau State's top content creators who bring our culture and stories to life"}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center gap-4 mb-8"
            >
              <button
                onClick={() => setActiveTab("regular")}
                className={`relative px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "regular"
                    ? "bg-[#97E12B] text-[#141E03] shadow-lg scale-105"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Regular Leaderboard
                </div>
                {activeTab === "regular" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#97E12B] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab("christmas")}
                className={`relative px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "christmas"
                    ? "bg-gradient-to-r from-red-500 to-green-600 text-white shadow-lg scale-105"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Christmas Special
                </div>
                {activeTab === "christmas" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-green-600 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-8"
            >
              <div
                className={`flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full ${
                  isChristmas ? "border-2 border-yellow-400/30" : ""
                }`}
              >
                <Users className={`w-6 h-6 ${isChristmas ? "text-yellow-400" : "text-[#97E12B]"}`} />
                <div className="text-left">
                  <p className={`text-sm ${isChristmas ? "text-gray-200" : "text-gray-400"}`}>Total Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.length}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full ${
                  isChristmas ? "border-2 border-yellow-400/30" : ""
                }`}
              >
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className={`text-sm ${isChristmas ? "text-gray-200" : "text-gray-400"}`}>Elite Creators</p>
                  <p className="text-2xl font-bold text-white">{creators.filter((c) => c.tier === "Elite").length}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full ${
                  isChristmas ? "border-2 border-yellow-400/30" : ""
                }`}
              >
                <TrendingUp className={`w-6 h-6 ${isChristmas ? "text-yellow-400" : "text-[#97E12B]"}`} />
                <div className="text-left">
                  <p className={`text-sm ${isChristmas ? "text-gray-200" : "text-gray-400"}`}>Avg Engagement</p>
                  <p className="text-2xl font-bold text-white">
                    {creators.length > 0
                      ? (creators.reduce((sum, c) => sum + c.engagementRate, 0) / creators.length).toFixed(1)
                      : 0}
                    %
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
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isChristmas
                  ? "bg-gradient-to-r from-red-500 to-green-600 text-white hover:from-red-600 hover:to-green-700"
                  : "bg-[#97E12B] text-[#141E03] hover:bg-[#7BC91D]"
              }`}
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

            <p className={`text-sm mt-4 ${isChristmas ? "text-gray-300" : "text-gray-400"}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`py-20 relative overflow-hidden ${
            isChristmas ? "bg-gradient-to-br from-gray-50 via-green-50 to-red-50" : "bg-gray-50"
          }`}
        >
          {/* Decorative Christmas Elements */}
          {isChristmas && (
            <>
              <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse">🎁</div>
              <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse">🔔</div>
            </>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isChristmas ? "text-red-600" : "text-[#97E12B]"}`} />
                <p className="text-gray-600">{isChristmas ? "Loading Christmas magic..." : "Loading leaderboard..."}</p>
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      {isChristmas ? "🎄 Top 3 Christmas Creators 🎄" : "Top 3 Creators"}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {isChristmas
                        ? "Celebrating the festive spirit of Plateau State"
                        : "The leading content creators of Plateau State"}
                    </p>
                  </div>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                        },
                      },
                    }}
                  >
                    {topThree.map((creator, index) => (
                      <motion.div
                        key={creator.creatorId}
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 50,
                            scale: 0.9,
                          },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.6,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }}
                      >
                        <LeaderboardCard creator={creator} index={index} isChristmas={isChristmas} />
                      </motion.div>
                    ))}
                  </motion.div>
                  {/* </CHANGE> */}
                </motion.div>

                {remaining.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {isChristmas ? "🎅 Complete Rankings 🎅" : "All Rankings"}
                      </h2>
                      <p className="text-lg text-gray-600">
                        {isChristmas
                          ? "All our amazing creators this Christmas season"
                          : "Complete leaderboard standings"}
                      </p>
                    </div>
                    <LeaderboardTable creators={remaining} isChristmas={isChristmas} />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </BaseLayout>
  )
}
