import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { PercentDelta } from "@/components/common/PercentDelta"
import { currentValue, earnings, effectiveApyForPosition } from "@/lib/portfolio"
import { formatUsd } from "@/lib/format"
import type { Position, Vault } from "@/types"

interface PositionCardProps {
  position: Position
  vault: Vault
  now: number
  onWithdraw: () => void
}

/**
 * A single held position for this vault. Value/earnings are DERIVED via
 * lib/portfolio.ts (never a static multiplier) — see
 * plan/06-vault-details-and-prediction.md §7. A vault can have more than one
 * position at once (e.g. a Standard lot alongside a Stable lot), so this
 * renders per-position rather than assuming a single holding.
 */
export function PositionCard({ position, vault, now, onWithdraw }: PositionCardProps) {
  const value = currentValue(position, vault, now)
  const gain = earnings(position, vault, now)
  const apy = effectiveApyForPosition(position, vault) * 100

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <ProfileBadge profile={position.profile} />
          <PercentDelta value={apy} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Current value</span>
          <span className="font-heading text-lg font-medium tabular-nums text-foreground">
            {formatUsd(value)}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Earnings</span>
          <span className={gain >= 0 ? "text-positive" : "text-destructive"}>
            {gain >= 0 ? "+" : ""}
            {formatUsd(gain)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onWithdraw}>
          Withdraw
        </Button>
      </CardContent>
    </Card>
  )
}
