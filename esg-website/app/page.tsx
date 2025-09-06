"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/Homepage"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p></p>
    </div>
  )
}
