interface DebugInfoProps {
    playerTime: number
    currentScene: any
    hotspots: any[]
  }
  
  export default function DebugInfo({ playerTime, currentScene, hotspots }: DebugInfoProps) {
    return (
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded z-20">
        Time: {playerTime.toFixed(1)}s | Scene: {currentScene.id} | Next: {currentScene.nextSceneId || "None"} | Hotspots:{" "}
        {hotspots.filter((h) => h.visible).length}/{hotspots.length} visible
      </div>
    )
  }
  