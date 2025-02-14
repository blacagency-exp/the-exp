"use client"

import { useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { HomeHeader } from "./HomeHeader"
import { PageHeader } from "./PageHeader"
import type React from "react" // Added import for React

interface BaseLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === "/" || location.pathname === "/count"

  return (
    <div className="min-h-screen bg-white">
      {isHomePage ? <HomeHeader /> : <PageHeader />}
      <main>{children}</main>
      <Footer />
    </div>
  )
}

