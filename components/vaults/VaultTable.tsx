"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatApy, formatUsd } from "@/lib/format"
import { daysUntil } from "@/lib/vault-filters"
import type { Vault } from "@/types"

interface VaultTableProps {
  vaults: readonly Vault[]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

function MaturityBadge({ vault }: { vault: Vault }) {
  if (vault.market.matured) {
    return <Badge variant="secondary">Matured</Badge>
  }
  const days = daysUntil(vault.market.marketEndAt)
  return (
    <Badge variant="outline" className="border-positive/30 text-positive">
      Live {"\u2014"} {days}d left
    </Badge>
  )
}

/** Dense row-per-vault list view. See plan/05 §6 (adapted as the primary view per user decision). */
export function VaultTable({ vaults }: VaultTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vault</TableHead>
          <TableHead>Chain</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">TVL</TableHead>
          <TableHead className="text-right">Current APY</TableHead>
          <TableHead className="text-right">Predicted APY</TableHead>
          <TableHead>Maturity</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => (
          <TableRow
            key={vault.id}
            className="cursor-pointer"
            tabIndex={0}
            onClick={() => router.push(`/vaults/${vault.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/vaults/${vault.id}`)
            }}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{initials(vault.asset)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{vault.name}</span>
                  <span className="text-xs text-muted-foreground">{vault.protocol}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{vault.chainLabel}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{vault.category}</TableCell>
            <TableCell className="text-right tabular-nums">{formatUsd(vault.tvlUsd)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatApy(vault.currentApy)}</TableCell>
            <TableCell className="text-right font-medium tabular-nums text-foreground">
              {formatApy(vault.market.impliedApy)}
            </TableCell>
            <TableCell>
              <MaturityBadge vault={vault} />
            </TableCell>
            <TableCell className="text-right">
              {/* Opens the deposit modal once plan/07 lands; navigates to
                  the vault details page for now (no modal to open yet). */}
              <Button
                size="sm"
                render={
                  <Link
                    href={`/vaults/${vault.id}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Deposit into ${vault.name}`}
                  >
                    Deposit
                  </Link>
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
