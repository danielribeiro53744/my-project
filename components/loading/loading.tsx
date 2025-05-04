"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background flex items-center justify-center",
        "transition-opacity duration-500",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted animate-[spin_1.5s_linear_infinite]" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-primary animate-[spin_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}
