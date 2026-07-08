"use client"

import { useState } from "react"
import { ShieldCheck, TrendingUp } from "lucide-react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { cn } from "@/lib/utils"

type Side = "stable" | "elevated"

const SIDES: Array<{
  id: Side
  label: string
  tagline: string
  icon: typeof ShieldCheck
  ringClass: string
  iconClass: string
  iconBgClass: string
  bgClass: string
}> = [
  {
    id: "stable",
    label: "Stable",
    tagline: "Profits if APY ends up lower than the market expected — downside protection.",
    icon: ShieldCheck,
    ringClass: "ring-profile-stable",
    iconClass: "text-profile-stable",
    iconBgClass: "bg-profile-stable/10",
    bgClass: "bg-profile-stable/5",
  },
  {
    id: "elevated",
    label: "Elevated",
    tagline: "Profits if APY ends up higher than expected — upside amplification.",
    icon: TrendingUp,
    ringClass: "ring-profile-elevated",
    iconClass: "text-profile-elevated",
    iconBgClass: "bg-profile-elevated/10",
    bgClass: "bg-profile-elevated/5",
  },
]

/** Step 5: pick the side that matches your view. Local selection only. */
export function PickSideDiagram() {
  const [selected, setSelected] = useState<Side>("stable")

  return (
    <DiagramFrame caption="You break even at the APY priced in when you entered.">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {SIDES.map((side) => {
          const Icon = side.icon
          const active = selected === side.id
          return (
            <button
              key={side.id}
              type="button"
              onClick={() => setSelected(side.id)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-3 rounded-xl p-5 text-left ring-1 transition-all",
                active
                  ? cn("ring-2", side.ringClass, side.bgClass)
                  : "bg-card ring-border hover:ring-muted-foreground/40"
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  side.iconBgClass,
                  side.iconClass
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-heading text-lg font-medium text-foreground">
                {side.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {side.tagline}
              </span>
            </button>
          )
        })}
      </div>
    </DiagramFrame>
  )
}
