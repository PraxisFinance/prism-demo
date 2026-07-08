"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { buildSettlementCurve, elevatedSettlementApy, stableSettlementApy, toMarketParams } from "@/lib/prism"
import { formatApy } from "@/lib/format"
import type { RiskProfile, Vault } from "@/types"

interface SettlementCurveChartProps {
  vault: Vault
  profile: RiskProfile
}

const chartConfig: ChartConfig = {
  stableApy: { label: "Stable settlement APY", color: "var(--profile-stable)" },
  elevatedApy: { label: "Elevated settlement APY", color: "var(--profile-elevated)" },
}

const round = (n: number) => Math.round(n * 100) / 100

/**
 * Stable/Elevated settlement curve — a pure function of `(targetApy,
 * protectionBuffer)`, never a time series. See
 * plan/06-vault-details-and-prediction.md §5. Prop shapes verified against
 * the installed recharts@3.8.0 type declarations
 * (node_modules/recharts/types/cartesian/{Line,ReferenceLine,ReferenceDot,XAxis}.d.ts).
 */
export function SettlementCurveChart({ vault, profile }: SettlementCurveChartProps) {
  const { market } = vault
  const params = toMarketParams(market.targetApy, market.protectionBuffer)
  const maxX = Math.max(market.targetApy * 2, 1)
  const curve = buildSettlementCurve(params, { maxX })

  const isStandard = profile === "standard"
  const lineStyle = (kind: "stable" | "elevated") => {
    if (isStandard) return { strokeWidth: 1.5, strokeOpacity: 0.35 }
    const active = profile === kind
    return { strokeWidth: active ? 3 : 1.5, strokeOpacity: active ? 1 : 0.35 }
  }

  const heresX = round(Math.min(market.realizedApySoFar, maxX))
  const heresY =
    profile === "stable"
      ? round(stableSettlementApy(heresX, params))
      : profile === "elevated"
        ? round(elevatedSettlementApy(heresX, params))
        : null

  return (
    <ChartContainer
      config={chartConfig}
      role="img"
      aria-label={`Settlement curve for ${vault.name}. Target APY ${formatApy(market.targetApy)}, protection buffer down to ${formatApy(market.boundaryApy)}, currently implied APY ${formatApy(market.impliedApy)}.`}
      className="h-[360px] w-full"
    >
      <LineChart data={curve} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          domain={[0, maxX]}
          tickFormatter={(value: number) => `${value}%`}
          label={{ value: "Realized APY at maturity", position: "insideBottom", offset: -4, className: "fill-muted-foreground text-xs" }}
        />
        <YAxis
          type="number"
          domain={[0, maxX]}
          tickFormatter={(value: number) => `${value}%`}
          width={44}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Realized APY: ${value}%`}
              formatter={(value, name, item) => (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {name}
                  </span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {Number(value).toFixed(2)}%
                  </span>
                </div>
              )}
            />
          }
        />
        <ReferenceLine
          y={market.targetApy}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          label={{ value: "target", position: "insideBottomRight", className: "fill-muted-foreground text-[10px]" }}
        />
        <ReferenceLine
          x={market.boundaryApy}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          label={{ value: "buffer boundary", position: "top", className: "fill-muted-foreground text-[10px]" }}
        />
        <Line
          dataKey="stableApy"
          name="Stable settlement APY"
          type="monotone"
          stroke="var(--color-stableApy)"
          dot={false}
          isAnimationActive
          {...lineStyle("stable")}
        />
        <Line
          dataKey="elevatedApy"
          name="Elevated settlement APY"
          type="monotone"
          stroke="var(--color-elevatedApy)"
          dot={false}
          isAnimationActive
          {...lineStyle("elevated")}
        />
        {heresY !== null && (
          <ReferenceDot
            x={heresX}
            y={heresY}
            r={6}
            fill={profile === "stable" ? "var(--color-stableApy)" : "var(--color-elevatedApy)"}
            stroke="var(--card)"
            strokeWidth={2}
            label={{ value: "You are here", position: "top", className: "fill-foreground text-xs font-medium" }}
          />
        )}
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  )
}
