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
  performanceScore: number
  tier: "Elite" | "Pro" | "Rookie"
  rank?: number
  profilePicture?: string
  badge?: string
}

export async function fetchCreatorLeaderboardData(sheetId: string): Promise<CreatorData[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=1212061050`

    console.log("Fetching leaderboard data from:", csvUrl)

    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("Raw CSV data received, length:", csvText.length)

    // Parse CSV data - handle quoted fields properly
    const rows = csvText.split("\n").filter((row) => row.trim())
    const creators: CreatorData[] = []

    console.log("Total rows:", rows.length)

    // Skip header row, start from index 1
    for (let i = 1; i < rows.length; i++) {
      // Split by comma while preserving empty fields
      const cells: string[] = []
      let currentCell = ""
      let inQuotes = false
      const row = rows[i]
      
      for (let j = 0; j < row.length; j++) {
        const char = row[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim())
          currentCell = ""
        } else {
          currentCell += char
        }
      }
      cells.push(currentCell.trim()) // Push the last cell

      console.log(`Row ${i} cells (${cells.length}):`, cells)

      // Skip rows with invalid data or empty creator names
      if (cells.length < 11 || !cells[1]?.trim() || !cells[0]?.trim()) {
        console.log(`Skipping row ${i} - insufficient data or empty creator`)
        continue
      }

      // Parse followers - handle k/m suffixes and commas (column 7 in new mapping)
      let followers = 0
      const followersStr = cells[7]?.replace(/,/g, "").trim() || "0"
      if (followersStr.toLowerCase().includes("k")) {
        followers = Number.parseFloat(followersStr.replace(/k/gi, "")) * 1000
      } else if (followersStr.toLowerCase().includes("m")) {
        followers = Number.parseFloat(followersStr.replace(/m/gi, "")) * 1000000
      } else {
        followers = Number.parseInt(followersStr) || 0
      }

      // Parse performance score (column 10)
      const performanceScore = Number.parseFloat(cells[9] || "0")

      // Skip if performance score is 0 (invalid data)
      if (performanceScore === 0) {
        console.log(`Skipping row ${i} - zero performance score`)
        continue
      }

      // New column mapping:
      // 0: Creator ID, 1: Creator Name, 2: Primary Handle, 3: Other Handles
      // 4: Platform(s), 5: Niche/Category, 6: LGA/Location, 7: Baseline Followers
      // 8: Baseline Engagement Rate (%), 9: Initial Quality Score (1-10)
      const platform = cells[4]?.trim() || ""
      const baseCreatorId = cells[0]?.trim() || ""
      const uniqueId = `${baseCreatorId}-${platform.toLowerCase().replace(/\s+/g, "")}`

      const creator: CreatorData = {
        creatorId: uniqueId,
        creatorName: cells[1]?.trim() || "",
        primaryHandle: cells[2]?.trim() || "",
        platform: platform,
        niche: cells[5]?.trim() || "",
        location: cells[6]?.trim() || "Jos",
        baselineFollowers: followers,
        engagementRate: Number.parseFloat(cells[8] || "0"),
        qualityScore: Number.parseFloat(cells[9] || "0"),
        performanceScore: Number.parseFloat(cells[9] || "0"), // Using quality score as performance score for now
        tier: "Rookie" as "Elite" | "Pro" | "Rookie",
        profilePicture: generateProfilePicture(cells[1]?.trim() || ""),
        badge: getBadgeForTier("Rookie"),
      }

      console.log(`Parsed creator ${i}:`, creator.creatorName, "Score:", creator.performanceScore)
      creators.push(creator)
    }

    console.log(`Total creators parsed: ${creators.length}`)

    // Sort by performance score and assign ranks
    creators.sort((a, b) => b.performanceScore - a.performanceScore)
    creators.forEach((creator, index) => {
      creator.rank = index + 1
    })

    console.log(
      "Top 3 creators:",
      creators.slice(0, 3).map((c) => `${c.creatorName}: ${c.performanceScore}`),
    )

    return creators
  } catch (error) {
    console.error("Error fetching creator leaderboard data:", error)
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
      creatorId: "XP C10",
      creatorName: "Wendypatrick",
      primaryHandle: "wendypatrick.___",
      platform: "Tiktok",
      niche: "Lifestyle/Tourism",
      location: "Jos",
      baselineFollowers: 2411,
      engagementRate: 8.31,
      qualityScore: 8,
      performanceScore: 8.155,
      tier: "Elite",
      rank: 1,
      profilePicture: generateProfilePicture("Wendypatrick"),
      badge: "Top Creator",
    },
    {
      creatorId: "XP C12",
      creatorName: "Lizzy",
      primaryHandle: "afro_bab",
      platform: "Tiktok",
      niche: "Lifestyle/Tourism",
      location: "Jos",
      baselineFollowers: 925,
      engagementRate: 6.94,
      qualityScore: 6,
      performanceScore: 6.47,
      tier: "Elite",
      rank: 2,
      profilePicture: generateProfilePicture("Lizzy"),
      badge: "Top Creator",
    },
    {
      creatorId: "XP C27",
      creatorName: "theglobalbankss",
      primaryHandle: "Theglobalbankss",
      platform: "TikTok",
      niche: "Lifestyle",
      location: "Jos",
      baselineFollowers: 825,
      engagementRate: 6.56,
      qualityScore: 6,
      performanceScore: 6.28,
      tier: "Elite",
      rank: 3,
      profilePicture: generateProfilePicture("theglobalbankss"),
      badge: "Top Creator",
    },
  ]
}

export function formatFollowerCount(followers: number): string {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`
  } else {
    return followers.toString()
  }
}
