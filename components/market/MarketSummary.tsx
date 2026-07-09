import { LabeledStat } from "@/components/common/LabeledStat"
import { PercentDelta } from "@/components/common/PercentDelta"
import { formatApy, formatDate, formatPrice } from "@/lib/format"
import { daysUntil } from "@/lib/vault-filters"
import type { Vault } from "@/types"

interface MarketSummaryProps {
  vault: Vault
}

/**
 * The single-number headline + market parameters for this vault's Prism
 * market. Deliberately never renders a band/curve/confidence score — see
 * plan/06-vault-details-and-prediction.md §4 and plan/04 §0.
 *
 * No longer gated by a selected deposit type (per the Figma redesign
 * follow-up, point 4): this is a market overview, not a per-profile view,
 * so it always shows the market-implied Predicted APY headline plus both
 * tokens' prices. The actual Standard/Stable/Elevated choice is made in the
 * Deposit panel (VaultActionPanel), which still has its own
 * ProfileCardSelector.
 */
export function MarketSummary({ vault }: MarketSummaryProps) {
  const { market } = vault
  const deltaVsCurrent = market.impliedApy - vault.currentApy
  const daysLeft = daysUntil(market.marketEndAt)

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
      {/* Grid (not two separate flex columns) so each row lines up exactly
          across both columns — row 1 labels, row 2 the two APY numbers,
          row 3 the Stable/Elevated prices (with row 3 col 2 left empty). */}
      <div className="grid grid-cols-[auto_auto] items-baseline justify-between gap-x-4 gap-y-1.5">
        <span className="text-sm text-muted-foreground">Predicted APY</span>
        <span className="justify-self-end text-xs text-muted-foreground">
          Current APY
        </span>

        <span className="font-heading text-4xl font-semibold text-primary">
          {formatApy(market.impliedApy)}
        </span>
        <div className="flex items-center gap-2 justify-self-end">
          <span className="font-medium tabular-nums text-foreground">
            {formatApy(vault.currentApy)}
          </span>
          <PercentDelta value={deltaVsCurrent} />
        </div>

        <span className="text-sm text-muted-foreground">
          Stable {formatPrice(market.stablePrice)} · Elevated {formatPrice(market.elevatedPrice)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3">
        <LabeledStat label="Target APY" value={formatApy(market.targetApy)} />
        <LabeledStat
          label="Protection buffer"
          value={`${market.protectionBuffer.toFixed(1)} pts`}
        />
        <LabeledStat
          label="Protected while realized APY \u2265"
          value={formatApy(market.boundaryApy)}
        />
      </div>

      <div className="flex flex-col gap-1 border-t pt-4 text-sm">
        <span className="text-muted-foreground">
          Market runs {formatDate(market.marketStartAt)} {"\u2192"} {formatDate(market.marketEndAt)}
        </span>
        <span className="font-medium text-foreground">
          {market.matured
            ? `Settled \u2014 final realized APY: ${formatApy(market.realizedApySoFar)}`
            : `Ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Illustrative APY market. Not financial advice.
      </p>
    </div>
  )
}
