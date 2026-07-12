"use client"

import { useEffect, useState } from "react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"

interface LiquidityCompareVisualProps {
  /** Show the oversized "40×" headline above the bars. */
  showStat?: boolean
}

/**
 * Vaults / comparison: liquidity needed to bootstrap a market — Praxis vs a
 * comparable Pendle market. Bars grow in on mount (instant under reduced
 * motion). Illustrative, not benchmarked. See plan/10 §6.
 */
export function LiquidityCompareVisual({
  showStat = true,
}: LiquidityCompareVisualProps) {
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const bars = [
    { label: "Pendle", width: 100, className: "bg-muted-foreground/25" },
    {
      label: "Praxis",
      width: 2.5,
      className: "bg-profile-stable/50",
      emphasized: true,
    },
  ]

  return (
    <DiagramFrame caption="Liquidity needed to bootstrap a healthy market — illustrative.">
      <div className="flex w-full flex-col gap-5">
        {showStat ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-heading text-5xl font-bold text-profile-stable tabular-nums">
              40×
            </span>
            <span className="max-w-xs text-center text-xs text-muted-foreground">
              less liquidity than a comparable Pendle market — varies with APY &
              duration
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {bars.map((bar) => (
            <div key={bar.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={
                    bar.emphasized
                      ? "font-semibold text-profile-stable"
                      : "text-muted-foreground"
                  }
                >
                  {bar.label}
                </span>
              </div>
              <div className="h-5 w-full overflow-hidden rounded-full bg-muted/40 ring-1 ring-border">
                <div
                  className={`h-full min-w-[6px] rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${bar.className}`}
                  style={{ width: `${grown ? bar.width : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  )
}
