"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Tracks whether the referenced element has entered the viewport.
 * Used to drive scroll-reveal animations on the "How it works" page.
 * Default root is the viewport; our full-viewport scroll container sits in
 * the viewport, so sections report correctly as they scroll into it.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.2,
  once = true
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, inView }
}
