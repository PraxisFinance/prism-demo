"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatApy, formatCompact, formatUsd } from "@/lib/format"
import { buildHistoryChartData, type HistoryMetric, type HistoryRange } from "@/lib/vault-history"
import type { Vault } from "@/types"

interface VaultPerformanceChartProps {
  vault: Vault
}

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "var(--primary)" },
}

const METRICS: { value: HistoryMetric; label: string }[] = [
  { value: "apy", label: "APY" },
  { value: "tvl", label: "TVL" },
]

const RANGES: { value: HistoryRange; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
]

/**
 * The Figma design's "History & Performance" chart — a real, dated line of
 * this vault's trailing APY or TVL (DeFiLlama daily history, previously
 * only consumed internally by lib/market.ts). This is genuinely historical
 * data, unlike the Prism settlement curve below it (plan/06 §5), which is a
 * pure function of (targetApy, protectionBuffer), never a time series.
 *
 * Content-only (no card/border) — it's rendered inside the shared
 * VaultDetails "info card" alongside the header/stats/general-info, per the
 * Figma redesign's single bordered container. See plan/figma-mapping.md.
 */
export function VaultPerformanceChart({ vault }: VaultPerformanceChartProps) {
  const [metric, setMetric] = useState<HistoryMetric>("apy")
  const [range, setRange] = useState<HistoryRange>("1M")

  const data = useMemo(
    () => buildHistoryChartData(vault.history, metric, range),
    [vault.history, metric, range]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-base font-medium text-foreground">
          History &amp; Performance
        </h2>
        <div className="flex items-center gap-2">
          <ToggleGroup
            value={[metric]}
            onValueChange={(next) => {
              const nextMetric = next[0] as HistoryMetric | undefined
              if (nextMetric) setMetric(nextMetric)
            }}
            className="rounded-lg bg-muted p-1"
          >
            {METRICS.map((m) => (
              <ToggleGroupItem
                key={m.value}
                value={m.value}
                aria-label={m.label}
                className="rounded-md px-3 text-xs data-pressed:bg-card data-pressed:shadow-sm"
              >
                {m.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            value={[range]}
            onValueChange={(next) => {
              const nextRange = next[0] as HistoryRange | undefined
              if (nextRange) setRange(nextRange)
            }}
            className="rounded-lg bg-muted p-1"
          >
            {RANGES.map((r) => (
              <ToggleGroupItem
                key={r.value}
                value={r.value}
                aria-label={r.label}
                className="rounded-md px-3 text-xs data-pressed:bg-card data-pressed:shadow-sm"
              >
                {r.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No historical data available yet.
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="vaultPerformanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={32} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) => (metric === "apy" ? `${value}%` : formatCompact(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">{metric === "apy" ? "APY" : "TVL"}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {metric === "apy" ? formatApy(Number(value)) : formatUsd(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="value"
              type="monotone"
              stroke="var(--primary)"
              fill="url(#vaultPerformanceFill)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
