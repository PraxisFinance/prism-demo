/**
 * Derives a vault's Prism market (target APY, protection buffer,
 * lifecycle, implied APY, token prices) from real DeFiLlama history plus a
 * few seeded, deterministic-per-vault choices (market length, lifecycle
 * position, price skew) that DeFiLlama has no opinion on.
 *
 * See plan/04-mock-data-and-state.md §5. Settlement math itself lives in
 * lib/prism.ts — this file is only about turning
 * (vault id + real history + seed) into a `VaultMarket`.
 */
import { stablePriceForImpliedApy, toMarketParams } from "@/lib/prism"
import { mulberry32, hashSeed, randomInRange, pickFrom } from "@/lib/prng"
import type { PoolHistoryPoint } from "@/lib/defillama"
import type { VaultMarket } from "@/types"

const DAY_MS = 24 * 60 * 60 * 1000

/** φ = 20% of t — well under the required φ <= t/2 (whitepaper constraint). */
export const PROTECTION_BUFFER_RATIO = 0.2
/** Trailing window used to set targetApy as of (mocked) market start. */
export const TARGET_LOOKBACK_DAYS = 30
/** Implied APY is seeded to diverge from realized-so-far by up to this fraction — that divergence is what makes it a *prediction*. */
export const IMPLIED_SKEW_RANGE = 0.15
export const DEFAULT_MARKET_DURATIONS_DAYS = [30, 60, 90] as const

export interface BuildVaultMarketInput {
  vaultId: string
  /** Real daily series from DeFiLlama (live or fallback), any order. */
  history: PoolHistoryPoint[]
  /** Real spot APY — used as a fallback when history is too thin to average. */
  currentApy: number
  /** Override the seeded default (30/60/90). */
  durationOverrideDays?: number
  /** Pin this vault's market to already-settled, for demoing that state. */
  forceMatured?: boolean
  now?: number
}

function averageApyInWindow(sorted: PoolHistoryPoint[], fromMs: number, toMs: number): number | null {
  const inWindow = sorted.filter((p) => {
    const t = Date.parse(p.timestamp)
    return !Number.isNaN(t) && t >= fromMs && t <= toMs && typeof p.apy === "number" && !Number.isNaN(p.apy)
  })
  if (inWindow.length === 0) return null
  return inWindow.reduce((sum, p) => sum + p.apy, 0) / inWindow.length
}

export function buildVaultMarket(input: BuildVaultMarketInput): VaultMarket {
  const { vaultId, history, currentApy, durationOverrideDays, forceMatured, now = Date.now() } = input
  const rng = mulberry32(hashSeed(vaultId))
  const sorted = [...history].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))

  // 1. Lifecycle: pick a duration, then place T0 mostly in the past / T1
  //    mostly in the future (seeded), unless forceMatured pins T1 into the past.
  const durationDays = durationOverrideDays ?? pickFrom(rng, DEFAULT_MARKET_DURATIONS_DAYS)
  const durationMs = durationDays * DAY_MS
  const lifecycleFraction = forceMatured ? 1 + randomInRange(rng, 0, 0.15) : randomInRange(rng, 0.05, 0.95)
  const marketStartAt = Math.round(now - lifecycleFraction * durationMs)
  const marketEndAt = marketStartAt + durationMs
  const matured = now >= marketEndAt

  // 2. targetApy: trailing TARGET_LOOKBACK_DAYS average realized APY as of
  //    T0 (falls back to currentApy if history is too short/misaligned).
  //    Fixed for the market's life — stays stable across reloads.
  const targetApy = round2(
    averageApyInWindow(sorted, marketStartAt - TARGET_LOOKBACK_DAYS * DAY_MS, marketStartAt) ??
      averageApyInWindow(sorted, -Infinity, marketStartAt) ??
      currentApy
  )

  // 3. protectionBuffer / boundaryApy from the target.
  const protectionBuffer = Math.max(round2(targetApy * PROTECTION_BUFFER_RATIO), 0.25)
  const marketParams = toMarketParams(targetApy, protectionBuffer)

  // 4. realizedApySoFar: trailing average from T0 to min(now, T1) — the one
  //    number that legitimately drifts as real data updates.
  const realizedApySoFar = round2(
    averageApyInWindow(sorted, marketStartAt, Math.min(now, marketEndAt)) ?? currentApy
  )

  // 5. impliedApy = target-anchored realized-so-far skewed by a seeded
  //    factor (the market's belief diverging from pure extrapolation);
  //    pinned to the exact realized value once settled.
  const skew = matured ? 0 : randomInRange(rng, -IMPLIED_SKEW_RANGE, IMPLIED_SKEW_RANGE)
  const impliedApy = Math.max(round2(realizedApySoFar * (1 + skew)), 0)

  // Static for the session — no price time-series (per "static-seed-only").
  const stablePrice = round3(stablePriceForImpliedApy(impliedApy, marketParams))
  const elevatedPrice = round3(1 - stablePrice)

  return {
    targetApy,
    protectionBuffer,
    boundaryApy: round2(marketParams.boundaryApy),
    marketStartAt,
    marketEndAt,
    matured,
    realizedApySoFar,
    impliedApy,
    stablePrice,
    elevatedPrice,
  }
}


function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}
