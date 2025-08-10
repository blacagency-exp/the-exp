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

  {
    id: 8, // New ID for Riyom Rock full tour
    title: "Riyom Rock",
    description: "Discover the stunning geological formations and breathtaking landscapes of Riyom Rock",
    tags: ["Virtual tour", "Rock Formation", "Geology", "Adventure"],
    image: shere, // You can replace this with a specific Riyom Rock image later
    scenes: [
      {
        id: 1,
        youtubeId: "EYAq0868azQ", // Replace with actual YouTube video ID for scene 1
        title: "WALKING TO THE ROCK",
        description: "",
        hotspots: [
          {
            id: "to-WALKING TO THE ROCK MAIN ENTERANCE",
            position: { x: 45, y: 60 },
            targetSceneId: 2,
            title: "WALKING TO THE ROCK MAIN ENTERANCE",
            description: "",
            startTime: 44,
          },
        ],
        nextSceneId: 2,
      },
      {
        id: 2,
        youtubeId: "SeMwaDg9DBI", // Replace with actual YouTube video ID for scene 2
        title: "WALKING TO THE ROCK MAIN ENTERANCE",
        description: "",
        hotspots: [
          {
            id: "to-ALTERNATIVE ROUTE TO THE ROCK",
            position: { x: 50, y: 55 },
            targetSceneId: 3,
            title: "ALTERNATIVE ROUTE TO THE ROCK",
            description: "",
            startTime: 38,
          },
        ],
        nextSceneId: 3,
      },
      {
        id: 3,
        youtubeId: "FRAy57yXp3k", // Replace with actual YouTube video ID for scene 3
        title: "ALTERNATIVE ROUTE TO THE ROCK",
        description: "Follow the winding path up the rock formation for spectacular views",
        hotspots: [
          {
            id: "to-SIDE VIEW OF THE ROCK",
            position: { x: 40, y: 50 },
            targetSceneId: 4,
            title: "SIDE VIEW OF THE ROCK",
            description: "",
            startTime: 38,
          },
        ],
        nextSceneId: 4,
      },
      {
        id: 4,
        youtubeId: "dSd7PUaTEns", // Replace with actual YouTube video ID for scene 4
        title: "SIDE VIEW OF THE ROCK",
        description: "",
        hotspots: [
          {
            id: "to-WALKING PASS THE ROCK",
            position: { x: 35, y: 65 },
            targetSceneId: 5,
            title: "WALKING PASS THE ROCK",
            description: "",
            startTime: 11,
          },
        ],
        nextSceneId: 5,
      },
      {
        id: 5,
        youtubeId: "c67igt0Ln0Y", // Replace with actual YouTube video ID for scene 5
        title: "WALKING PASS THE ROCK",
        description: "",
        hotspots: [
          {
            id: "return-to-entrance",
            position: { x: 42, y: 58 },
            targetSceneId: 1,
            title: "Return to Entrance",
            description: "",
            startTime: 34,
          },
        ],
        nextSceneId: 1, // Loop back to scene 1
      },
    ],
  },

  {
    id: 9, // NEW ID for Jos Museum FULL TOUR (different from preview)
    title: "Jos Museum",
    description: "Discover the rich cultural heritage and history of Plateau State at Jos Museum",
    tags: ["Virtual tour", "Museum", "Culture", "History"],
    image: shere, // You can replace this with a specific Jos Museum image later
    scenes: [
      {
        id: 1,
        youtubeId: "JCG0MMEFTjE", // Different from preview - Replace with actual YouTube video ID for scene 1
        title: "Museum Entrance",
        description: "",
        hotspots: [
          {
            id: "to-pottery",
            position: { x: 45, y: 60 },
            targetSceneId: 2,
            title: "Enter Main Exhibition Hall",
            description: "",
            startTime: 65,
          },
        ],
        nextSceneId: 2,
      },
      {
        id: 2,
        youtubeId: "FLbbOeP93-k", // Replace with actual YouTube video ID for scene 2
        title: "Pottery",
        description: "",
        hotspots: [
          {
            id: "to-gallery",
            position: { x: 50, y: 55 },
            targetSceneId: 3,
            title: "Visit Pottery & Crafts Section",
            description: "",
            startTime: 65,
          },
        ],
        nextSceneId: 3,
      },
      {
        id: 3,
        youtubeId: "x_OzG1IsxDI", // Replace with actual YouTube video ID for scene 3
        title: "Gallery",
        description: "",
        hotspots: [
          {
            id: "to-historical-gallery",
            position: { x: 40, y: 50 },
            targetSceneId: 4,
            title: "Explore Historical Gallery",
            description: "",
            startTime: 78,
          },
        ],
        nextSceneId: 4,
      },
      {
        id: 4,
        youtubeId: "ZipcQFo4MDY", // Replace with actual YouTube video ID for scene 4
        title: "ZOO-1",
        description: "Journey through the history of Jos and Plateau State with historical artifacts and displays",
        hotspots: [
          {
            id: "to-zoo-2",
            position: { x: 35, y: 65 },
            targetSceneId: 5,
            title: "Cultural Heritage Section",
            description: "",
            startTime: 123,
          },
        ],
        nextSceneId: 5,
      },
      {
        id: 5,
        youtubeId: "yoqjz_7KcuE", // Replace with actual YouTube video ID for scene 5
        title: "ZOO-2",
        description:
          "",
        hotspots: [
          {
            id: "return-to-entrance",
            position: { x: 42, y: 58 },
            targetSceneId: 1,
            title: "Return to Museum Entrance",
            description: "",
            startTime: 110,
          },
        ],
        nextSceneId: 1, // Loop back to scene 1
      },
    ],
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
    id: 5,                      // ← Assop Falls preview
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
 {
    id: 6, // New Jos Museum preview tour
    title: "Jos Museum",
    description: "Discover the rich cultural heritage and history of Plateau State at Jos Museum",
    tags: ["Virtual tour", "Museum", "Culture", "History"],
    image: shere,
    scenes: [
      {
        id: 1,
        youtubeId: "FtakWnJQN6U", // Replace with actual YouTube video ID
        title: "Jos Museum Preview",
        description:
          "A sneak peek of our upcoming Jos Museum virtual tour featuring cultural artifacts and historical exhibits",
        hotspots: [],
        nextSceneId: 1, // Loop back to the same scene
      },
    ],
  },
  {
    id: 7, // New ID for Riyom Rock
    title: "Riyom Rock",
    description:
      "Explore the stunning rock formations and scenic landscapes of Riyom, a geological wonder in Plateau State",
    tags: ["Virtual tour", "Rock Formation", "Geology", "Scenic Views"],
    image: shere, // You can replace this with a specific Riyom Rock image later
    scenes: [
      {
        id: 1,
        youtubeId: "rFUGQeQ7fyc", // Replace with actual YouTube video ID
        title: "Riyom Rock Preview",
        description:
          "A sneak peek of our upcoming Riyom Rock virtual tour featuring stunning rock formations and panoramic views",
        hotspots: [],
        nextSceneId: 1, // Loop back to the same scene
      },
    ],
  },
]
