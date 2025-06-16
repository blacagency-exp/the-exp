import type { Tour } from "../types/tour-types"
import shere from "../assets/shereHills.png"

// Define the tour data without durations
export const activeTours: Tour[] = [
  {
    id: 1,
    title: "Rayfield Resort",
    description: "Explore the stunning Rayfield Resort with its rugged terrain",
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    image: shere,
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
  {
    id: 4,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls with its cascading waters",
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    image: shere,
    scenes: [
       {
        id: 1,
        youtubeId: "J4RltbvLbOo",
        title: "Waterfall",
        description: "Journey through the forest trail towards the waterfall.",
        hotspots: [
          { id: "to-scene-2", position: { x: 45, y: 70 }, targetSceneId: 2, title: "Walking up the stairs", startTime: 42, description: "", },
        ],
        nextSceneId: 2,
      },
       {
        id: 2,
        youtubeId: "006orJuPxuk", // Second video
        title: "Walking up the stairs",
        description: "",
        hotspots: [
          {
            id: "Walking Down the stairs",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 3,
            title: "Walking Down the stairs",
            description: "",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 3, // Auto-transition to scene 3
      },
      {
        id: 3,
        youtubeId: "j0uPzWL7QiI", // Second video
        title: "Walking Down the stairs",
        description: "",
        hotspots: [
          {
            id: "Surroundings",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 4,
            title: "Surroundings",
            description: "",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 4, // Auto-transition to scene 3
      },
       {
        id: 4,
        youtubeId: "0WAy71H1_uo", // Second video
        title: "Surroundings",
        description: "",
        hotspots: [
          {
            id: "Surroundings2",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 5,
            title: "Surroundings2",
            description: "",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 5, // Auto-transition to scene 3
      },
       {
        id: 5,
        youtubeId: "QMF2L2UdRlU", // Second video
        title: "Surroundings",
        description: "",
        hotspots: [
          {
            id: "Waterfall",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 1,
            title: "Return to Start",
            description: "",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 1, // Auto-transition to scene 3
      },
    ]
  },
  // Add the preview tours with the user's actual YouTube videos
 
  
  
]

// Create a separate array for preview tours for easy access
export const previewTours: Tour[] = [
 {
    id: 2,
    title: "Wildlife Park",
    description: "Discover the diverse wildlife of Plateau State with our immersive virtual tour",
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    image: shere,
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
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    image: shere,
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
    id: 4,                      // ← Assop Falls preview
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls with its cascading waters",
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    image: shere,
    scenes: [
      {
        id: 1,
        youtubeId: "PuOQrqIMhE0",
        title: "Assop Falls Preview",
        description: "",
        hotspots: [],
        nextSceneId: 1,
      },
    ],
  },
]
