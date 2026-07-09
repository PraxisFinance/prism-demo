"use client"

import { Pie, PieChart, Label } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
    <ChartContainer
      config={chartConfig}
      role="img"
      aria-label={`Portfolio allocation by vault, totaling ${formatUsd(totalValue)}. ${data
        .map((slice) => `${slice.vaultName}: ${(slice.share * 100).toFixed(1)}%`)
        .join(", ")}.`}
      className="aspect-square w-full"
    >
      <PieChart>
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
        <Pie data={data} dataKey="value" nameKey="vaultId" innerRadius={70} outerRadius={110} strokeWidth={4} paddingAngle={data.length > 1 ? 2 : 0}>
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
        <ChartLegend content={<ChartLegendContent nameKey="vaultId" />} />
      </PieChart>
    </ChartContainer>
  )
}
