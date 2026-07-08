import { Badge } from "@/components/ui/badge"
import { daysUntil } from "@/lib/vault-filters"
import type { Vault } from "@/types"

/**
 * Live/Matured lifecycle badge, shared by the vault list (plan/05) and vault
 * details header (plan/06 §2) so the two screens never drift.
 */
export function MaturityBadge({ vault }: { vault: Vault }) {
  if (vault.market.matured) {
    return <Badge variant="secondary">Matured</Badge>
  }
  const days = daysUntil(vault.market.marketEndAt)
  return (
    <Badge variant="outline" className="border-positive/30 text-positive">
      Live {"\u2014"} {days}d left
    </Badge>
  )
}
