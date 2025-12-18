"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Trophy } from "lucide-react"
import type { CreatorData } from "../../utils/googleSheet"
import { formatFollowerCount } from "../../utils/googleSheet"

interface LeaderboardTableProps {
  creators: CreatorData[]
  isChristmas?: boolean
}

export function LeaderboardTable({ creators, isChristmas = false }: LeaderboardTableProps) {
  const tierColors = {
    Elite: isChristmas ? "bg-red-100 text-red-700" : "bg-[#97E12B]/20 text-[#141E03]",
    Pro: isChristmas ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700",
    Rookie: isChristmas ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700",
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-2xl shadow-xl border-2 border-gray-100">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isChristmas ? "bg-gradient-to-r from-red-50 to-green-50" : "bg-gray-50"}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Followers
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Quality
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Engagement
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Score
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {creators.map((creator, index) => (
              <motion.tr
                key={creator.creatorId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ backgroundColor: isChristmas ? "#fef2f2" : "#f9fafb" }}
                className="transition-colors cursor-pointer"
              >
                {/* Rank */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{creator.rank}</span>
                  </div>
                </td>

                {/* Creator Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }} className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                        <img
                          src={creator.profilePicture || "/placeholder.svg"}
                          alt={creator.creatorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{creator.creatorName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 truncate">@{creator.primaryHandle}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {creator.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tier */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${tierColors[creator.tier]}`}
                  >
                    {creator.tier}
                  </span>
                </td>

                {/* Followers */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {formatFollowerCount(creator.baselineFollowers)}
                  </span>
                </td>

                {/* Quality Score */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900">{creator.qualityScore.toFixed(1)}/10</span>
                </td>

                {/* Engagement Rate */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900">{creator.engagementRate.toFixed(2)}%</span>
                </td>

                {/* Performance Score */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-bold text-[#97E12B]">{creator.performanceScore.toFixed(1)}/10</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(creator.performanceScore / 10) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className={
                          isChristmas
                            ? "h-full bg-gradient-to-r from-red-500 to-green-600 rounded-full"
                            : "h-full bg-gradient-to-r from-[#97E12B] to-[#7BC91D] rounded-full"
                        }
                      />
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
