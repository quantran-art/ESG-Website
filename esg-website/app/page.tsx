"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your website...</p>
    </div>
  )
}
