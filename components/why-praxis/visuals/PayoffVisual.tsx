import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { TOKEN_COLOR } from "@/components/how-it-works/TokenChip"
import {
  boundary,
  DEFAULT_SETTLEMENT,
  settlementSeries,
} from "@/lib/settlement"

interface PayoffVisualProps {
  /** Which side to emphasize. */
  variant: "stable" | "elevated"
}

const X_MAX = 10
const Y_MAX = 16

// Plot area within the 340x210 viewBox.
const PX0 = 40
const PX1 = 320
const PY0 = 172
const PY1 = 20

const sx = (x: number) => PX0 + (x / X_MAX) * (PX1 - PX0)
const sy = (y: number) => PY0 - (y / Y_MAX) * (PY0 - PY1)

const toPath = (points: Array<{ x: number; y: number }>) =>
  points.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`).join(" ")

/**
 * Users / hedging + leveraged: settlement payoff of Stable (blue) vs Elevated
 * (amber) against realized APY, from the pure lib/settlement model. The chosen
 * side is emphasized; the other is muted for context. See plan/10 §6.
 */
export function PayoffVisual({ variant }: PayoffVisualProps) {
  const series = settlementSeries(DEFAULT_SETTLEMENT, X_MAX, 0.5)
  const a = boundary(DEFAULT_SETTLEMENT)
  const { t } = DEFAULT_SETTLEMENT

  const stablePts = series.map((p) => ({ x: p.x, y: p.stable }))
  const elevatedPts = series.map((p) => ({ x: p.x, y: p.elevated }))

  const emphasized = variant
  const stableColor = TOKEN_COLOR.stable
  const elevatedColor = TOKEN_COLOR.elevated

  // Area fill path under the emphasized line.
  const emphPts = emphasized === "stable" ? stablePts : elevatedPts
  const areaPath = `${toPath(emphPts)} L ${sx(X_MAX)} ${sy(0)} L ${sx(0)} ${sy(
    0
  )} Z`

  const caption =
    variant === "stable"
      ? "Stable is floored at the target APY — protection when rates fall."
      : "Elevated captures the upside — amplified when rates run hot."

  return (
    <DiagramFrame caption={caption}>
      <svg
        viewBox="0 0 340 210"
        width="340"
        height="210"
        className="h-auto w-full max-w-md"
        role="img"
        aria-label={`Settlement payoff curve emphasizing the ${variant} side versus realized APY`}
      >
        {/* Axes */}
        <line
          x1={PX0}
          y1={PY0}
          x2={PX1}
          y2={PY0}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line
          x1={PX0}
          y1={PY0}
          x2={PX0}
          y2={PY1}
          stroke="var(--border)"
          strokeWidth={1}
        />

        {/* Target APY reference */}
        <line
          x1={sx(t)}
          y1={PY0}
          x2={sx(t)}
          y2={PY1}
          stroke="var(--muted-foreground)"
          strokeOpacity={0.35}
          strokeDasharray="3 4"
          strokeWidth={1}
        />
        <text
          x={sx(t)}
          y={PY1 - 6}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
        >
          target
        </text>

        {/* Boundary a = t - phi */}
        <line
          x1={sx(a)}
          y1={PY0}
          x2={sx(a)}
          y2={PY1}
          stroke="var(--muted-foreground)"
          strokeOpacity={0.2}
          strokeDasharray="2 4"
          strokeWidth={1}
        />

        {/* Emphasized area */}
        <path
          d={areaPath}
          fill={emphasized === "stable" ? stableColor : elevatedColor}
          fillOpacity={0.12}
        />

        {/* Context line (muted) */}
        <path
          d={toPath(emphasized === "stable" ? elevatedPts : stablePts)}
          fill="none"
          stroke={emphasized === "stable" ? elevatedColor : stableColor}
          strokeOpacity={0.3}
          strokeWidth={2}
          strokeDasharray="4 4"
        />

        {/* Emphasized line */}
        <path
          d={toPath(emphPts)}
          fill="none"
          stroke={emphasized === "stable" ? stableColor : elevatedColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Axis labels */}
        <text
          x={(PX0 + PX1) / 2}
          y={PY0 + 26}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
        >
          realized APY →
        </text>
        <text
          x={PX0 - 6}
          y={PY1 + 2}
          textAnchor="end"
          fontSize={10}
          fill="var(--muted-foreground)"
        >
          payoff
        </text>
      </svg>
    </DiagramFrame>
  )
}
