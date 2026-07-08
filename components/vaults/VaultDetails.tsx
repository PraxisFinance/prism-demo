"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModalRoot } from "@/components/modals/ModalRoot"
import { MaturityBadge } from "@/components/vaults/MaturityBadge"
import { PositionCard } from "@/components/vaults/PositionCard"
import { VaultActionPanel } from "@/components/vaults/VaultActionPanel"
import { VaultGeneralInfo } from "@/components/vaults/VaultGeneralInfo"
import { VaultPerformanceChart } from "@/components/vaults/VaultPerformanceChart"
import { VaultStatsCard } from "@/components/vaults/VaultStatsCard"
import { VaultStatsRow } from "@/components/vaults/VaultStatsRow"
import { MarketSummary } from "@/components/market/MarketSummary"
import { SettlementCurveChart } from "@/components/market/SettlementCurveChart"
import { chainLogoSrc } from "@/lib/chain-logos"
import { tokenLogoSrc } from "@/lib/token-logos"
import { requireWalletConnected } from "@/lib/stake-gating"
import { usePortfolioStore } from "@/stores/portfolio-store"
import { useUiStore } from "@/stores/ui-store"
import { useWalletStore } from "@/stores/wallet-store"
import type { Vault } from "@/types"

interface VaultDetailsProps {
  vault: Vault
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
 * Client shell for /vaults/[vaultId] — the hero screen. See
 * plan/06-vault-details-and-prediction.md and its Figma redesign follow-up.
 * The vault itself is fetched server-side (data/vaults.ts) and passed down;
 * this component only owns client-side session state (selected deposit
 * type, positions, modal triggers).
 *
 * Layout is deliberately split into two sections:
 *  1. A structural match of the Figma `VaultDetails` design — header/chain
 *     +asset chips, 4-stat row, real History & Performance chart, and
 *     General information all inside ONE bordered card (matching the
 *     single white rounded rect in the Figma frame), with the
 *     Deposit/Withdraw action panel as its own separate card alongside —
 *     see plan/figma-mapping.md.
 *  2. Everything Prism-specific that the source design doesn't cover
 *     (single-number market summary, settlement graphic showing all 3
 *     deposit types at once, vault stats aside, positions, about blurb) —
 *     kept as its own "Prism market" section below, per plan/06 §4-§8.
 */
export function VaultDetails({ vault }: VaultDetailsProps) {
  const selectedProfile = useUiStore((state) => state.selectedProfile)
  const setProfile = useUiStore((state) => state.setProfile)
  const openDeposit = useUiStore((state) => state.openDeposit)
  const openWithdraw = useUiStore((state) => state.openWithdraw)
  const connected = useWalletStore((state) => state.connected)

  function handleOpenDeposit() {
    if (requireWalletConnected(connected, "deposit")) openDeposit(vault.id)
  }
  function handleOpenWithdraw(positionId: string) {
    if (requireWalletConnected(connected, "withdraw")) openWithdraw(positionId)
  }

  const allPositions = usePortfolioStore((state) => state.positions)
  const vaultPositions = useMemo(
    () => allPositions.filter((position) => position.vaultId === vault.id),
    [allPositions, vault.id]
  )

  // Live positions keep accruing (per lib/portfolio.ts) even though the
  // chart/market itself is static — tick `now` so their value visibly moves,
  // matching the "still ticking" demo beat. No-op once matured, since
  // currentValue() already clamps to marketEndAt.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (vault.market.matured || vaultPositions.length === 0) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [vault.market.matured, vaultPositions.length])

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/vaults">Vaults</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vault.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ---- Section 1: structural match of the Figma VaultDetails design ---- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-2xl font-medium text-foreground">{vault.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Avatar size="sm" title={vault.chainLabel}>
                    {chainLogoSrc(vault.chainLabel) && (
                      <AvatarImage src={chainLogoSrc(vault.chainLabel)} alt={vault.chainLabel} />
                    )}
                    <AvatarFallback>{initials(vault.chainLabel)}</AvatarFallback>
                  </Avatar>
                  {vault.chainLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Avatar size="sm" title={vault.asset}>
                    {tokenLogoSrc(vault.asset) && (
                      <AvatarImage src={tokenLogoSrc(vault.asset)} alt={vault.asset} />
                    )}
                    <AvatarFallback>{initials(vault.asset)}</AvatarFallback>
                  </Avatar>
                  {vault.asset}
                </span>
                <span>{vault.protocol}</span>
              </div>
            </div>

            <VaultStatsRow vault={vault} />

            <div className="border-t pt-6">
              <VaultPerformanceChart vault={vault} />
            </div>

            <div className="border-t pt-6">
              <VaultGeneralInfo vault={vault} />
            </div>
          </CardContent>
        </Card>

        <VaultActionPanel
          vault={vault}
          profile={selectedProfile}
          onProfileChange={setProfile}
          positions={vaultPositions}
          onDeposit={handleOpenDeposit}
          onWithdraw={handleOpenWithdraw}
          className="self-start"
        />
      </div>

      {/* ---- Section 2: Prism-specific content, not part of the source design ---- */}
      <div className="flex flex-col gap-6 border-t pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-lg font-medium text-foreground">Prism market</h2>
          <MaturityBadge vault={vault} />
          <Badge variant="outline">{vault.category}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <MarketSummary vault={vault} />
            <div className="rounded-xl border bg-card p-6">
              <SettlementCurveChart vault={vault} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <VaultStatsCard vault={vault} />

            {vaultPositions.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">
                  {vaultPositions.length > 1 ? "Your positions" : "Your position"}
                </h3>
                {vaultPositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    vault={vault}
                    now={now}
                    onWithdraw={() => handleOpenWithdraw(position.id)}
                  />
                ))}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>About this vault</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{vault.description}</p>
                <Link href="/how-it-works" className="text-primary hover:underline">
                  How Prism markets work {"\u2192"}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ModalRoot vaults={[vault]} />
    </div>
  )
}
