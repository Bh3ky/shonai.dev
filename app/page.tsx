"use client"

import { useEffect, useState } from "react"
import { RetroGlobe } from "@/components/retro-globe"

export default function ComingSoonPage() {
  const [initText, setInitText] = useState("")
  const initFullText = "INITIALIZING_"

  const [showGlobe, setShowGlobe] = useState(false)
  const [showInit, setShowInit] = useState(true)

  const fullText = "PERSONAL WEBSITE COMING SOON..."

  useEffect(() => {
    let initIndex = 0
    const initInterval = setInterval(() => {
      if (initIndex <= initFullText.length) {
        setInitText(initFullText.slice(0, initIndex))
        initIndex++
      } else {
        clearInterval(initInterval)
      }
    }, 80)

    // Start globe animation after initializing text
    const startDelay = setTimeout(() => {
      setShowGlobe(true)
      setShowInit(false)
    }, 1500)

    return () => {
      clearInterval(initInterval)
      clearTimeout(startDelay)
    }
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-background scanlines crt-glow">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-primary/50 font-mono text-sm">[SYSTEM ONLINE]</div>
      <div className="absolute top-4 right-4 text-secondary/50 font-mono text-sm">[WAKANDA_OS v2.0]</div>
      <div className="absolute bottom-4 left-4 text-accent/50 font-mono text-sm">[CONNECTING...]</div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-5xl mx-auto space-y-8 md:space-y-12">

          {/* Header */}
          <div className="text-center space-y-4">
            {showInit ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold neon-text text-primary tracking-wider">
                  {initText}
                </h1>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
                </div>  
              </>
            ) : (
              <h1 className="text-4xl md:text-3xl font-bold neon-text text-primary tracking-wider">
                {fullText}
              </h1>
            )}
          </div>

          {/* Globe container */}
          <div className="relative flext justify-center">
            {showGlobe && (
              <div className="scale-[0.85]">
                <RetroGlobe />
              </div>
            )}
          </div>

          {/* Bottom progress bar */}
          <div className="space-y-2">
            <div className="h-2 bg-card rounded-sm overflow-hidden border border-primary/30">
              <div
                className="h-full bg-linear-to-r from-primary via-secondary to-accent animate-pulse"
                style={{
                  width: "100%",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
            <p className="text-center text-muted-foreground font-mono text-xs md:text-sm">
              [LOADING COORDINATES: 0°N, 0°E → WAKANDA]
            </p>
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />
    </main>
  )
}