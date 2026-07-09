"use client"

import { Pie, PieChart, Label } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatUsd } from "@/lib/format"
import type { AllocationSlice } from "@/lib/portfolio"

interface AllocationChartProps {
  allocation: readonly AllocationSlice[]
  totalValue: number
}

const CHART_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/**
 * Donut of per-vault allocation share (plan/08 §5). Colors cycle through
 * the app's generic `--chart-1..5` theme vars (per-vault, not per-profile —
 * `--profile-*` is reserved for Stable/Standard/Elevated identity elsewhere,
 * see lib/profiles.ts) keyed by vaultId. Each data point carries its own
 * `fill`, which `Pie` picks up directly (no `Cell` children needed — `Cell`
 * is deprecated as of recharts 3.8, verified against
 * node_modules/recharts/types/polar/Pie.d.ts / PieSettings.d.ts).
 */
export function AllocationChart({ allocation, totalValue }: AllocationChartProps) {
  const data = allocation.map((slice, index) => ({
    vaultId: slice.vaultId,
    vaultName: slice.vaultName,
    value: slice.value,
    share: slice.share,
    fill: CHART_COLOR_VARS[index % CHART_COLOR_VARS.length],
  }))

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((slice, index) => [
      slice.vaultId,
      { label: slice.vaultName, color: CHART_COLOR_VARS[index % CHART_COLOR_VARS.length] },
    ])
  )

  if (data.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center text-sm text-muted-foreground">
        No allocation yet
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <ChartContainer
        config={chartConfig}
        role="img"
        aria-label={`Portfolio allocation by vault, totaling ${formatUsd(totalValue)}. ${data
          .map((slice) => `${slice.vaultName}: ${(slice.share * 100).toFixed(1)}%`)
          .join(", ")}.`}
        className="aspect-square w-full"
      >
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="vaultId"
                formatter={(value, _name, item) => (
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.payload?.fill }}
                      />
                      {item.payload?.vaultName}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {formatUsd(Number(value))}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="vaultId"
            innerRadius="62%"
            outerRadius="96%"
            strokeWidth={4}
            paddingAngle={data.length > 1 ? 2 : 0}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={(cy ?? 0) - 11} className="fill-foreground text-2xl font-heading font-medium">
                      {formatUsd(totalValue)}
                    </tspan>
                    <tspan x={cx} y={(cy ?? 0) + 11} className="fill-muted-foreground text-xs">
                      Total value
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      {/* Rendered outside the recharts plot area (rather than via <ChartLegend>) so the
          donut's own centering isn't skewed by reserved legend space inside the chart. */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        {data.map((slice) => (
          <span key={slice.vaultId} className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: slice.fill }} />
            {slice.vaultName}
          </span>
        ))}
      </div>
    </div>
  )
}
