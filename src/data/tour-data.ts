import type { Tour } from "../types/tour-types"

// Define the tour data without durations
export const tourData: Tour[] = [
  {
    id: 1,
    title: "Rayfield Resort",
    description: "Explore the stunning Shere Hills with its rugged terrain",
    scenes: [
      {
        id: 1,
        youtubeId: "2PLmcXGaqFw", // First video
        title: "Gate Entrance Rayfield resort",
        description: "",
        hotspots: [
          {
            id: "Rayfield resort Before Reaching the Staircase",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 2,
            title: "Rayfield resort Before Reaching the Staircase",
            description: "",
            startTime: 26, // Keep user's specified start time
          },
        ],
        nextSceneId: 2, // Auto-transition to scene 2
      },
      {
        id: 2,
        youtubeId: "sgKh_UGfU0U", // Second video
        title: "Rayfield resort Before Reaching the Staircase",
        description: "",
        hotspots: [
          {
            id: "Rayfield Resort Surrounding Tour",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 3,
            title: "Rayfield Resort Surrounding Tour",
            description: "",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 3, // Auto-transition to scene 3
      },
      {
        id: 3,
        youtubeId: "T2RE6q70_nE", // Third video
        title: "Rayfield Resort Surrounding Tour",
        description: "",
        hotspots: [
          {
            id: "Walking Round Surroundings",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 4,
            title: "Walking Round Surroundings",
            description: "",
            startTime: 110, // Keep user's specified start time
          },
        ],
        nextSceneId: 4, // Auto-transition to scene 4
      },
      {
        id: 4,
        youtubeId: "H3-6U7Wrv5g", // Fourth video
        title: "Walking Round Surroundings",
        description: "",
        hotspots: [
          {
            id: "Rayfield Jet Ski",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 5,
            title: "Rayfield Jet Ski",
            description: "",
            startTime: 120, // Keep user's specified start time
          },
        ],
        nextSceneId: 5, // Auto-transition to scene 5
      },
      {
        id: 5,
        youtubeId: "YYfX9t08U9g", // Fifth video - using your current ID
        title: "Rayfield Jet Ski",
        description: "",
        hotspots: [
          {
            id: "Gate Entrance Rayfield resort",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 1,
            title: "Return to Start",
            description: "",
            startTime: 180, // Keep user's specified start time
          },
        ],
        nextSceneId: 1, // Loop back to scene 1
      },
    ],
  },
]
