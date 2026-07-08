import { StatCard } from "@/components/common/StatCard"
import { formatApy, formatUsd } from "@/lib/format"
import type { Vault } from "@/types"

interface VaultStatsRowProps {
  vault: Vault
}

/**
 * The 4-stat row from the Figma VaultDetails design (Total Deposits /
 * Liquidity / Current APY / Predicted APY). We only model a single TVL
 * number — no separate deposits-vs-liquidity split — so both slots read
 * from `tvlUsd` rather than inventing a second number. See plan/06 redesign
 * Q&A.
 */
export function VaultStatsRow({ vault }: VaultStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Total Deposits" value={formatUsd(vault.tvlUsd)} />
      <StatCard label="Liquidity" value={formatUsd(vault.tvlUsd)} />
      <StatCard label="Current APY" value={formatApy(vault.currentApy)} />
      <StatCard label="Predicted APY" value={formatApy(vault.market.impliedApy)} />
    </div>
  )
}
