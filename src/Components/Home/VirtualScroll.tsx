import type React from "react"
import { useRef, useState, useEffect } from "react"

interface VirtualScrollProps {
  itemCount: number
  itemSize: number
  renderItem: (index: number) => React.ReactNode
}

export function VirtualScroll({ itemCount, itemSize, renderItem }: VirtualScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const translateX = (progress * 0.07) % (itemCount * itemSize)
      setScrollPosition(translateX)

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [itemCount, itemSize])

  const visibleItemCount = Math.ceil(window.innerWidth / itemSize) + 1
  const startIndex = Math.floor(scrollPosition / itemSize)
  const endIndex = Math.min(startIndex + visibleItemCount, itemCount)

  const items = []
  for (let i = startIndex; i < endIndex; i++) {
    items.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${i * itemSize - scrollPosition}px`,
          width: `${itemSize}px`,
        }}
      >
        {renderItem(i % (itemCount / 2))}
      </div>,
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: `${itemSize}px`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {items}
    </div>
  )
}

