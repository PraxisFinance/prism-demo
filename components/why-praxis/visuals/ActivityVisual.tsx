"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"

// Illustrative, gently rising volume profile.
const BARS = [22, 30, 26, 38, 34, 48, 44, 58, 54, 70, 66, 82]

function VolumeSparkline() {
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          On-chain volume
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-positive">
          <TrendingUp className="size-3.5" />
          live
        </span>
      </div>
      <div className="flex h-16 items-end gap-1">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-positive/70 transition-[height] duration-700 ease-out motion-reduce:transition-none"
            style={{
              height: grown ? `${h}%` : "6%",
              transitionDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Chains / additional trading activity: a gently rising volume sparkline —
 * every vault becomes a live, fee-generating market. Bare inline or framed in
 * the dialog. See plan/10 §6.
 */
export function ActivityVisual({ bare = false }: { bare?: boolean }) {
  if (bare) return <VolumeSparkline />
  return (
    <DiagramFrame caption="Every vault becomes a live, two-sided market — continuous on-chain volume.">
      <VolumeSparkline />
    </DiagramFrame>
  )
}
