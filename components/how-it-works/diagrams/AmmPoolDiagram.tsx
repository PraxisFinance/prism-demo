"use client"

import { useState } from "react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { TokenChip } from "@/components/how-it-works/TokenChip"
import {
  DEFAULT_SETTLEMENT,
  impliedApyFromStablePrice,
} from "@/lib/settlement"

/**
 * Step 4: Stable & Elevated trade in a pool; their prices sum to 1, so the
 * split reads directly as the market's implied APY. Light interactivity — the
 * slider nudges the price locally (illustrative, not real data). See plan/09 §5.
 */
export function AmmPoolDiagram() {
  const [pStable, setPStable] = useState(0.5)
  const pElevated = 1 - pStable
  const impliedApy = impliedApyFromStablePrice(pStable, DEFAULT_SETTLEMENT)

  return (
    <DiagramFrame caption="Prices always sum to 1 — the split is the market's APY forecast.">
      <div className="flex w-full flex-col gap-6">
        {/* Pool */}
        <div className="flex items-center justify-center gap-4 rounded-xl bg-muted/50 px-4 py-4 ring-1 ring-border">
          <TokenChip variant="stable" label="Stable" />
          <span className="text-sm text-muted-foreground">&#8646;</span>
          <TokenChip variant="elevated" label="Elevated" />
        </div>

        {/* Price bar */}
        <div className="flex flex-col gap-2">
          <div className="flex h-7 w-full overflow-hidden rounded-full ring-1 ring-border">
            <div
              className="flex items-center justify-start bg-profile-stable/25 pl-3 text-xs font-semibold text-profile-stable transition-[width]"
              style={{ width: `${pStable * 100}%` }}
            >
              {(pStable).toFixed(2)}
            </div>
            <div
              className="flex items-center justify-end bg-profile-elevated/25 pr-3 text-xs font-semibold text-profile-elevated transition-[width]"
              style={{ width: `${pElevated * 100}%` }}
            >
              {(pElevated).toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>pStable</span>
            <span>pStable + pElevated = 1</span>
            <span>pElevated</span>
          </div>
        </div>

        {/* Implied APY readout */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">
            Market-implied APY
          </span>
          <span className="font-heading text-3xl font-medium text-foreground tabular-nums">
            {impliedApy.toFixed(2)}%
          </span>
        </div>

        {/* Control */}
        <label className="flex flex-col gap-2">
          <span className="text-center text-xs text-muted-foreground">
            Drag to explore how price sets the forecast
          </span>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.01}
            value={pStable}
            onChange={(event) => setPStable(Number(event.target.value))}
            aria-label="Stable price"
            className="w-full accent-primary"
          />
        </label>
      </div>
    </DiagramFrame>
  )
}
