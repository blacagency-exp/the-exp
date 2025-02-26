"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    console.log("Scrolling to top, current path:", pathname)
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

