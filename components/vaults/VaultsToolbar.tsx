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
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  type CategoryFilter,
  type SortKey,
} from "@/lib/vault-filters"

interface VaultsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  category: CategoryFilter
  onCategoryChange: (value: CategoryFilter) => void
  chainLabel: string
  onChainLabelChange: (value: string) => void
  chainOptions: readonly string[]
  sortKey: SortKey
  onSortKeyChange: (value: SortKey) => void
}

/**
 * Search + category/chain filters + sort. Fully controlled — all state
 * lives in VaultsExplorer. See plan/05 §2.
 */
export function VaultsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  chainLabel,
  onChainLabelChange,
  chainOptions,
  sortKey,
  onSortKeyChange,
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
          items={CATEGORY_OPTIONS.map((option) => ({ value: option, label: option }))}
        >
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder={ALL_CATEGORIES} />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={chainLabel}
          onValueChange={(value) => onChainLabelChange(value as string)}
          items={chainOptions.map((option) => ({ value: option, label: option }))}
        >
          <SelectTrigger aria-label="Filter by chain">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chainOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortKey}
          onValueChange={(value) => onSortKeyChange(value as SortKey)}
          items={SORT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
        >
          <SelectTrigger aria-label="Sort vaults">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
