/**
 * Chart-data helpers for the Vault Details "History & Performance" chart
 * (plan/06 redesign to match the Figma design). Sources the REAL DeFiLlama
 * daily history already fetched in lib/defillama.ts — previously consumed
 * only internally by lib/market.ts and discarded. No synthetic data.
 */
import type { PoolHistoryPoint } from "@/lib/defillama"
import { formatShortDate } from "@/lib/format"

export type HistoryMetric = "apy" | "tvl"
export type HistoryRange = "1M" | "3M"

const DAY_MS = 24 * 60 * 60 * 1000

export const HISTORY_RANGE_DAYS: Record<HistoryRange, number> = {
  "1M": 30,
  "3M": 90,
}

export interface HistoryChartPoint {
  timestamp: number
  date: string
  value: number
}

export function buildHistoryChartData(
  history: readonly PoolHistoryPoint[],
  metric: HistoryMetric,
  range: HistoryRange,
  now: number = Date.now()
): HistoryChartPoint[] {
  const fromMs = now - HISTORY_RANGE_DAYS[range] * DAY_MS

  return history
    .map((point) => ({
      timestamp: Date.parse(point.timestamp),
      value: metric === "apy" ? point.apy : point.tvlUsd,
    }))
    .filter(
      (point) =>
        !Number.isNaN(point.timestamp) &&
        point.timestamp >= fromMs &&
        point.timestamp <= now &&
        typeof point.value === "number" &&
        !Number.isNaN(point.value)
    )
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((point) => ({ ...point, date: formatShortDate(point.timestamp) }))
}
