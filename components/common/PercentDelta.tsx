import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

interface PercentDeltaProps {
  value: number
  className?: string
}

export function PercentDelta({ value, className }: PercentDeltaProps) {
  const isPositive = value >= 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-transparent",
        isPositive
          ? "bg-positive/10 text-positive"
          : "bg-destructive/10 text-destructive",
        className
      )}
    >
      <Icon />
      {formatPercent(value)}
    </Badge>
  )
}
