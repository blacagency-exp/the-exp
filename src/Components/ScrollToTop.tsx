"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ScrollToTop() {
  useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}

