"use client"

import { ChevronRight } from "lucide-react"

interface EndPromptProps {
  showEndPrompt: boolean
  endPromptType: "auto" | "manual"
  currentScene: any
  handleTransition: (nextSceneId: number) => void
  handleReplay: () => void
}

export default function EndPrompt({
  showEndPrompt,
  endPromptType,
  currentScene,
  handleTransition,
  handleReplay,
}: EndPromptProps) {
  // Always render the component but conditionally show/hide it
  const displayStyle = showEndPrompt ? "flex" : "hidden"

  return (
    <div className={`fixed inset-0 bg-black/80 ${displayStyle} items-center justify-center animate-fadeIn z-40`}>
      <div className="bg-[#1A2E0D] rounded-xl p-6 max-w-md w-full animate-scaleIn shadow-xl">
        <div className="text-center">
          <h2 className="text-[#97E12B] text-2xl font-bold mb-2 animate-slideDown">
            {endPromptType === "auto" ? "You've reached the end of this scene!" : "Explore a new location?"}
          </h2>

          <p className="text-white mb-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            {endPromptType === "auto"
              ? "Would you like to continue to the next scene or replay this one?"
              : "Would you like to visit this new location or continue exploring the current scene?"}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={() =>
                handleTransition(endPromptType === "auto" ? currentScene.nextSceneId : window.tempTargetSceneId || 1)
              }
              className="bg-[#97E12B] text-[#1A2E0D] px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#86c728] transition-colors animate-pulse"
            >
              {currentScene.id === 5
                ? "Restart All Over"
                : endPromptType === "auto"
                  ? "Continue to Next Scene"
                  : "Go to New Location"}
              <ChevronRight size={20} />
            </button>
            <button
              onClick={handleReplay}
              className="bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              {currentScene.id === 5
                ? "Restart This Scene"
                : endPromptType === "auto"
                  ? "Replay This Scene"
                  : "Stay Here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
