/**
 * Live DeFiLlama data + bundled fallback snapshot. See
 * plan/04-mock-data-and-state.md §4.
 *
 * Confirmed working, no API key needed:
 *  - GET https://yields.llama.fi/pools          (latest snapshot, all pools)
 *  - GET https://yields.llama.fi/chart/{poolId} (full daily history for one pool)
 *
 * (`api.llama.fi` aliases exist in the public docs but did not resolve
 * directly in testing — this module talks to `yields.llama.fi` directly.)
 *
 * Requires `cacheComponents: true` in next.config.ts (see plan/02 §1a) for
 * the `'use cache'` directive below to be valid.
 */

import { cacheLife } from "next/cache"
import fallbackSnapshot from "@/data/fallback-snapshot.json"

const POOLS_URL = "https://yields.llama.fi/pools"
const chartUrl = (poolId: string) => `https://yields.llama.fi/chart/${poolId}`

export interface LlamaPool {
  pool: string
  apy: number
  tvlUsd: number
  chain: string
  project: string
  symbol: string
}

export interface PoolHistoryPoint {
  timestamp: string
  apy: number
  tvlUsd: number
}

interface FallbackEntry {
  current: LlamaPool | null
  history: PoolHistoryPoint[]
}

type FallbackSnapshot = Record<string, FallbackEntry>

async function fetchLivePoolsIndex(): Promise<Map<string, LlamaPool>> {
  "use cache"
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 })

  const res = await fetch(POOLS_URL)
  if (!res.ok) throw new Error(`DeFiLlama /pools failed: ${res.status}`)
  const { data } = (await res.json()) as { data: LlamaPool[] }
  return new Map(data.map((p) => [p.pool, p]))
}

async function fetchLivePoolHistory(poolId: string): Promise<PoolHistoryPoint[]> {
  "use cache"
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 })

  const res = await fetch(chartUrl(poolId))
  if (!res.ok) throw new Error(`DeFiLlama /chart failed: ${res.status}`)
  const { data } = (await res.json()) as { data: PoolHistoryPoint[] }
  return data
}

/**
 * Live-first with a bundled fallback snapshot if DeFiLlama is
 * unreachable/rate-limited/slow — important for a live investor demo.
 */
export async function getPoolData(poolId: string): Promise<FallbackEntry> {
  try {
    const [index, history] = await Promise.all([fetchLivePoolsIndex(), fetchLivePoolHistory(poolId)])
    const current = index.get(poolId) ?? null
    // If the live pool lookup missed but history came through, still prefer
    // the fallback's `current` (usually more complete) over a null.
    if (current) return { current, history }
    const fallback = (fallbackSnapshot as FallbackSnapshot)[poolId]
    return { current: fallback?.current ?? null, history: history.length ? history : fallback?.history ?? [] }
  } catch {
    const fallback = (fallbackSnapshot as FallbackSnapshot)[poolId]
    return fallback ?? { current: null, history: [] }
  }
}
