"use client"

import { useEffect, useState, useRef } from "react"

export function RetroGlobe() {
  const [rotation, setRotation] = useState(0)
  const [showPing, setShowPing] = useState(false)
  const [showWakanda, setShowWakanda] = useState(false)
  const [pingRipples, setPingRipples] = useState<number[]>([])
  const [isGyroActive, setIsGyroActive] = useState(false)
  const [gyroRotation, setGyroRotation] = useState({ x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showGyroPrompt, setShowGyroPrompt] = useState(false)
  const lastGyroTime = useRef(Date.now())
  const gyroTimeout = useRef<NodeJS.Timeout>()

  const requestGyroPermission = async () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setIsGyroActive(true)
        setGyroRotation({
          x: event.beta,
          y: event.gamma,
        })
        lastGyroTime.current = Date.now()

        if (gyroTimeout.current) {
          clearTimeout(gyroTimeout.current)
        }

        gyroTimeout.current = setTimeout(() => {
          setIsGyroActive(false)
        }, 3000)
      }
    }

    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        if (permissionState === "granted") {
          window.addEventListener("deviceorientation", handleOrientation)
          setShowGyroPrompt(false)
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation)
        setShowGyroPrompt(false)
      }
    } catch (error) {
      console.error("Error requesting gyroscope permission:", error)
    }
  }

  useEffect(() => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setShowGyroPrompt(true)
    } else {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta !== null && event.gamma !== null) {
          setIsGyroActive(true)
          setGyroRotation({
            x: event.beta,
            y: event.gamma,
          })
          lastGyroTime.current = Date.now()

          if (gyroTimeout.current) {
            clearTimeout(gyroTimeout.current)
          }

          gyroTimeout.current = setTimeout(() => {
            setIsGyroActive(false)
          }, 3000)
        }
      }
      window.addEventListener("deviceorientation", handleOrientation)

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }

    return () => {
      if (gyroTimeout.current) {
        clearTimeout(gyroTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      if (!isGyroActive) {
        setRotation((prev) => (prev + 1) % 360)
      }
    }, 50)

    const pingTimeout = setTimeout(() => {
      setShowPing(true)
      setShowWakanda(true)

      const rippleInterval = setInterval(() => {
        setPingRipples((prev) => [...prev.slice(-2), Date.now()])
      }, 800)

      setTimeout(() => {
        setIsZooming(true)
        let currentZoom = 1
        const zoomInterval = setInterval(() => {
          currentZoom += 0.05
          if (currentZoom >= 1.3) {
            currentZoom = 1.3
            clearInterval(zoomInterval)
          }
          setZoomLevel(currentZoom)
        }, 50)
      }, 4000)

      return () => clearInterval(rippleInterval)
    }, 2000)

    return () => {
      clearInterval(rotationInterval)
      clearTimeout(pingTimeout)
    }
  }, [isGyroActive])

  const wakandaX = 60 // percentage from left
  const wakandaY = 55 // percentage from top

  const currentRotation = isGyroActive ? gyroRotation.y * 2 : rotation

  return (
    <div className="relative w-full max-w-md md:max-w-lg mx-auto aspect-square flex items-center justify-center">
      {showGyroPrompt && (
        <button
          onClick={requestGyroPermission}
          className="absolute top-4 right-4 z-10 bg-accent/20 hover:bg-accent/30 border border-accent px-4 py-2 text-accent text-sm font-mono transition-colors backdrop-blur-sm"
        >
          ENABLE GYRO
        </button>
      )}

      <div
        className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <div className="absolute inset-4 rounded-full border border-primary/30" />

      <div
        className="relative w-4/5 aspect-square transition-transform duration-1000"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{
            filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))",
          }}
        >
          {[-60, -30, 0, 30, 60].map((lat, i) => {
            const ry = 180 * Math.cos((lat * Math.PI) / 180)
            const cy = 200 - 180 * Math.sin((lat * Math.PI) / 180)
            return (
              <ellipse
                key={`lat-${i}`}
                cx="200"
                cy="200"
                rx="180"
                ry={ry}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/30"
                transform={`rotate(${currentRotation} 200 200)`}
              />
            )
          })}

          {[0, 30, 60, 90, 120, 150].map((lng, i) => (
            <ellipse
              key={`lng-${i}`}
              cx="200"
              cy="200"
              rx={180 * Math.cos(((lng + currentRotation) * Math.PI) / 180)}
              ry="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/30"
            />
          ))}

          <g transform={`rotate(${currentRotation} 200 200)`}>
            <path
              d="M 200 80
                Q 220 90, 230 110
                Q 240 130, 235 150
                Q 230 170, 240 190
                Q 245 210, 240 230
                Q 235 250, 225 270
                Q 210 290, 190 295
                Q 170 290, 160 270
                Q 155 250, 160 230
                Q 165 210, 160 190
                Q 155 170, 165 150
                Q 175 130, 180 110
                Q 190 90, 200 80 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-secondary/60"
            />

            {isZooming && (
              <g opacity={Math.min((zoomLevel - 1) * 2, 1)}>
                <circle
                  cx={200 + (wakandaX - 50) * 3.6}
                  cy={200 - (wakandaY - 50) * 3.6}
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-accent/60"
                  strokeDasharray="3,2"
                />

                <path
                  d={`M ${200 + (wakandaX - 50) * 3.6 - 10} ${200 - (wakandaY - 50) * 3.6}
                      L ${200 + (wakandaX - 50) * 3.6 + 10} ${200 - (wakandaY - 50) * 3.6}
                      M ${200 + (wakandaX - 50) * 3.6} ${200 - (wakandaY - 50) * 3.6 - 10}
                      L ${200 + (wakandaX - 50) * 3.6} ${200 - (wakandaY - 50) * 3.6 + 10}`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent/40"
                />
              </g>
            )}

            <path
              d="M 220 100 Q 250 120, 260 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-secondary/40"
            />
          </g>

          {showPing && (
            <g transform={`rotate(${currentRotation} 200 200)`}>
              {pingRipples.map((timestamp, index) => (
                <circle
                  key={timestamp}
                  cx={200 + (wakandaX - 50) * 3.6}
                  cy={200 - (wakandaY - 50) * 3.6}
                  r="0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent"
                  opacity={1 - index * 0.3}
                >
                  <animate attributeName="r" from="0" to="40" dur="2s" repeatCount="1" />
                  <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
                </circle>
              ))}

              <circle
                cx={200 + (wakandaX - 50) * 3.6}
                cy={200 - (wakandaY - 50) * 3.6}
                r="6"
                fill="currentColor"
                className="text-accent animate-pulse"
              />

              <line
                x1={200 + (wakandaX - 50) * 3.6}
                y1={200 - (wakandaY - 50) * 3.6}
                x2={200 + (wakandaX - 50) * 3.6}
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent/60"
                strokeDasharray="5,5"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.5s" repeatCount="indefinite" />
              </line>
            </g>
          )}
        </svg>

        {showWakanda && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${wakandaX}%`,
              top: `${wakandaY - 20}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-linear-to-b from-accent to-transparent" />

              <div className="bg-card/90 border-2 border-accent px-2 py-1 md:px-4 md:py-2 backdrop-blur-sm">
                <p className="wakanda-text text-accent text-sm md:text-lg whitespace-nowrap">WAKANDA</p>
                <p className="text-accent/70 text-[10px] md:text-xs font-mono text-center mt-0.5">[ORIGIN POINT]</p>
              </div>

              <div className="absolute -top-1 -left-1 w-2 h-2 md:w-3 md:h-3 border-l-2 border-t-2 border-accent" />
              <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 border-r-2 border-t-2 border-accent" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 md:w-3 md:h-3 border-l-2 border-b-2 border-accent" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 md:w-3 md:h-3 border-r-2 border-b-2 border-accent" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute -bottom-12 left-0 right-0 text-center">
        <p className="text-muted-foreground font-mono text-xs md:text-sm">
          [ROT: {Math.round(currentRotation).toString().padStart(3, "0")}°] [STATUS: {showPing ? "LOCKED" : "SCANNING"}]
          {isGyroActive && " [GYRO: ACTIVE]"}
          {isZooming && ` [ZOOM: ${zoomLevel.toFixed(1)}x]`}
        </p>
      </div>
    </div>
  )
}
