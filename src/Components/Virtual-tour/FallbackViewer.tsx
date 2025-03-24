import { getVideoSourceString } from "../../utils/video-helpers"

interface FallbackViewerProps {
  videoSrc?: string | { default: string } | { toString(): string }
  backgroundColor?: string
  title?: string
}

export function FallbackViewer({ videoSrc, backgroundColor = "#1a5276", title }: FallbackViewerProps) {
  // Convert any non-string video source to a string
  const videoUrl = videoSrc ? getVideoSourceString(videoSrc) : undefined

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor }}>
      {videoUrl ? (
        <div className="w-full h-full max-w-4xl max-h-[80vh] relative mx-auto">
          <video src={videoUrl} className="w-full h-full object-contain" controls autoPlay playsInline loop muted />
        </div>
      ) : (
        <div className="text-white text-center p-8">
          <h2 className="text-3xl font-bold mb-4">{title || "Virtual Tour"}</h2>
          <p className="text-xl">360° view is available in the interactive mode.</p>
          <p className="mt-4 text-lg">Click the "360°" button to switch to interactive mode.</p>
        </div>
      )}
    </div>
  )
}

