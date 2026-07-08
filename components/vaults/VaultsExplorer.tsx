"use client"

import { useMemo, useState } from "react"
import { SearchX } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { VaultTable } from "@/components/vaults/VaultTable"
import { VaultsToolbar } from "@/components/vaults/VaultsToolbar"
import {
  ALL_CATEGORIES,
  ALL_CHAINS,
  filterVaults,
  getChainOptions,
  sortVaults,
  type CategoryFilter,
  type SortKey,
} from "@/lib/vault-filters"
import type { Vault } from "@/types"

interface VaultsExplorerProps {
  vaults: Vault[]
}

const DEFAULT_FILTERS = {
  search: "",
  category: ALL_CATEGORIES as CategoryFilter,
  chainLabel: ALL_CHAINS as string,
  sortKey: "predictedApy" as SortKey,
}

/**
 * Owns search/filter/sort state for the vault list and renders the toolbar +
 * table (+ empty state), sharing a single bordered/white container so the
 * toolbar reads as the table's header bar. See plan/05 §2, §4.
 */
export function VaultsExplorer({ vaults }: VaultsExplorerProps) {
  const [search, setSearch] = useState(DEFAULT_FILTERS.search)
  const [category, setCategory] = useState<CategoryFilter>(DEFAULT_FILTERS.category)
  const [chainLabel, setChainLabel] = useState(DEFAULT_FILTERS.chainLabel)
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_FILTERS.sortKey)

  const chainOptions = useMemo(() => getChainOptions(vaults), [vaults])

  const visibleVaults = useMemo(() => {
    const filtered = filterVaults(vaults, { search, category, chainLabel })
    return sortVaults(filtered, sortKey)
  }, [vaults, search, category, chainLabel, sortKey])

  const chainCount = chainOptions.length - 1

  function clearFilters() {
    setSearch(DEFAULT_FILTERS.search)
    setCategory(DEFAULT_FILTERS.category)
    setChainLabel(DEFAULT_FILTERS.chainLabel)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium text-foreground">Vaults</h1>
        <p className="text-sm text-muted-foreground">
          {vaults.length} live APY markets across {chainCount} chains
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b p-4">
          <VaultsToolbar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            chainLabel={chainLabel}
            onChainLabelChange={setChainLabel}
            chainOptions={chainOptions}
            sortKey={sortKey}
            onSortKeyChange={setSortKey}
          />
        </div>

        {visibleVaults.length > 0 ? (
          <VaultTable vaults={visibleVaults} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No vaults match your filters</EmptyTitle>
              <EmptyDescription>
                Try a different search term or clear the category/chain filters.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  )
}
