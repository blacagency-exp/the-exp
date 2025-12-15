// Google Sheets integration utility
export interface CreatorData {
  creatorId: string
  creatorName: string
  primaryHandle: string
  platform: string
  niche: string
  location: string
  baselineFollowers: number
  engagementRate: number
  qualityScore: number
  totalViews: number
  totalEngagements: number
  performanceScore: number
  tier: "Elite" | "Pro" | "Rookie"
  rank?: number
  profilePicture?: string
  badge?: string
}

export async function fetchCreatorLeaderboardData(sheetId: string): Promise<CreatorData[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=1212061050`

    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV data
    const rows = csvText.split("\n").filter((row) => row.trim())
    const creators: CreatorData[] = []

    // Skip header row, start from index 1
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].split(",")

      if (cells.length < 5) continue // Skip invalid rows

      creators.push({
        creatorId: cells[0]?.trim() || "",
        creatorName: cells[1]?.trim() || "",
        primaryHandle: cells[2]?.trim() || "",
        platform: cells[4]?.trim() || "",
        niche: cells[5]?.trim() || "",
        location: cells[6]?.trim() || "Jos",
        baselineFollowers: Number.parseInt(cells[7]?.replace(/,/g, "") || "0"),
        engagementRate: Number.parseFloat(cells[8] || "0"),
        qualityScore: Number.parseFloat(cells[9] || "0"),
        totalViews:
          Number.parseInt(cells[12]?.replace(/[km]/gi, "") || "0") *
          (cells[12]?.toLowerCase().includes("k") ? 1000 : cells[12]?.toLowerCase().includes("m") ? 1000000 : 1),
        totalEngagements:
          Number.parseInt(cells[13]?.replace(/[km]/gi, "") || "0") *
          (cells[13]?.toLowerCase().includes("k") ? 1000 : cells[13]?.toLowerCase().includes("m") ? 1000000 : 1),
        performanceScore: Number.parseFloat(cells[24] || "0"),
        tier: (cells[25]?.trim() as "Elite" | "Pro" | "Rookie") || "Rookie",
        profilePicture: generateProfilePicture(cells[1]?.trim() || ""),
        badge: getBadgeForTier((cells[25]?.trim() as "Elite" | "Pro" | "Rookie") || "Rookie"),
      })
    }

    // Sort by performance score and assign ranks
    creators.sort((a, b) => b.performanceScore - a.performanceScore)
    creators.forEach((creator, index) => {
      creator.rank = index + 1
    })

    return creators
  } catch (error) {
    console.error("[v0] Error fetching creator leaderboard data:", error)
    return getMockCreatorData() // Fallback to mock data
  }
}

function generateProfilePicture(name: string): string {
  const colors = ["#97E12B", "#141E03", "#4CAF50", "#2196F3", "#FF9800"]
  const colorIndex = name.length % colors.length
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex].slice(1)}&color=fff&size=200&bold=true`
}

function getBadgeForTier(tier: "Elite" | "Pro" | "Rookie"): string {
  const badges = {
    Elite: "Top Creator",
    Pro: "Rising Star",
    Rookie: "New Talent",
  }
  return badges[tier]
}

function getMockCreatorData(): CreatorData[] {
  return [
    {
      creatorId: "XP C1",
      creatorName: "Luka Susan",
      primaryHandle: "_zig_wai",
      platform: "IG",
      niche: "Lifestyle/Fashion",
      location: "Jos",
      baselineFollowers: 14260,
      engagementRate: 0.37,
      qualityScore: 6.5,
      totalViews: 314000000,
      totalEngagements: 3000000,
      performanceScore: 85.5,
      tier: "Elite",
      rank: 1,
      profilePicture: generateProfilePicture("Luka Susan"),
      badge: "Top Creator",
    },
    // Add more mock data as needed
  ]
}
