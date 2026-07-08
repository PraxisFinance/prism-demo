/**
 * Derived portfolio maths. Positions store principal + entry price +
 * timestamp; current value, earnings, and effective APY are always
 * DERIVED from the position + its vault, never stored raw. See
 * plan/04-mock-data-and-state.md §10.
 *
 * Pure functions of (positions, vaults, now) — no store coupling — so
 * they're testable and usable in components via `useMemo` over the
 * Zustand-selected `positions` array.
 */
import { effectiveApy, toMarketParams } from "@/lib/prism"
import type { Position, RiskProfile, Vault } from "@/types"

/** 1 real second of wall-clock time ≈ 6 hours of elapsed-time growth, tuned for visibly ticking numbers in a live demo. */
export const DEMO_TIME_ACCELERATION = 24 * 6
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

function findVault(vaults: readonly Vault[], vaultId: string): Vault | undefined {
  return vaults.find((v) => v.id === vaultId)
}

/**
 * Effective APY (fraction, e.g. 0.084 = 8.4%) for a given deposit type +
 * entry price against a vault's realized-so-far APY — the one accrual
 * formula shared by live positions (via `effectiveApyForPosition` below)
 * AND the deposit modal's pre-deposit projection (plan/07 §3), so the two
 * can never drift apart. `entryPrice` is the Stable-token price (required
 * iff `profile !== 'standard'`); Elevated's entry is `1 - entryPrice`, same
 * convention as `Position.entryPrice` (types/index.ts).
 */
export function effectiveApyForEntry(profile: RiskProfile, entryPrice: number | undefined, vault: Vault): number {
  if (profile === "standard") return vault.currentApy / 100
  if (entryPrice === undefined) return 0

  const x = vault.market.realizedApySoFar / 100
  const entryForKind = profile === "stable" ? entryPrice : 1 - entryPrice
  const params = toMarketParams(vault.market.targetApy, vault.market.protectionBuffer)
  return effectiveApy(profile, entryForKind, x, params)
}

/** A position's effective APY (fraction, e.g. 0.084 = 8.4%) given its entry price and the vault's realized-so-far APY. */
export function effectiveApyForPosition(position: Position, vault: Vault): number {
  return effectiveApyForEntry(position.profile, position.entryPrice, vault)
}

/**
 * Current value in USD. Growth is accelerated for demo purposes
 * (DEMO_TIME_ACCELERATION) and freezes once the vault's market has
 * matured — elapsed time is clamped to `marketEndAt`, never running past
 * settlement.
 */
export function currentValue(position: Position, vault: Vault, now: number): number {
  const apy = effectiveApyForPosition(position, vault)
  const effectiveNow = Math.min(now, vault.market.marketEndAt)
  const elapsedYears = Math.max((effectiveNow - position.depositedAt) * DEMO_TIME_ACCELERATION, 0) / ONE_YEAR_MS
  return position.principalUsd * (1 + apy * elapsedYears)
}

export function earnings(position: Position, vault: Vault, now: number): number {
  return currentValue(position, vault, now) - position.principalUsd
}

export interface PortfolioTotals {
  totalValue: number
  totalPrincipal: number
  totalEarnings: number
  /** Principal-weighted average of each position's effective APY (fraction). */
  blendedApy: number
}

/** Aggregate totals across all positions. Positions whose vault can't be found (shouldn't happen) are skipped. */
export function computePortfolioTotals(positions: readonly Position[], vaults: readonly Vault[], now: number): PortfolioTotals {
  let totalValue = 0
  let totalPrincipal = 0
  let weightedApy = 0

  for (const position of positions) {
    const vault = findVault(vaults, position.vaultId)
    if (!vault) continue
    const value = currentValue(position, vault, now)
    const apy = effectiveApyForPosition(position, vault)
    totalValue += value
    totalPrincipal += position.principalUsd
    weightedApy += apy * position.principalUsd
  }

  return {
    totalValue,
    totalPrincipal,
    totalEarnings: totalValue - totalPrincipal,
    blendedApy: totalPrincipal > 0 ? weightedApy / totalPrincipal : 0,
  }
}

export interface AllocationSlice {
  vaultId: string
  vaultName: string
  value: number
  /** 0..1 share of total current portfolio value. */
  share: number
}

/** Per-vault share of total current portfolio value, for the allocation donut (plan/08). Positions in the same vault (different profiles/lots) are combined. */
export function computeAllocation(positions: readonly Position[], vaults: readonly Vault[], now: number): AllocationSlice[] {
  const byVault = new Map<string, number>()
  for (const position of positions) {
    const vault = findVault(vaults, position.vaultId)
    if (!vault) continue
    byVault.set(vault.id, (byVault.get(vault.id) ?? 0) + currentValue(position, vault, now))
  }

  const total = [...byVault.values()].reduce((sum, v) => sum + v, 0)

  return [...byVault.entries()].map(([vaultId, value]) => ({
    vaultId,
    vaultName: findVault(vaults, vaultId)?.name ?? vaultId,
    value,
    share: total > 0 ? value / total : 0,
  }))
}

/** The single headline predicted APY for a vault under the given deposit type — never a curve/band/confidence. */
export function headlineApyForProfile(vault: Vault, profile: Position["profile"]): number {
  return profile === "standard" ? vault.currentApy : vault.market.impliedApy
}
