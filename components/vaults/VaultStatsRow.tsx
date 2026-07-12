import { formatApy, formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Vault } from "@/types"

interface VaultStatsRowProps {
  vault: Vault
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-heading text-2xl font-medium text-foreground">{value}</span>
    </div>
  )
}

/**
 * The 4-stat row from the Figma VaultDetails design (Total Deposits /
 * Liquidity / Current APY / Predicted APY). We only model a single TVL
 * number — no separate deposits-vs-liquidity split — so both slots read
 * from `tvlUsd` rather than inventing a second number. See plan/06 redesign
 * Q&A.
 *
 * Predicted APY is dropped once the market has matured — it's a forecast
 * (`market.impliedApy`) that can diverge from the now-realized `currentApy`,
 * which would read as a bug rather than a feature once there's nothing left
 * to predict.
 *
 * Plain label/value pairs (no individual card/border) — Figma shows these
 * sitting directly on the shared "info card" surface, not as separate
 * boxed stat cards. See plan/figma-mapping.md.
 */
export function VaultStatsRow({ vault }: VaultStatsRowProps) {
  const matured = vault.market.matured
  return (
    <div className={cn("grid grid-cols-2 gap-4", matured ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
      <Stat label="Total Deposits" value={formatUsd(vault.tvlUsd)} />
      <Stat label="Liquidity" value={formatUsd(vault.tvlUsd)} />
      <Stat label="Current APY" value={formatApy(vault.currentApy)} />
      {!matured && <Stat label="Predicted APY" value={formatApy(vault.market.impliedApy)} />}
    </div>
  )
}
