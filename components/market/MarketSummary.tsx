import { LabeledStat } from "@/components/common/LabeledStat"
import { PercentDelta } from "@/components/common/PercentDelta"
import { StatCard } from "@/components/common/StatCard"
import { formatApy, formatDate, formatPrice } from "@/lib/format"
import { PROFILE_CLASSES } from "@/lib/profiles"
import { cn } from "@/lib/utils"
import { daysUntil } from "@/lib/vault-filters"
import type { RiskProfile, Vault } from "@/types"

interface MarketSummaryProps {
  vault: Vault
  profile: RiskProfile
}

/**
 * The single-number headline + market parameters for this vault's Prism
 * market. Deliberately never renders a band/curve/confidence score — see
 * plan/06-vault-details-and-prediction.md §4 and plan/04 §0.
 */
export function MarketSummary({ vault, profile }: MarketSummaryProps) {
  const { market } = vault
  const isMarketView = profile !== "standard"
  const headline = isMarketView ? market.impliedApy : vault.currentApy
  const headlineLabel = isMarketView ? "Predicted APY" : "Current APY"
  const tokenPrice = profile === "stable" ? market.stablePrice : profile === "elevated" ? market.elevatedPrice : null
  const deltaVsCurrent = headline - vault.currentApy
  const daysLeft = daysUntil(market.marketEndAt)

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <StatCard
          className="ring-0 p-0"
          label={headlineLabel}
          value={
            <span
              className={cn(
                "font-heading text-4xl font-semibold",
                PROFILE_CLASSES[profile].text
              )}
            >
              {formatApy(headline)}
            </span>
          }
          delta={
            tokenPrice !== null ? (
              <span className="text-sm text-muted-foreground">
                {formatPrice(tokenPrice)} / token
              </span>
            ) : undefined
          }
        />
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs text-muted-foreground">Current APY</span>
          <div className="flex items-center gap-2">
            <span className="font-medium tabular-nums text-foreground">
              {formatApy(vault.currentApy)}
            </span>
            <PercentDelta value={deltaVsCurrent} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3">
        <LabeledStat label="Target APY" value={formatApy(market.targetApy)} />
        <LabeledStat
          label="Protection buffer"
          value={`${market.protectionBuffer.toFixed(1)} pts`}
        />
        {isMarketView && (
          <LabeledStat
            label="Protected while realized APY \u2265"
            value={formatApy(market.boundaryApy)}
          />
        )}
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
