import { elevatedSettlementApy, stableSettlementApy, toMarketParams } from "@/lib/prism"
import type { RiskProfile, Vault } from "@/types"

interface SettlementPreviewTableProps {
  vault: Vault
  profile: RiskProfile
}

const PREVIEW_REALIZED_APYS = [2, 4, 6, 8, 10]

/**
 * "Real APY -> You receive" settlement preview grid — a discretized read of
 * the Stable/Elevated settlement curve (lib/prism.ts) at a handful of
 * sample points. Shared by `VaultActionPanel` (details sidebar preview) and
 * the deposit modal's `DepositPanel` (plan/07 §3) so the two never drift.
 * No wrapper border/padding here — callers own their own spacing.
 */
export function SettlementPreviewTable({ vault, profile }: SettlementPreviewTableProps) {
  const { market } = vault

  if (profile === "standard") {
    return (
      <p className="text-xs text-muted-foreground">
        Standard deposits earn the vault{"\u2019"}s spot APY directly {"\u2014"} no Prism market
        exposure.
      </p>
    )
  }

  const params = toMarketParams(market.targetApy, market.protectionBuffer)
  const settle = profile === "elevated" ? elevatedSettlementApy : stableSettlementApy

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Expected performance</span>
      <div className="overflow-hidden rounded-lg border text-xs">
        <div className="grid grid-cols-6 gap-1 bg-muted/60 px-2 py-1.5 font-medium text-muted-foreground">
          <span className="col-span-1">Real APY</span>
          {PREVIEW_REALIZED_APYS.map((x) => (
            <span key={x} className="text-right tabular-nums">
              {x}%
            </span>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1 px-2 py-1.5">
          <span className="col-span-1 text-muted-foreground">You receive</span>
          {PREVIEW_REALIZED_APYS.map((x) => (
            <span key={x} className="text-right font-medium tabular-nums text-foreground">
              {settle(x, params).toFixed(1)}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
