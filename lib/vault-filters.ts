/**
 * Pure filter/sort/derived-display helpers for the /vaults screen
 * (plan/05-vault-list.md §4). No I/O, no randomness — safe to call from
 * `useMemo` in the client explorer component.
 */
import type { Vault, VaultCategory } from "@/types"

export type SortKey = "predictedApy" | "currentApy" | "tvl" | "maturity"

export const SORT_OPTIONS: readonly { id: SortKey; label: string }[] = [
  { id: "predictedApy", label: "Predicted APY" },
  { id: "currentApy", label: "Current APY" },
  { id: "tvl", label: "TVL" },
  { id: "maturity", label: "Days to maturity" },
]

export const ALL_CATEGORIES = "All" as const
export type CategoryFilter = VaultCategory | typeof ALL_CATEGORIES

/** Fixed per plan/05 §2 — matches the VaultCategory union regardless of what's in the current data. */
export const CATEGORY_OPTIONS: readonly CategoryFilter[] = [
  ALL_CATEGORIES,
  "Stablecoin",
  "ETH",
  "LST",
  "RWA",
  "Blue-chip",
]

export const ALL_CHAINS = "All" as const

/** Distinct chainLabels present in the fetched vaults, "All" first. */
export function getChainOptions(vaults: readonly Vault[]): string[] {
  const distinct = [...new Set(vaults.map((v) => v.chainLabel))].sort()
  return [ALL_CHAINS, ...distinct]
}

export interface VaultFilterState {
  search: string
  category: CategoryFilter
  chainLabel: string
}

function matchesSearch(vault: Vault, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    vault.name.toLowerCase().includes(q) ||
    vault.asset.toLowerCase().includes(q) ||
    vault.assetName.toLowerCase().includes(q) ||
    vault.protocol.toLowerCase().includes(q)
  )
}

export function filterVaults(vaults: readonly Vault[], filters: VaultFilterState): Vault[] {
  return vaults.filter(
    (vault) =>
      matchesSearch(vault, filters.search) &&
      (filters.category === ALL_CATEGORIES || vault.category === filters.category) &&
      (filters.chainLabel === ALL_CHAINS || vault.chainLabel === filters.chainLabel)
  )
}

/** Descending for apy/tvl (biggest first), ascending for maturity (soonest — or already-matured — first). */
export function sortVaults(vaults: readonly Vault[], sortKey: SortKey): Vault[] {
  const sorted = [...vaults]
  switch (sortKey) {
    case "predictedApy":
      return sorted.sort((a, b) => b.market.impliedApy - a.market.impliedApy)
    case "currentApy":
      return sorted.sort((a, b) => b.currentApy - a.currentApy)
    case "tvl":
      return sorted.sort((a, b) => b.tvlUsd - a.tvlUsd)
    case "maturity":
      return sorted.sort((a, b) => a.market.marketEndAt - b.market.marketEndAt)
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Whole days between `now` and `marketEndAt` (wall-clock, matches lib/market.ts's own T0/T1 math). Negative once matured. */
export function daysUntil(marketEndAt: number, now = Date.now()): number {
  return Math.ceil((marketEndAt - now) / DAY_MS)
}
