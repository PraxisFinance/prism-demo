import { ArrowLeftRight } from "lucide-react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { TokenChip } from "@/components/how-it-works/TokenChip"

/**
 * Users / trade the forecast: move between Stable and Elevated as your view
 * changes. A gentle two-way flow connects the sides. See plan/10 §6.
 */
export function TradeFlowVisual() {
  return (
    <DiagramFrame caption="Move between sides before maturity as the market comes to you.">
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between gap-3">
          <TokenChip variant="stable" label="Stable" />

          <svg
            viewBox="0 0 120 40"
            width="120"
            height="40"
            className="h-10 flex-1"
            fill="none"
            role="img"
            aria-label="Two-way flow between Stable and Elevated"
          >
            <line
              x1={6}
              y1={13}
              x2={114}
              y2={13}
              stroke="var(--profile-elevated)"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="prism-beam prism-beam-flow"
              opacity={0.7}
            />
            <line
              x1={114}
              y1={27}
              x2={6}
              y2={27}
              stroke="var(--profile-stable)"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="prism-beam prism-beam-flow"
              opacity={0.7}
            />
          </svg>

          <TokenChip variant="elevated" label="Elevated" />
        </div>

        <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <ArrowLeftRight className="size-3.5" />
          Take profit · rebalance · flip sides
        </span>
      </div>
    </DiagramFrame>
  )
}
