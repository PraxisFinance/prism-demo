"use client"

import { useState } from "react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { TokenChip } from "@/components/how-it-works/TokenChip"
import { DEFAULT_SETTLEMENT, impliedApyFromStablePrice } from "@/lib/settlement"

interface ForecastVisualProps {
  /** When true, show a slider to explore how price sets the forecast. */
  interactive?: boolean
}

/**
 * Users / APY forecasting: Stable & Elevated prices sum to 1, so the split
 * reads directly as the market-implied APY. Compact by default; interactive in
 * the expanded dialog. Illustrative only — not real data. See plan/10 §6.
 */
export function ForecastVisual({ interactive = false }: ForecastVisualProps) {
  const [pStable, setPStable] = useState(0.42)
  const pElevated = 1 - pStable
  const impliedApy = impliedApyFromStablePrice(pStable, DEFAULT_SETTLEMENT)

  return (
    <DiagramFrame caption="Prices always sum to 1 — the split is the market's APY forecast.">
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-center gap-3">
          <TokenChip variant="stable" label="Stable" />
          <span className="text-sm text-muted-foreground" aria-hidden>
            &#8646;
          </span>
          <TokenChip variant="elevated" label="Elevated" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex h-7 w-full overflow-hidden rounded-full ring-1 ring-border">
            <div
              className="flex items-center justify-start bg-profile-stable/25 pl-3 text-xs font-semibold text-profile-stable transition-[width]"
              style={{ width: `${pStable * 100}%` }}
            >
              {pStable.toFixed(2)}
            </div>
            <div
              className="flex items-center justify-end bg-profile-elevated/25 pr-3 text-xs font-semibold text-profile-elevated transition-[width]"
              style={{ width: `${pElevated * 100}%` }}
            >
              {pElevated.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">
            Market-implied APY
          </span>
          <span className="font-heading text-3xl font-medium text-foreground tabular-nums">
            {impliedApy.toFixed(2)}%
          </span>
        </div>

        {interactive ? (
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
        ) : null}
      </div>
    </DiagramFrame>
  )
}
