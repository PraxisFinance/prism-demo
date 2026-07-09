import type { ReactNode } from "react"

import { StatCard } from "@/components/common/StatCard"
import { PercentDelta } from "@/components/common/PercentDelta"
import { formatApy, formatUsd } from "@/lib/format"
import type { PortfolioTotals } from "@/lib/portfolio"

interface PortfolioSummaryProps {
  totals: PortfolioTotals
  walletBalanceUsd: number
  chart: ReactNode
}

/**
 * The 4 headline stat cards + allocation chart — plan/08 §3. All stats derived
 * via lib/portfolio.ts, never a static multiplier. Laid out as a 3x2 grid on
 * `lg+` (stat, stat, chart / stat, stat, chart-continued — chart spans both
 * rows in the 3rd column), collapsing to a single stacked column below that.
 */
export function PortfolioSummary({ totals, walletBalanceUsd, chart }: PortfolioSummaryProps) {
  const earningsPct = totals.totalPrincipal > 0 ? (totals.totalEarnings / totals.totalPrincipal) * 100 : 0

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <StatCard label="Wallet balance" value={formatUsd(walletBalanceUsd)} className="lg:col-start-1 lg:row-start-1" />
      <StatCard label="Total value" value={formatUsd(totals.totalValue)} className="lg:col-start-2 lg:row-start-1" />
      <StatCard
        label="Total earnings"
        value={
          <span className={totals.totalEarnings >= 0 ? "text-positive" : "text-destructive"}>
            {totals.totalEarnings >= 0 ? "+" : ""}
            {formatUsd(totals.totalEarnings)}
          </span>
        }
        delta={<PercentDelta value={earningsPct} />}
        className="lg:col-start-1 lg:row-start-2"
      />
      <StatCard
        label="Blended predicted APY"
        value={formatApy(totals.blendedApy * 100)}
        className="lg:col-start-2 lg:row-start-2"
      />
      <div className="lg:col-start-3 lg:row-start-1 lg:row-span-2">{chart}</div>
    </div>
  )
}
