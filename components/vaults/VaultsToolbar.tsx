"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ALL_CATEGORIES,
  ALL_CHAINS,
  CATEGORY_OPTIONS,
  type CategoryFilter,
} from "@/lib/vault-filters"

interface VaultsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  category: CategoryFilter
  onCategoryChange: (value: CategoryFilter) => void
  chainLabel: string
  onChainLabelChange: (value: string) => void
  chainOptions: readonly string[]
}

/** The sentinel "All" value reads as its filter's name ("Chain"/"Type") instead of the unrepresentative literal "All". */
function categoryOptionLabel(option: CategoryFilter): string {
  return option === ALL_CATEGORIES ? "Type" : option
}

function chainOptionLabel(option: string): string {
  return option === ALL_CHAINS ? "Chain" : option
}

/**
 * Search + category/chain filters. Fully controlled — all state lives in
 * VaultsExplorer. Sorting now lives on the table's own clickable column
 * headers (see VaultTable), not here. See plan/05 §2.
 */
export function VaultsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  chainLabel,
  onChainLabelChange,
  chainOptions,
}: VaultsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative w-full max-w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, asset, protocol\u2026"
            className="pl-8"
            aria-label="Search vaults"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => onCategoryChange(value as CategoryFilter)}
          items={CATEGORY_OPTIONS.map((option) => ({
            value: option,
            label: categoryOptionLabel(option),
          }))}
        >
          <SelectTrigger aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {categoryOptionLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={chainLabel}
          onValueChange={(value) => onChainLabelChange(value as string)}
          items={chainOptions.map((option) => ({
            value: option,
            label: chainOptionLabel(option),
          }))}
        >
          <SelectTrigger aria-label="Filter by chain">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chainOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {chainOptionLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
