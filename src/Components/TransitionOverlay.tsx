interface TransitionOverlayProps {
    isTransitioning: boolean
    transitionProgress: number
  }
  
  export default function TransitionOverlay({ isTransitioning, transitionProgress }: TransitionOverlayProps) {
    if (!isTransitioning) return null
  
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
        <div className="text-white text-xl font-medium mb-8">Transitioning to next scene...</div>
        <div className="w-64 h-3 bg-[#1A2E0D] rounded-full overflow-hidden">
          <div className="h-full bg-[#97E12B] rounded-full" style={{ width: `${transitionProgress}%` }}></div>
        </div>
      </div>
    )
  }
  