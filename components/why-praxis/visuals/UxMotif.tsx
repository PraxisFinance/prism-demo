import { LineChart, ShieldCheck, TrendingUp } from "lucide-react"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import { cn } from "@/lib/utils"

const FEATURES: Array<{
  icon: typeof LineChart
  label: string
  className: string
}> = [
  { icon: LineChart, label: "Readable APY forecast", className: "text-primary" },
  {
    icon: ShieldCheck,
    label: "One-click hedge",
    className: "text-profile-stable",
  },
  {
    icon: TrendingUp,
    label: "Upside play",
    className: "text-profile-elevated",
  },
]

function FeatureRows() {
  return (
    <div className="flex w-full flex-col gap-2">
      {FEATURES.map((f) => {
        const Icon = f.icon
        return (
          <div
            key={f.label}
            className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 ring-1 ring-border"
          >
            <Icon className={cn("size-4 shrink-0", f.className)} />
            <span className="text-sm text-foreground">{f.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Chains / better UX: a compact stack of the user-facing features every vault
 * gains. Bare inline or framed in the dialog. See plan/10 §6.
 */
export function UxMotif({ bare = false }: { bare?: boolean }) {
  if (bare) return <FeatureRows />
  return (
    <DiagramFrame caption="What every vault gains for its users.">
      <FeatureRows />
    </DiagramFrame>
  )
}
