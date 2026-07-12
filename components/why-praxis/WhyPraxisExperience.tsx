"use client"

import { useState } from "react"

import { ClosingCta } from "@/components/why-praxis/ClosingCta"
import { HubPanel } from "@/components/why-praxis/HubPanel"
import { getSegment, type SegmentId } from "@/components/why-praxis/segments"
import { SegmentScreen } from "@/components/why-praxis/SegmentScreen"

type View = "hub" | SegmentId | "cta"

/**
 * Click-driven hub-and-spoke controller for the "Why Praxis" page. Owns the
 * single view state (hub → segment → cta) and plays an expand/zoom transition
 * on change (disabled under reduced motion via globals.css). Each view fills
 * exactly the viewport below the header — no scrolling. State-only, no routing.
 * See plan/10.
 */
export function WhyPraxisExperience() {
  const [view, setView] = useState<View>("hub")
  const isSegment = view !== "hub" && view !== "cta"

  return (
    <main
      className="relative overflow-hidden"
      style={{ height: "calc(100dvh - 4rem - 1px)" }}
    >
      {/* Full-bleed brand backdrop behind every view. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 12% 10%, color-mix(in oklch, var(--primary) 13%, transparent), transparent), radial-gradient(55% 55% at 90% 92%, color-mix(in oklch, var(--profile-stable) 11%, transparent), transparent)",
        }}
      />

      <div
        key={view}
        className="why-view relative mx-auto flex h-full w-full max-w-6xl flex-col px-6"
      >
        {view === "hub" ? (
          <HubPanel onSelect={setView} onCta={() => setView("cta")} />
        ) : null}

        {isSegment ? (
          <SegmentScreen
            segment={getSegment(view as SegmentId)}
            onSelectSegment={setView}
            onBack={() => setView("hub")}
            onCta={() => setView("cta")}
          />
        ) : null}

        {view === "cta" ? <ClosingCta onBack={() => setView("hub")} /> : null}
      </div>
    </main>
  )
}
