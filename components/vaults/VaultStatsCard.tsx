import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LabeledStat } from "@/components/common/LabeledStat"
import { formatApy, formatDate, formatUsd } from "@/lib/format"
import type { Vault } from "@/types"

interface VaultStatsCardProps {
  vault: Vault
}

/** Aside stats: TVL, current APY, category, chain, market period. See plan/06 §2. */
export function VaultStatsCard({ vault }: VaultStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vault stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <LabeledStat label="TVL" value={formatUsd(vault.tvlUsd)} />
        <LabeledStat label="Current APY" value={formatApy(vault.currentApy)} />
        <LabeledStat label="Category" value={vault.category} />
        <LabeledStat label="Chain" value={vault.chainLabel} />
        <LabeledStat
          label="Market period"
          className="col-span-2"
          value={`${formatDate(vault.market.marketStartAt)} \u2013 ${formatDate(vault.market.marketEndAt)}`}
        />
      </CardContent>
    </Card>
  )
}
