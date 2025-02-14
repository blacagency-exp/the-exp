import type React from "react"
import { cn } from "../../lib/utils"

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
  repeat?: number
  gap?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  gap = 0,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
      style={
        {
          "--gap": `${gap}px`,
          "--duration": "80s",
        } as React.CSSProperties
      }
    >
      <div
        className={cn("flex shrink-0 items-center", {
          "animate-marquee": !vertical,
          "animate-marquee-vertical": vertical,
          "group-hover:[animation-play-state:paused]": pauseOnHover,
          "[animation-direction:reverse]": reverse,
        })}
      >
        {children}
      </div>
      <div
        className={cn("flex shrink-0 items-center", {
          "animate-marquee": !vertical,
          "animate-marquee-vertical": vertical,
          "group-hover:[animation-play-state:paused]": pauseOnHover,
          "[animation-direction:reverse]": reverse,
        })}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}

