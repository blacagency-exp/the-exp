export interface HotspotState {
    id: string
    position: { x: number; y: number }
    targetSceneId: number
    title: string
    description: string
    startTime: number
    visible: boolean
  }
  
  export interface Scene {
    id: number
    youtubeId: string
    title: string
    description: string
    hotspots: {
      id: string
      position: { x: number; y: number }
      targetSceneId: number
      title: string
      description: string
      startTime: number
    }[]
    nextSceneId: number
  }
  
  export interface Tour {
    id: number
    title: string
    description: string
    image: string
    tags: string[]
    scenes: Scene[]
  }
  
  // Declare YT here
  declare global {
    interface Window {
      YT: typeof YT
      onYouTubeIframeAPIReady: () => void
      tempTargetSceneId?: number
    }
  }
  