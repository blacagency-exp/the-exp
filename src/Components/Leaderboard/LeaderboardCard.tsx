"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, Users, Heart } from "lucide-react"
import type { CreatorData } from "../../utils/googleSheet"
import { formatFollowerCount } from "../../utils/googleSheet"

interface LeaderboardCardProps {
  creator: CreatorData
  index: number
  isChristmas?: boolean
}

export function LeaderboardCard({ creator, index, isChristmas = false }: LeaderboardCardProps) {
  const isTopThree = creator.rank && creator.rank <= 3
  const rankColors = {
    1: isChristmas ? "from-yellow-400 to-yellow-600" : "from-yellow-400 to-yellow-600",
    2: isChristmas ? "from-gray-300 to-gray-500" : "from-gray-300 to-gray-500",
    3: isChristmas ? "from-orange-400 to-orange-600" : "from-orange-400 to-orange-600",
  }

  const tierColors = {
    Elite: isChristmas ? "bg-red-500" : "bg-[#97E12B]",
    Pro: isChristmas ? "bg-green-600" : "bg-blue-500",
    Rookie: isChristmas ? "bg-yellow-500" : "bg-gray-500",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Card Container */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ${
          isTopThree ? "border-4" : "border-2"
        } ${isTopThree ? `border-gradient bg-gradient-to-br ${rankColors[creator.rank as 1 | 2 | 3]}` : "border-gray-200"}`}
      >
        {/* Christmas decoration overlay */}
        {isChristmas && (
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10">
            <div className="text-6xl">❄️</div>
          </div>
        )}

        {/* Rank Badge */}
        {creator.rank && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                isTopThree ? `bg-gradient-to-br ${rankColors[creator.rank as 1 | 2 | 3]}` : "bg-gray-600"
              }`}
            >
              {creator.rank <= 3 ? <Trophy className="w-6 h-6" /> : creator.rank}
            </motion.div>
          </div>
        )}

        {/* Tier Badge */}
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.4, type: "spring", stiffness: 200 }}
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${tierColors[creator.tier]}`}
          >
            {creator.tier}
          </motion.div>
        </div>

        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={creator.profilePicture || "/placeholder.svg"}
                  alt={creator.creatorName}
                  className="w-full h-full object-cover"
                />
              </div>
              {isTopThree && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-4 h-4 text-yellow-900" />
                </div>
              )}
            </motion.div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{creator.creatorName}</h3>
              <p className="text-sm text-gray-600">@{creator.primaryHandle}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{creator.platform}</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{creator.niche}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Followers</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{formatFollowerCount(creator.baselineFollowers)}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Engagement</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{creator.engagementRate.toFixed(2)}%</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Quality Score</span>
              </div>
              <p className="text-lg font-bold text-green-900">{creator.qualityScore.toFixed(1)}/10</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">Location</span>
              </div>
              <p className="text-lg font-bold text-amber-900">{creator.location}</p>
            </motion.div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance Score</span>
              <span className="text-2xl font-bold text-[#97E12B]">{creator.performanceScore.toFixed(1)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(creator.performanceScore / 10) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                className="h-full bg-gradient-to-r from-[#97E12B] to-[#7BC91D] rounded-full"
              />
            </div>
          </div>

          {/* Badge */}
          {creator.badge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="mt-4 text-center"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {creator.badge}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
