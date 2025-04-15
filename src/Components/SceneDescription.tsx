interface SceneDescriptionProps {
    scene: any
    sceneId: number
  }
  
  export default function SceneDescription({ scene, sceneId }: SceneDescriptionProps) {
    return (
      <div className="absolute bottom-24 left-4 text-white text-sm bg-[#1A2E0D]/80 px-3 py-2 rounded-lg z-20 max-w-xs">
        <h3 className="font-medium text-[#97E12B]">{scene.title || `Scene ${sceneId}`}</h3>
        <p className="text-xs text-white/90">{scene.description || "Explore this beautiful location."}</p>
      </div>
    )
  }
  