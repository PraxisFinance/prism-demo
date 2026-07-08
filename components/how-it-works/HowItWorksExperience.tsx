"use client"

import { useEffect, useRef, useState } from "react"

import { AmmPoolDiagram } from "@/components/how-it-works/diagrams/AmmPoolDiagram"
import { DepositDiagram } from "@/components/how-it-works/diagrams/DepositDiagram"
import { PickSideDiagram } from "@/components/how-it-works/diagrams/PickSideDiagram"
import { PrismSplitDiagram } from "@/components/how-it-works/diagrams/PrismSplitDiagram"
import { SettlementDiagram } from "@/components/how-it-works/diagrams/SettlementDiagram"
import { HeroPanel } from "@/components/how-it-works/HeroPanel"
import { OutroPanel } from "@/components/how-it-works/OutroPanel"
import { SectionDots } from "@/components/how-it-works/SectionDots"
import { SectionShell } from "@/components/how-it-works/SectionShell"
import { STEPS } from "@/components/how-it-works/steps"

const GHOST_CLASS: Record<number, string> = {
  3: "text-profile-stable/[0.1]",
  5: "text-profile-stable/[0.1]",
}

function StepDiagram({ index }: { index: number }) {
  switch (index) {
    case 1:
      return <DepositDiagram />
    case 2:
      return (
        <PrismSplitDiagram
          input={{ label: "Yield-bearing position", variant: "asset" }}
          outputs={[
            { label: "PT", variant: "pt" },
            { label: "YT", variant: "yt" },
          ]}
          caption="Prism works only on the YT — principal (PT) stays out of the market."
        />
      )
    case 3:
      return (
        <PrismSplitDiagram
          input={{ label: "YT", variant: "yt" }}
          outputs={[
            { label: "Stable", variant: "stable" },
            { label: "Elevated", variant: "elevated" },
          ]}
          caption="1 YT → 1 Stable + 1 Elevated."
        />
      )
    case 4:
      return <AmmPoolDiagram />
    case 5:
      return <PickSideDiagram />
    case 6:
      return <SettlementDiagram />
    default:
      return null
  }
}

export function HowItWorksExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-step]")
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const step = Number((entry.target as HTMLElement).dataset.step)
            if (!Number.isNaN(step)) setActive(step)
          }
        }
      },
      { threshold: 0.5 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Wheel-driven paging on desktop: require a deliberate amount of scroll
  // before advancing one panel, then glide + lock briefly. This makes the snap
  // feel tighter than raw CSS mandatory snapping (which flings on a tiny flick).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const desktop = window.matchMedia("(min-width: 1024px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!desktop.matches || reduce.matches) return

    // How much accumulated wheel delta is needed to move to the next panel,
    // and how long to ignore further input while the glide completes.
    const THRESHOLD = 220
    const COOLDOWN = 750

    let accumulated = 0
    let locked = false
    let resetTimer: ReturnType<typeof setTimeout> | undefined

    const onWheel = (event: WheelEvent) => {
      const height = container.clientHeight
      const current = Math.round(container.scrollTop / height)

      // If the current panel is taller than the viewport (rare on desktop),
      // let it scroll natively instead of hijacking.
      const panel = container.children[current] as HTMLElement | undefined
      if (panel && panel.scrollHeight > height + 4) return

      event.preventDefault()
      if (locked) return

      accumulated += event.deltaY
      if (Math.abs(accumulated) < THRESHOLD) {
        clearTimeout(resetTimer)
        resetTimer = setTimeout(() => (accumulated = 0), 180)
        return
      }

      const direction = accumulated > 0 ? 1 : -1
      accumulated = 0
      const target = Math.max(
        0,
        Math.min(container.children.length - 1, current + direction)
      )
      if (target === current) return

      locked = true
      container.scrollTo({ top: target * height, behavior: "smooth" })
      setTimeout(() => (locked = false), COOLDOWN)
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      container.removeEventListener("wheel", onWheel)
      clearTimeout(resetTimer)
    }
  }, [])

  const scrollToStep = (index: number) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-step="${index}"]`
    )
    if (!el) return
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <main className="relative overflow-hidden">
      <div
        ref={containerRef}
        data-snap-container
        style={{ height: "calc(100dvh - 4rem - 1px)" }}
        className="snap-none overflow-y-auto overscroll-contain scroll-smooth lg:snap-y lg:snap-mandatory"
      >
        <HeroPanel onStart={() => scrollToStep(1)} />

        {STEPS.map((step) => (
          <SectionShell
            key={step.index}
            index={step.index}
            title={step.title}
            lead={step.lead}
            detail={step.detail}
            reverse={step.index % 2 === 0}
            ghostClassName={GHOST_CLASS[step.index]}
          >
            <StepDiagram index={step.index} />
          </SectionShell>
        ))}

        <OutroPanel />
      </div>

      <SectionDots active={active} onSelect={scrollToStep} />
    </main>
  )
}
