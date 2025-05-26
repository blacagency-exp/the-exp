import type { Tour } from "../types/tour-types"

// Define the tour data without durations
export const tourData: Tour[] = [
  {
    id: 1,
    title: "Rayfield Resort",
    description: "Explore the stunning Rayfield Resort with its rugged terrain",
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
  // Add the preview tours with the user's actual YouTube videos
  {
    id: 2,
    title: "Wildlife Park",
    description: "Discover the diverse wildlife of Plateau State with our immersive virtual tour",
    scenes: [
      {
        id: 1,
        youtubeId: "_aLXGZG3rGU", // User's actual Wildlife video
        title: "Wildlife Park Preview",
        description: "A sneak peek of our upcoming Wildlife Park virtual tour",
        hotspots: [
         
        ],
        nextSceneId: 1, // Loop back to the same scene
      },
    ],
  },
  {
    id: 3,
    title: "Shere Hills",
    description: "Explore the majestic Shere Hills with panoramic views of Jos Plateau",
    scenes: [
      {
        id: 1,
        youtubeId: "NgjZAn04w5U", // User's actual Shere Hills video
        title: "Shere Hills Preview",
        description: "A sneak peek of our upcoming Shere Hills virtual tour",
        hotspots: [
         
        ],
        nextSceneId: 1, // Loop back to the same scene
      },
    ],
  },
  {
    id: 4,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls with its cascading waters",
    scenes: [
      {
        id: 1,
        youtubeId: "PuOQrqIMhE0", // User's actual Assop Falls video
        title: "Assop Falls Preview",
        description: "A sneak peek of our upcoming Assop Falls virtual tour",
        hotspots: [
        
        ],
        nextSceneId: 1, // Loop back to the same scene
      },
    ],
  },
]

// Create a separate array for preview tours for easy access
export const previewTours = tourData.filter((tour) => tour.id >= 2 && tour.id <= 4)
