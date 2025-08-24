"use client"

import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/react"

export default function HomePage() {
  uuseEffect(() => {
  const timeout = setTimeout(() => {
    window.location.href = "/homepage_esg_intelligence_hub.html"
  }, 500) // trì hoãn 0.5 giây

  return () => clearTimeout(timeout)
}, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your website...</p>
      <Analytics />
    </div>
  )
}


