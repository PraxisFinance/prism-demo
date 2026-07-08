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
import type { Vault } from "@/types"

interface SettlementCurveChartProps {
  vault: Vault
}

const chartConfig: ChartConfig = {
  stableApy: { label: "Stable settlement APY", color: "var(--profile-stable)" },
  elevatedApy: { label: "Elevated settlement APY", color: "var(--profile-elevated)" },
}

const round = (n: number) => Math.round(n * 100) / 100

/**
 * Stable/Elevated/Standard settlement graphic — a pure function of
 * `(targetApy, protectionBuffer)`, never a time series. See
 * plan/06-vault-details-and-prediction.md §5. Prop shapes verified against
 * the installed recharts@3.8.0 type declarations
 * (node_modules/recharts/types/cartesian/{Line,ReferenceLine,ReferenceDot,XAxis}.d.ts).
 *
 * Per the Figma redesign follow-up (point 4), this is no longer gated by a
 * selected deposit type — there's nothing to "choose" here, it's a single
 * static graphic always showing all 3 profiles: Stable + Elevated
 * settlement curves at full weight, plus a flat Standard reference line
 * (Standard has no market exposure, so it's just the vault's current spot
 * APY regardless of realized APY at maturity). The actual choice of which
 * token to deposit into still happens in the Deposit panel
 * (VaultActionPanel), which keeps its own ProfileCardSelector.
 */
export function SettlementCurveChart({ vault }: SettlementCurveChartProps) {
  const { market } = vault
  const params = toMarketParams(market.targetApy, market.protectionBuffer)
  const maxX = Math.max(market.targetApy * 2, 1)
  const curve = buildSettlementCurve(params, { maxX })

  const heresX = round(Math.min(market.realizedApySoFar, maxX))
  const heresStableY = round(stableSettlementApy(heresX, params))
  const heresElevatedY = round(elevatedSettlementApy(heresX, params))

  return (
    <ChartContainer
      config={chartConfig}
      role="img"
      aria-label={`Settlement curve for ${vault.name}. Standard earns a flat ${formatApy(vault.currentApy)}. Stable/Elevated market: target APY ${formatApy(market.targetApy)}, protection buffer down to ${formatApy(market.boundaryApy)}, currently implied APY ${formatApy(market.impliedApy)}.`}
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
        <ReferenceLine
          y={vault.currentApy}
          stroke="var(--profile-standard)"
          strokeDasharray="6 3"
          strokeWidth={1.5}
          label={{ value: "Standard (flat)", position: "insideTopLeft", className: "fill-(--profile-standard) text-[10px] font-medium" }}
        />
        <Line
          dataKey="stableApy"
          name="Stable settlement APY"
          type="monotone"
          stroke="var(--color-stableApy)"
          strokeWidth={3}
          dot={false}
          isAnimationActive
        />
        <Line
          dataKey="elevatedApy"
          name="Elevated settlement APY"
          type="monotone"
          stroke="var(--color-elevatedApy)"
          strokeWidth={3}
          dot={false}
          isAnimationActive
        />
        <ReferenceDot
          x={heresX}
          y={heresStableY}
          r={6}
          fill="var(--color-stableApy)"
          stroke="var(--card)"
          strokeWidth={2}
          label={{ value: "You are here", position: "top", className: "fill-foreground text-xs font-medium" }}
        />
        <ReferenceDot
          x={heresX}
          y={heresElevatedY}
          r={6}
          fill="var(--color-elevatedApy)"
          stroke="var(--card)"
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  )
}
