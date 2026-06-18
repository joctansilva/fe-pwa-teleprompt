'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

export function useTeleprompter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [speed, setSpeedState] = useState(60)
  const [fontSize, setFontSizeState] = useState(32)
  const [containerHeight, setContainerHeight] = useState(0)

  const speedRef = useRef(speed)
  const animFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined && containerRef.current) {
      const delta = time - lastTimeRef.current
      containerRef.current.scrollTop += (speedRef.current * delta) / 1000
    }
    lastTimeRef.current = time
    animFrameRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (isScrolling) {
      lastTimeRef.current = undefined
      animFrameRef.current = requestAnimationFrame(animate)
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isScrolling, animate])

  // Track container height for padding calculation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setContainerHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const start = useCallback(() => setIsScrolling(true), [])
  const pause = useCallback(() => setIsScrolling(false), [])

  const reset = useCallback(() => {
    setIsScrolling(false)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    lastTimeRef.current = undefined
    if (containerRef.current) containerRef.current.scrollTop = 0
  }, [])

  const setSpeed = useCallback((v: number) => setSpeedState(v), [])
  const setFontSize = useCallback((v: number) => setFontSizeState(v), [])

  return {
    containerRef,
    isScrolling,
    speed,
    fontSize,
    containerHeight,
    start,
    pause,
    reset,
    setSpeed,
    setFontSize,
  }
}
