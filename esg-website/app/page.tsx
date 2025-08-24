"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/homepage_esg_intelligence_hub.html"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your website...</p>
    </div>
  )
}
