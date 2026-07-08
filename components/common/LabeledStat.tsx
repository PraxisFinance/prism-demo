import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface LabeledStatProps {
  label: string
  value: ReactNode
  className?: string
}

/**
 * Compact label-over-value pair, for rows of small stats (market parameters,
 * vault stats aside) where the bigger `StatCard` would be too heavy. See
 * plan/06-vault-details-and-prediction.md §4, §2.
 */
export function LabeledStat({ label, value, className }: LabeledStatProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  )
}
