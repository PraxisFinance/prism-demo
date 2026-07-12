/**
 * Pure filter/sort/derived-display helpers for the /vaults screen
 * (plan/05-vault-list.md §4). No I/O, no randomness — safe to call from
 * `useMemo` in the client explorer component.
 */
import type { Vault, VaultCategory } from "@/types"

export type SortKey = "predictedApy" | "currentApy" | "tvl" | "maturity"
export type SortDirection = "asc" | "desc"

/** Order matches the vault table's column order (see VaultTable's sortable headers). */
export const SORT_OPTIONS: readonly { id: SortKey; label: string }[] = [
  { id: "tvl", label: "TVL" },
  { id: "currentApy", label: "Current APY" },
  { id: "predictedApy", label: "Predicted APY" },
  { id: "maturity", label: "Maturity" },
]

/** Sensible default direction the first time a column header is clicked — biggest first for apy/tvl, soonest first for maturity. */
export const DEFAULT_SORT_DIRECTIONS: Record<SortKey, SortDirection> = {
  predictedApy: "desc",
  currentApy: "desc",
  tvl: "desc",
  maturity: "asc",
}

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

const ASCENDING_COMPARATORS: Record<SortKey, (a: Vault, b: Vault) => number> = {
  predictedApy: (a, b) => a.market.impliedApy - b.market.impliedApy,
  currentApy: (a, b) => a.currentApy - b.currentApy,
  tvl: (a, b) => a.tvlUsd - b.tvlUsd,
  maturity: (a, b) => a.market.marketEndAt - b.market.marketEndAt,
}

/** Direction defaults to DEFAULT_SORT_DIRECTIONS[sortKey] (biggest first for apy/tvl, soonest — or already-matured — first for maturity). */
export function sortVaults(
  vaults: readonly Vault[],
  sortKey: SortKey,
  direction: SortDirection = DEFAULT_SORT_DIRECTIONS[sortKey]
): Vault[] {
  const compare = ASCENDING_COMPARATORS[sortKey]
  const sign = direction === "asc" ? 1 : -1
  return [...vaults].sort((a, b) => sign * compare(a, b))
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Whole days between `now` and `marketEndAt` (wall-clock, matches lib/market.ts's own T0/T1 math). Negative once matured. */
export function daysUntil(marketEndAt: number, now = Date.now()): number {
  return Math.ceil((marketEndAt - now) / DAY_MS)
}
