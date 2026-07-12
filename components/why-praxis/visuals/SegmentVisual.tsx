import type { VisualId } from "@/components/why-praxis/segments"
import { ActivityVisual } from "@/components/why-praxis/visuals/ActivityVisual"
import { ForecastVisual } from "@/components/why-praxis/visuals/ForecastVisual"
import { LiquidityCompareVisual } from "@/components/why-praxis/visuals/LiquidityCompareVisual"
import { PayoffVisual } from "@/components/why-praxis/visuals/PayoffVisual"
import { TradeFlowVisual } from "@/components/why-praxis/visuals/TradeFlowVisual"
import { UxMotif } from "@/components/why-praxis/visuals/UxMotif"

interface SegmentVisualProps {
  visual: VisualId
  /** Enables richer interaction in the expanded dialog. */
  interactive?: boolean
  /** Render without the DiagramFrame surface (for inline use in a card). */
  bare?: boolean
}

/** Renders the purpose-built visual for a value card, or nothing. */
export function SegmentVisual({ visual, interactive, bare }: SegmentVisualProps) {
  switch (visual) {
    case "forecast":
      return <ForecastVisual interactive={interactive} />
    case "payoff-stable":
      return <PayoffVisual variant="stable" />
    case "payoff-elevated":
      return <PayoffVisual variant="elevated" />
    case "trade-flow":
      return <TradeFlowVisual />
    case "liquidity":
      return <LiquidityCompareVisual showStat={interactive} />
    case "activity":
      return <ActivityVisual bare={bare} />
    case "ux":
      return <UxMotif bare={bare} />
    case "none":
    default:
      return null
  }
}

/** Whether a visual id has a renderable component. */
export function hasVisual(visual: VisualId): boolean {
  return visual !== "none"
}
