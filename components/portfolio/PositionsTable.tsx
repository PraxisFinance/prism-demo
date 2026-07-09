"use client"

import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MaturityBadge } from "@/components/vaults/MaturityBadge"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { PercentDelta } from "@/components/common/PercentDelta"
import { cn } from "@/lib/utils"
import { protocolLogoSrc } from "@/lib/protocol-logos"
import { formatApy, formatPrice, formatUsd } from "@/lib/format"
import { currentValue, earnings, effectiveApyForPosition, type PortfolioTotals } from "@/lib/portfolio"
import type { Position, Vault } from "@/types"

interface PositionsTableProps {
  positions: readonly Position[]
  vaults: readonly Vault[]
  now: number
  totals: PortfolioTotals
  onDepositMore: (vaultId: string) => void
  onWithdraw: (positionId: string) => void
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

/**
 * One row per position (plan/08 §4) — a vault can hold more than one
 * position at once (e.g. a Standard lot alongside a Stable lot, see
 * PositionCard's comment), so rows are deliberately flat/unsorted, not
 * grouped by vault. Row click navigates to the vault, matching VaultTable's
 * existing pattern; the explicit per-row actions are Deposit more/Withdraw.
 */
export function PositionsTable({
  positions,
  vaults,
  now,
  totals,
  onDepositMore,
  onWithdraw,
}: PositionsTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vault</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Principal</TableHead>
          <TableHead className="text-right">Current value</TableHead>
          <TableHead className="text-right">Earnings</TableHead>
          <TableHead className="text-right">Effective APY</TableHead>
          <TableHead className="text-right">Allocation</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const vault = vaults.find((v) => v.id === position.vaultId)
          if (!vault) return null

          const value = currentValue(position, vault, now)
          const gain = earnings(position, vault, now)
          const gainPct = position.principalUsd > 0 ? (gain / position.principalUsd) * 100 : 0
          const apy = effectiveApyForPosition(position, vault) * 100
          const share = totals.totalValue > 0 ? (value / totals.totalValue) * 100 : 0
          const isMarketProfile = position.profile !== "standard"

          return (
            <TableRow
              key={position.id}
              className="cursor-pointer"
              tabIndex={0}
              onClick={() => router.push(`/vaults/${vault.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/vaults/${vault.id}`)
              }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" title={vault.protocol}>
                    {protocolLogoSrc(vault.protocol) && (
                      <AvatarImage src={protocolLogoSrc(vault.protocol)} alt={vault.protocol} />
                    )}
                    <AvatarFallback>{initials(vault.protocol)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{vault.name}</span>
                    <span className="text-xs text-muted-foreground">{vault.chainLabel}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <ProfileBadge profile={position.profile} />
                    {isMarketProfile && <MaturityBadge vault={vault} />}
                  </div>
                  {isMarketProfile && position.entryPrice !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      Entry {formatPrice(position.profile === "stable" ? position.entryPrice : 1 - position.entryPrice)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatUsd(position.principalUsd)}</TableCell>
              <TableCell className="text-right font-medium tabular-nums text-foreground">
                {formatUsd(value)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className={gain >= 0 ? "text-positive" : "text-destructive"}>
                    {gain >= 0 ? "+" : ""}
                    {formatUsd(gain)}
                  </span>
                  <PercentDelta value={gainPct} />
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatApy(apy)}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {share.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={vault.market.matured}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDepositMore(vault.id)
                    }}
                  >
                    Deposit more
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onWithdraw(position.id)
                    }}
                  >
                    Withdraw
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

interface PositionsTotalsBarProps {
  totals: PortfolioTotals
}

/**
 * Aggregate row for the positions table (plan/08 §4 totals), rendered as its
 * own bordered element (explicit user request) rather than a `TableFooter`
 * merged into the table's border, since a `tfoot` row inside the same
 * `<table>`/wrapper reads as part of one continuous block.
 */
export function PositionsTotalsBar({ totals }: PositionsTotalsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm">
      <span className="font-medium text-foreground">Total</span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <TotalStat label="Principal" value={formatUsd(totals.totalPrincipal)} />
        <TotalStat
          label="Current value"
          value={formatUsd(totals.totalValue)}
          valueClassName="font-medium text-foreground"
        />
        <TotalStat
          label="Earnings"
          value={`${totals.totalEarnings >= 0 ? "+" : ""}${formatUsd(totals.totalEarnings)}`}
          valueClassName={totals.totalEarnings >= 0 ? "text-positive" : "text-destructive"}
        />
        <TotalStat label="Effective APY" value={formatApy(totals.blendedApy * 100)} />
        <TotalStat label="Allocation" value="100%" />
      </div>
    </div>
  )
}

interface TotalStatProps {
  label: string
  value: string
  valueClassName?: string
}

function TotalStat({ label, value, valueClassName }: TotalStatProps) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", valueClassName)}>{value}</span>
    </div>
  )
}
