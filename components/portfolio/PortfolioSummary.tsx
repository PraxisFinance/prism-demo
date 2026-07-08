import { StatCard } from "@/components/common/StatCard"
import { PercentDelta } from "@/components/common/PercentDelta"
import { formatApy, formatUsd } from "@/lib/format"
import type { PortfolioTotals } from "@/lib/portfolio"

interface PortfolioSummaryProps {
  totals: PortfolioTotals
  walletBalanceUsd: number
}

/** The 4 headline stat cards — plan/08 §3. All derived via lib/portfolio.ts, never a static multiplier. */
export function PortfolioSummary({ totals, walletBalanceUsd }: PortfolioSummaryProps) {
  const earningsPct = totals.totalPrincipal > 0 ? (totals.totalEarnings / totals.totalPrincipal) * 100 : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total value" value={formatUsd(totals.totalValue)} />
      <StatCard
        label="Total earnings"
        value={
          <span className={totals.totalEarnings >= 0 ? "text-positive" : "text-destructive"}>
            {totals.totalEarnings >= 0 ? "+" : ""}
            {formatUsd(totals.totalEarnings)}
          </span>
        }
        delta={<PercentDelta value={earningsPct} />}
      />
      <StatCard label="Blended predicted APY" value={formatApy(totals.blendedApy * 100)} />
      <StatCard label="Wallet balance" value={formatUsd(walletBalanceUsd)} />
    </div>
  )
}
